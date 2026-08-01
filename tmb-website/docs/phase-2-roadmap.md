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

## 6. Templates — ✅ Built

Six of the book's 12 workbook tools, built as real, fillable `.xlsx`
files with working formulas (auto-calculating net worth, budget
variance, etc.) — not just the static tables in the book's own appendix.
The other 6 (checklists + the AI Prompt Library) stay as book-appendix
content only, since a checklist doesn't gain much from being a separate
spreadsheet.

**Setup — one manual step, no SQL migration needed** (`downloads_log`
already existed in the original schema):

1. Supabase dashboard → **Storage** (left sidebar) → **New bucket**
2. Name it exactly `templates`, and set it to **Private** (not public —
   access is gated by purchase status in `app/api/templates/[slug]`, and
   a public bucket would bypass that entirely)
3. Upload all 6 `.xlsx` files into that bucket, filenames exactly as
   sent (e.g. `Net_Worth_Tracker.xlsx`) — they must match
   `lib/templates-data.ts`'s `filename` field exactly, or the signed URL
   generation will fail to find them

Once uploaded, `/dashboard/templates` will show all 6 with working
download buttons for any user with a successful purchase.

## 7. Suggested Build Order — all originally-planned items done

1. ~~Auth~~ ✅
2. ~~Dashboard read/write (progress, bookmarks)~~ ✅
3. ~~Payments (Paystack)~~ ✅
4. ~~AI Coach~~ ✅
5. ~~Templates~~ ✅
6. ~~The actual book file~~ ✅ (a real, late-discovered gap — everything
   else was built assuming the reader had the book, but nothing actually
   delivered it until now)

Not yet built, and not originally requested until now: Membership,
Courses — both still "Coming Soon" placeholders on `/pricing`.

## 8. Book Delivery — ✅ Built (this was missing until a user caught it)

The actual 259-page PDF, gated the same way as templates:

1. Supabase → **Storage** → **New bucket** → name it exactly `books` →
   **Private**
2. Upload `The_Modern_Money_Blueprint.pdf` (sent alongside the code) —
   filename must match exactly what `app/api/book/route.ts` requests
3. `/api/book` checks purchase status, then returns a 60-second signed
   URL — same pattern as `/api/templates/[slug]`

Surfaced in three places: a prominent banner at the top of `/dashboard`,
a direct download button on the checkout success page, and available any
time via that same dashboard banner going forward.

**Also corrected**: the pricing page previously promised "PDF + EPUB" —
only a PDF was ever actually built, so the claim was fixed to match what's
actually delivered rather than leaving a false promise live.

## 9. In-App Reader — ✅ Built (another real gap a user caught)

The dashboard's chapter checklist let people mark chapters "read" with
nothing to actually read in-app — they'd have to read the downloaded PDF
externally, then come back to check boxes. Now there's a real reader:

1. `lib/reader-content*.ts` — the **full, real content** of all 49
   chapters (hook, every section's actual prose, full case studies,
   fully-explained mistakes, takeaways — ~37,000 words total), extracted
   programmatically from the original manuscript source, not summarized
2. `app/dashboard/read/[chapter]/page.tsx` — renders each chapter, gated
   by purchase, with a working "Mark as Read" button wired to the
   already-existing `/api/progress` route, plus previous/next navigation
3. Every chapter title in the dashboard's progress checklist now links
   directly to its reader page

No new setup required — this uses content bundled directly in the
codebase, not Supabase Storage, since it needs to load instantly as you
navigate between chapters rather than fetching a file each time.

## 10. Online, Fillable Templates — ✅ Built

Each of the 6 templates is now usable two ways: download the Excel file
(unchanged), or fill it in directly at `/dashboard/templates/[slug]` —
real inputs, auto-saved 1.2s after you stop typing, still there next time
you visit.

**No new setup** — this reuses `worksheet_responses`, a table that
already existed from the original Phase 2 schema and was never actually
used until now.

- `app/api/worksheets/[slug]/route.ts` — generic save/load, works for any
  of the 6 templates by slug, purchase-gated
- `lib/use-worksheet-autosave.ts` — the shared debounced-save hook every
  form uses
- `components/worksheets/*` — 4 form types: a numeric grid with live
  totals (Net Worth), a sectioned budget grid with a balance check, a
  repeatable-row goal tracker, and a generic prompt form (reused for the
  3 reflection-style templates)

## 11. Two Fixes From Direct User Testing

**The HTTP 500 error**: download links were raw `<a href>` tags pointing
straight at API routes — any failure (like a Storage bucket not existing
yet) meant the *browser* rendered its own generic error page, not
anything in this app's control. Fixed by making every download a
client-side fetch that checks the response first
(`components/download-button.tsx`), only navigating on success and
showing a friendly inline message otherwise.

**Nav visibility after purchase**: Read a Sample, Pricing, and the Author
link now disappear from the nav (`components/nav.tsx`,
`components/nav-server.tsx`) once a user has a successful purchase —
those are pre-purchase decision-making pages, not useful once someone
already owns the book.

