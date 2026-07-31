# Phase 2 Roadmap

Phase 1 (the marketing site) is complete. **Auth and the read/write dashboard
are now built too** — see the status below. What's left is AI Coach and
payments.

## 1. Prerequisites — the one manual step left

- Create a Supabase project (free tier is enough) at supabase.com
- Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
  Project Settings → API into `.env.local` (for local dev) and into your
  Vercel project's Environment Variables (for production)
- Run `docs/database-schema.sql` in the Supabase SQL editor

**Nothing else in this codebase will work until this step is done** — the
auth pages, middleware, and dashboard are all written correctly but will
error out without real Supabase credentials behind them.

## 2. Auth — ✅ Built

- `lib/supabase/client.ts` / `lib/supabase/server.ts` — browser and server
  Supabase clients using `@supabase/ssr`
- `middleware.ts` — refreshes the session on every request, redirects
  unauthenticated visitors away from `/dashboard/*` to `/login`
- `app/login/page.tsx`, `app/signup/page.tsx` — password + magic-link auth
- `app/auth/callback/route.ts` — handles magic-link/email-confirm redirects
- `app/auth/signout/route.ts` — sign-out handler
- `components/nav-server.tsx` — Server Component that checks session and
  passes it into the (client) Nav, so "Log In" vs. "Dashboard" shows
  correctly with no client-side flash

## 3. Dashboard — ✅ Built (read + write)

`app/dashboard/page.tsx` is a real Server Component: checks the session,
queries `reading_progress` and `bookmarks` for the current user, and
renders progress bars per part against `lib/book-data.ts` — the same
source of truth the public Table of Contents page uses, so nothing can
drift out of sync between them.

Mutations go through Route Handlers, not direct client-side writes:
- `app/api/progress/route.ts` — POST to mark a chapter read, DELETE to unmark
- `app/api/bookmarks/route.ts` — POST to add a bookmark, DELETE to remove

Both validate input with `zod` and check `auth.getUser()` before touching
the database — RLS in `database-schema.sql` is the second layer of defense,
not the only one.

**Not yet built**: UI buttons that actually call these two routes from
inside the reading experience (e.g., a "Mark chapter read" button on a
chapter page). The routes work; nothing currently calls them. That's the
natural next increment.

## 4. AI Coach — Not yet built

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

## 5. Payments / Memberships — Not yet built

Stripe is the natural fit given Vercel + Supabase. A `subscriptions` table
(user_id, stripe_customer_id, status, tier) gates access to
`/dashboard/coach` and future course content via a simple RLS policy
checking `status = 'active'`.

## 6. Suggested Build Order (updated)

1. ~~Auth (login/signup, middleware, session-aware Nav state)~~ ✅ Done
2. ~~Dashboard read/write (progress, bookmarks)~~ ✅ Done
3. Wire "mark as read" / "bookmark" buttons into an actual chapter-reading
   UI (the routes exist; nothing calls them yet)
4. Stripe + subscriptions table
5. AI Coach (RAG pipeline)

