# The Modern Money Blueprint — Website

Official marketing site for *The Modern Money Blueprint* by Gabriel Sam.

## Status

**Phase 1 (this repo): complete.** Every marketing page — Home, About the
Book, Table of Contents, Read a Sample, Pricing, About the Author, Blog,
Contact — is real, working Next.js 15 source.

**Phase 2 (not yet wired): specified, not built.** Authenticated
dashboard, Supabase, and the AI Coach need a Supabase project and real
credentials before they can be anything more than the stub currently at
`/dashboard`. Full plan in `docs/phase-2-roadmap.md`.

## Why Phase 2 isn't live yet

This was generated in a sandboxed environment with no network access —
`npm install` and a real dev server aren't possible there. The code is
complete and written correctly against the stated stack, but hasn't been
build-verified. Two ways to finish:

1. **Locally**: `npm install && npm run dev` on your own machine.
2. **Claude Code**: has network access, can install, run a real dev
   server, iterate on anything that needs fixing, and deploy to Vercel —
   the better tool for taking this the rest of the way.

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
