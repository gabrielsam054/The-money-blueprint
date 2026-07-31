-- The Modern Money Blueprint — AI Coach schema
-- Run this in the Supabase SQL editor in ADDITION to the previous two
-- schema files (this is new, not a replacement).

create extension if not exists vector;

-- Holds the book's content, chunked by chapter, with an embedding per
-- chunk for semantic search. Populated once by running
-- scripts/generate-embeddings.mjs locally (see docs/phase-2-roadmap.md).
create table book_chunks (
  id uuid primary key default gen_random_uuid(),
  chapter_number int not null,
  chapter_title text not null,
  part_title text not null,
  content text not null,
  embedding vector(1024) -- voyage-3.5 default output dimension
);

-- ivfflat index for fast approximate nearest-neighbor search. lists=50 is
-- a reasonable default for a few hundred rows (49 chapters worth of
-- chunks) — Supabase's own docs suggest roughly sqrt(row_count) as a
-- starting point, which comfortably covers this table's size.
create index book_chunks_embedding_idx
  on book_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

-- Similarity search function: given a query embedding, returns the
-- closest chunks by cosine similarity. Called from lib/ai-coach.ts via
-- supabase.rpc('match_book_chunks', ...).
create or replace function match_book_chunks(
  query_embedding vector(1024),
  match_count int default 5
)
returns table (
  chapter_number int,
  chapter_title text,
  part_title text,
  content text,
  similarity float
)
language sql stable
as $$
  select
    chapter_number,
    chapter_title,
    part_title,
    content,
    1 - (embedding <=> query_embedding) as similarity
  from book_chunks
  order by embedding <=> query_embedding
  limit match_count;
$$;

-- book_chunks holds the book's own content (not user data), so it's
-- readable by anyone signed in — RLS still enabled as a deliberate
-- default rather than leaving the table fully open.
alter table book_chunks enable row level security;
create policy "authenticated users can read book chunks"
  on book_chunks for select
  using (auth.role() = 'authenticated');
