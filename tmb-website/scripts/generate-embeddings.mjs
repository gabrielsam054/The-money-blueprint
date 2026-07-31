// One-time setup script — run this once (and again any time book-content
// changes) to embed all 49 chapter chunks and upload them to Supabase.
//
// Requires Node 20.6+ (for --env-file). Run from the project root:
//
//   node --env-file=.env.local scripts/generate-embeddings.mjs
//
// Needs these three vars in .env.local:
//   VOYAGE_API_KEY
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "@supabase/supabase-js";

async function loadBookChunks() {
  // Reads directly from the compiled TypeScript source at runtime isn't
  // possible in plain Node, so this script keeps its own copy of the
  // import path via a tiny transpile-free re-require of the .ts files'
  // exported array shape. Simplest reliable approach: dynamically import
  // via tsx if available, otherwise fall back to instructions.
  try {
    const { allBookChunks } = await import("../lib/book-content.ts");
    return allBookChunks;
  } catch {
    console.error(
      "\nCouldn't import lib/book-content.ts directly.\n" +
        "Run this script with tsx instead, which handles TypeScript imports:\n\n" +
        "  npx tsx --env-file=.env.local scripts/generate-embeddings.mjs\n"
    );
    process.exit(1);
  }
}

async function embed(texts) {
  const res = await fetch("https://api.voyageai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: texts,
      model: "voyage-3.5",
      input_type: "document",
      output_dimension: 1024,
    }),
  });
  if (!res.ok) {
    throw new Error(`Voyage API error: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.data.map((d) => d.embedding);
}

async function main() {
  if (
    !process.env.VOYAGE_API_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error(
      "Missing required env vars. Need VOYAGE_API_KEY, NEXT_PUBLIC_SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY."
    );
    process.exit(1);
  }

  const chunks = await loadBookChunks();
  console.log(`Embedding ${chunks.length} chapter chunks...`);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Clear existing chunks first so re-running this script after editing
  // book-content.ts doesn't leave stale duplicates behind.
  await supabase.from("book_chunks").delete().neq("chapter_number", -1);

  // Voyage accepts multiple inputs per request — batch in groups of 10
  // to stay well under any request size limits.
  const BATCH_SIZE = 10;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const embeddings = await embed(batch.map((c) => c.content));

    const rows = batch.map((chunk, j) => ({
      chapter_number: chunk.chapterNumber,
      chapter_title: chunk.chapterTitle,
      part_title: chunk.partTitle,
      content: chunk.content,
      embedding: embeddings[j],
    }));

    const { error } = await supabase.from("book_chunks").insert(rows);
    if (error) throw error;

    console.log(
      `  Uploaded chapters ${batch[0].chapterNumber}–${batch[batch.length - 1].chapterNumber}`
    );
  }

  console.log("\nDone. The AI Coach can now retrieve real book content.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
