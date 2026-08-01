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

## 4. AI Coach — ✅ Built

Single provider (Claude only, no embeddings/vector database) — grounded
in the book's actual content via context, not fine-tuning:

1. `lib/book-content*.ts` — real, condensed content for all 49 chapters
   (hook, core lesson, mistakes, action steps)
2. `lib/ai-coach.ts` — includes that full content directly in every
   request as a cached system-prompt block (Anthropic's prompt caching
   means repeat requests read it at a fraction of normal cost, not full
   price every message), and streams a response constrained to answering
   from it (it's told explicitly to say "the book doesn't cover that"
   rather than inventing an answer)
3. `app/dashboard/coach/page.tsx` + `components/coach-chat.tsx` — the
   actual chat UI, gated behind a successful book purchase

**Requires 2 things to actually work**: `ANTHROPIC_API_KEY`, and at least
one `purchases` row with `status = 'success'` for the account testing it
(i.e., you need to have actually bought the book with that account first
— or manually flip a test row to `'success'` in the
Supabase table editor while testing).

## 5. Payments — ✅ Built (Paystack, not Stripe)

See `docs/database-schema-purchases.sql` and the checkout flow in
`app/api/checkout`, `app/checkout/callback`, and
`app/api/webhooks/paystack`.

## 6. Suggested Build Order (updated)

1. ~~Auth (login/signup, middleware, session-aware Nav state)~~ ✅ Done
2. ~~Dashboard read/write (progress, bookmarks)~~ ✅ Done
3. Wire "mark as read" / "bookmark" buttons into an actual chapter-reading
   UI (the routes exist; nothing calls them yet)
4. Stripe + subscriptions table
5. AI Coach (RAG pipeline)

