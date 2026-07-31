# Phase 2 Roadmap

Phase 1 (this repo, as delivered) is the complete marketing site — no
backend required. This document specifies what Phase 2 involves, so
whoever picks it up (you, a developer, or Claude Code with network access)
has a concrete plan rather than a blank page.

## 1. Prerequisites

- A Supabase project (free tier is enough to start)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Run `docs/database-schema.sql` in the Supabase SQL editor

## 2. Auth

- Supabase Auth, email/password + magic link to start
- Install `@supabase/ssr` (already in `package.json`)
- Add `middleware.ts` that checks session for any `/dashboard/*` route and
  redirects to `/login` if absent
- `/login` and `/signup` pages: simple forms using the same
  react-hook-form + zod pattern already used in `components/contact-form.tsx`

## 3. Dashboard

Replace `app/dashboard/page.tsx` (currently a stub) with a Server Component
that:
1. Reads the session server-side
2. Queries `reading_progress`, `bookmarks`, and `downloads_log` for the
   current user
3. Renders progress against `lib/book-data.ts`'s 49 chapters (already the
   single source of truth, so nothing needs to be duplicated)

Mutations (marking a chapter read, adding a bookmark) should go through
Route Handlers (`app/api/.../route.ts`), not direct client-side Supabase
writes — keeps RLS and validation centralized in one place.

## 4. AI Coach

Explicitly **not** general-purpose ChatGPT — scoped to this book only.

Recommended approach: retrieval-augmented generation, not fine-tuning.
1. Chunk the manuscript by chapter (already structurally clean —
   `lib/book-data.ts` gives you the chapter boundaries) and embed each
   chunk
2. Store embeddings in Supabase's `pgvector` extension
3. On a user question, retrieve the most relevant chunks and pass them as
   context to a completion call, restricted to answering from that
   context
4. Store conversation + message history in `coach_conversations` /
   `coach_messages` (already in the schema)

This keeps answers grounded in the actual book rather than general
knowledge, which is the whole point of it not being ChatGPT.

## 5. Payments / Memberships

Stripe is the natural fit given Vercel + Supabase. A `subscriptions` table
(user_id, stripe_customer_id, status, tier) gates access to
`/dashboard/coach` and future course content via a simple RLS policy
checking `status = 'active'`.

## 6. Suggested Build Order

1. Auth (login/signup, middleware, session-aware Nav state)
2. Dashboard read-only view (progress, bookmarks) — no writes yet
3. Route Handlers for progress/bookmark mutations
4. Stripe + subscriptions table
5. AI Coach (RAG pipeline)
