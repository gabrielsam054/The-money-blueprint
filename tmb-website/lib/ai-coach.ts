import Anthropic from "@anthropic-ai/sdk";
import type { SupabaseClient } from "@supabase/supabase-js";

export const aiCoachConfigured =
  !!process.env.ANTHROPIC_API_KEY && !!process.env.VOYAGE_API_KEY;

interface RetrievedChunk {
  chapter_number: number;
  chapter_title: string;
  part_title: string;
  content: string;
  similarity: number;
}

/** Embeds a user question with Voyage (input_type: 'query' — different
 * from 'document', used when embedding the book chunks themselves — this
 * asymmetry is how Voyage's retrieval models are designed to be used). */
async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3.5",
      input_type: "query",
      output_dimension: 1024,
    }),
  });
  if (!res.ok) throw new Error("Failed to embed question");
  const json = await res.json();
  return json.data[0].embedding;
}

async function retrieveRelevantChunks(
  supabase: SupabaseClient,
  question: string,
  matchCount = 5
): Promise<RetrievedChunk[]> {
  const embedding = await embedQuery(question);
  const { data, error } = await supabase.rpc("match_book_chunks", {
    query_embedding: embedding,
    match_count: matchCount,
  });
  if (error) throw error;
  return data ?? [];
}

const SYSTEM_PROMPT = `You are the AI Coach for "The Modern Money Blueprint" by Gabriel Sam — a book on money mindset, personal finance, business, marketing, AI, scaling, and investing.

You are NOT a general-purpose assistant. You answer using ONLY the book excerpts provided in context below, plus reasonable clarification of how to apply them to the reader's specific situation. Do not draw on outside general knowledge to add claims the book itself doesn't make.

If the retrieved excerpts don't actually cover what's being asked, say so plainly — something like "that's not something this book covers directly" — rather than inventing an answer that sounds like it came from the book. Being visibly honest about the book's actual scope matters more than always having an answer.

If a question veers into a specific personal financial, investment, legal, or tax decision, remind the reader this is educational content, not personalized advice, and suggest a licensed professional — the same standard the book itself holds to in Part IX.

Reference specific chapter numbers when relevant, so the reader can go read the full chapter themselves. Keep answers focused and practical, matching the book's own voice: direct, concrete, no filler.`;

export async function* streamCoachResponse(
  supabase: SupabaseClient,
  question: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[]
) {
  const chunks = await retrieveRelevantChunks(supabase, question);

  const context = chunks
    .map(
      (c) =>
        `[Chapter ${c.chapter_number}: ${c.chapter_title} — ${c.part_title}]\n${c.content}`
    )
    .join("\n\n---\n\n");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-5",
    max_tokens: 1024,
    system: `${SYSTEM_PROMPT}\n\nRelevant book excerpts for this question:\n\n${context}`,
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
