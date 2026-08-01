import Anthropic from "@anthropic-ai/sdk";
import { allBookChunks } from "@/lib/book-content";

/**
 * Single provider: Claude only. No embeddings, no vector search, no
 * second API account.
 *
 * The full condensed book content (all 49 chapters, ~10-14k tokens) is
 * included directly in every request as a cached system-prompt block,
 * rather than retrieving a subset via embeddings first. At this content
 * size, that's simpler and just as accurate — Claude finds what's
 * relevant on its own — and Anthropic's prompt caching means the book
 * content is only charged at full price on the first request; every
 * request after that within the cache window reads it at a fraction of
 * the cost, so this doesn't get expensive as conversations continue.
 */
export const aiCoachConfigured = !!process.env.ANTHROPIC_API_KEY;

const BOOK_CONTENT_BLOCK = allBookChunks
  .map(
    (c) =>
      `[Chapter ${c.chapterNumber}: ${c.chapterTitle} — ${c.partTitle}]\n${c.content}`
  )
  .join("\n\n---\n\n");

const SYSTEM_INSTRUCTIONS = `You are the AI Coach for "The Modern Money Blueprint" by Gabriel Sam — a book on money mindset, personal finance, business, marketing, AI, scaling, and investing.

You are NOT a general-purpose assistant. Answer using ONLY the book content provided below, plus reasonable help applying it to the reader's specific situation. Do not draw on outside general knowledge to add claims the book itself doesn't make.

If the book content below doesn't actually cover what's being asked, say so plainly — something like "that's not something this book covers directly" — rather than inventing an answer that sounds like it came from the book. Being visibly honest about the book's actual scope matters more than always having an answer.

If a question veers into a specific personal financial, investment, legal, or tax decision, remind the reader this is educational content, not personalized advice, and suggest a licensed professional — the same standard the book itself holds to in Part IX.

Reference specific chapter numbers when relevant, so the reader can go read the full chapter themselves. Keep answers focused and practical, matching the book's own voice: direct, concrete, no filler.`;

export async function* streamCoachResponse(
  question: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
) {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system: [
      { type: "text", text: SYSTEM_INSTRUCTIONS },
      {
        type: "text",
        text: `Full book content:\n\n${BOOK_CONTENT_BLOCK}`,
        // Marks this large, static block as cacheable — repeated requests
        // in the same conversation (and across users, within Anthropic's
        // cache window) read it at a fraction of normal input cost
        // instead of paying full price every single message.
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: question },
    ],
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      yield event.delta.text;
    }
  }
}
