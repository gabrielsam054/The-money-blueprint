import Anthropic from "@anthropic-ai/sdk";
import { allBookChunks } from "@/lib/book-content";

/**
 * Single provider: Claude only. No embeddings, no vector search, no
 * second API account.
 *
 * The full condensed book content (all 49 chapters, ~10-14k tokens) is
 * included directly in every request as part of the system prompt,
 * rather than retrieving a subset via embeddings first. At this content
 * size, that's simpler and just as accurate — Claude finds what's
 * relevant on its own.
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
    system: `${SYSTEM_INSTRUCTIONS}\n\nFull book content:\n\n${BOOK_CONTENT_BLOCK}`,
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
