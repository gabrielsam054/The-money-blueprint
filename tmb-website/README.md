# The Modern Money Blueprint — Website

Official marketing site for *The Modern Money Blueprint* by Gabriel Sam.

## Status

**Phase 1: complete and confirmed live** at `the-money-blueprint.vercel.app` —
every marketing page is real, working Next.js.

**Phase 2: auth + dashboard now built.** Login, signup, magic links,
session-aware nav, and a real dashboard reading live progress/bookmarks
from Supabase — all written and type-checked. **Not yet done:** you need
to create an actual Supabase project and add its credentials before any of
it does anything (see `docs/phase-2-roadmap.md`, section 1). AI Coach and
payments are still specced, not built.

## Before Phase 2 code will work

1. Create a free Supabase project at supabase.com
2. Run `docs/database-schema.sql` in its SQL editor
3. Copy your project's URL and anon key into:
   - `.env.local` for local development (`cp .env.example .env.local`)
   - Vercel → your project → Settings → Environment Variables, for production
4. Redeploy

## Why Phase 2 hasn't been tested against real infrastructure

This was generated in a sandboxed environment with no network access —
`npm install` and a real Supabase project aren't possible here. The auth
and dashboard code follows the standard, well-established `@supabase/ssr`
patterns exactly and has been checked with the real TypeScript compiler
(zero errors traceable to the code itself — see the commit history for
what that verification caught and fixed during Phase 1). What it hasn't
had is a live Supabase project to actually authenticate against. Two ways
to finish:

1. **Locally**: `npm install && npm run dev` once your `.env.local` has
   real Supabase credentials.
2. **Claude Code**: has network access, can install, run a real dev
   server against your live Supabase project, and iterate on anything
   that needs fixing — the better tool for this last stretch.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
Lucide · React Hook Form + Zod · Supabase (Phase 2)

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in Supabase keys when you reach Phase 2
npm run dev
```

## What's Real vs. Placeholder

- **Real**: all copy, all book data (`lib/book-data.ts`), all 10
  parts/49 chapters, the 520-idea count, the 12 workbook tools, Chapter 1's
  actual opening content on `/read-a-sample`.
- **Placeholder**: the book cover mockup (currently a styled div, not an
  image), the author photo (gradient placeholder), testimonials (marked as
  early-reader quotes — swap for real ones as they come in), the `$29`
  price point, and `og-image.png` (referenced in metadata, not yet
  generated).

## Folder Structure

See `ARCHITECTURE.md` for the full breakdown.
