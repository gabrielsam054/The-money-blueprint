# The Modern Money Blueprint — Architecture

## 0. Scope of this delivery

This repo contains **Phase 1: the complete marketing site** — every page that doesn't require a live backend. It's real, complete Next.js 15 + TypeScript + Tailwind source, written to run with `npm install && npm run dev`.

**Phase 2** (authenticated dashboard, Supabase, AI Coach) is specified in detail in `docs/phase-2-roadmap.md` and `docs/database-schema.sql`, with route stubs already in place, but not wired to a live database — that requires a Supabase project and credentials only you can provision. Claude Code is the better tool to finish that wiring, since it has network access to install dependencies and run real builds; this environment doesn't.

---

## 1. Information Architecture

```
/                         Home
/about-the-book           Overview, purpose, who it's for, learning outcomes
/table-of-contents        Interactive, searchable, all 10 parts / 49 chapters
/read-a-sample             Intro + About This Book + Chapter 1, rest locked
/pricing                   Book (live) + Membership/AI Coach/Courses/Templates (soon)
/about-gabriel-sam          Author bio, mission, story, vision
/blog                       Index — Money / Business / Marketing / AI / Investing / Entrepreneurship
/blog/[slug]                 Individual post
/contact                    Contact form, newsletter, social

--- Phase 2 (stubbed, not live) ---
/dashboard                  Authenticated home: progress, bookmarks, library
/dashboard/library           Downloads, templates, worksheets
/dashboard/coach              AI Coach (trained on the book's content)
/login, /signup                Supabase Auth
```

## 2. Folder Structure

```
app/
  layout.tsx              Root layout: fonts, metadata, Nav + Footer
  globals.css              Design tokens, base styles
  page.tsx                  Home
  sitemap.ts, robots.ts       SEO
  about-the-book/page.tsx
  table-of-contents/page.tsx
  read-a-sample/page.tsx
  pricing/page.tsx
  about-gabriel-sam/page.tsx
  contact/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  dashboard/page.tsx         Phase 2 stub ("requires Supabase setup")
components/
  nav.tsx, footer.tsx
  ui/                        Small reusable primitives (button, card, badge, accordion)
  home/                      One component per homepage section
  toc-accordion.tsx           Interactive TOC (shared by home preview + full TOC page)
  contact-form.tsx
lib/
  book-data.ts                Typed, real book data (parts, chapters, stats)
  utils.ts
types/
  book.ts
docs/
  database-schema.sql          Phase 2 schema
  phase-2-roadmap.md            Auth plan, AI Coach plan, dashboard plan
```

## 3. Component Architecture

- **Server Components by default** (App Router). Only components with interactivity (accordion state, search filter, form state, animated counters) are marked `"use client"`.
- **`lib/book-data.ts` is the single source of truth** for parts/chapters/stats — the homepage preview, the full TOC page, and (later) the dashboard progress tracker all read from the same typed data, so nothing drifts out of sync.
- **`components/ui/`** holds small, unstyled-opinion primitives (Button, Card, Badge, AccordionItem) built directly in Tailwind. These map 1:1 to what `shadcn/ui` would generate, so swapping in the real shadcn CLI later is a drop-in replacement, not a rewrite.

## 4. Database Schema (Phase 2 — see `docs/database-schema.sql`)

Summary: `profiles`, `reading_progress`, `bookmarks`, `downloads_log`, `worksheet_responses`, `coach_conversations`, `coach_messages` — all keyed to Supabase's built-in `auth.users`, with row-level security scoped to `auth.uid()`.

## 5. Auth Plan (Phase 2)

Supabase Auth (email/password + magic link). Middleware-protected `/dashboard/*` routes. Session read server-side via `@supabase/ssr` in Server Components; client mutations (bookmarking, marking progress) go through Route Handlers, not client-side direct writes, so RLS + validation stay centralized.

## 6. Routing Plan

Public marketing routes are fully static/server-rendered for speed and SEO. `/dashboard/*` is a route group with its own layout that checks session and redirects to `/login` if absent — implemented as a stub now, real once Supabase is connected.
