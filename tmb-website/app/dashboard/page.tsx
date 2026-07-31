import type { Metadata } from "next";
import Link from "next/link";
import { Construction } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * PHASE 2 STUB.
 * This route is intentionally not wired to Supabase yet. Once a Supabase
 * project exists (see /docs/phase-2-roadmap.md), this becomes a Server
 * Component that reads the session via @supabase/ssr, redirects
 * unauthenticated users to /login, and renders reading progress,
 * bookmarks, and the library pulled from the schema in
 * /docs/database-schema.sql.
 */
export default function DashboardStubPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-md text-center">
        <Construction className="mx-auto text-gold" size={32} />
        <h1 className="mt-4 font-heading text-2xl font-bold text-slate-ink">
          The Dashboard is Phase 2
        </h1>
        <p className="mt-3 text-sm text-slate-body">
          Reading progress, bookmarks, your downloaded worksheets, and the AI
          Coach live here once account sign-in is connected. See{" "}
          <code className="rounded bg-surface-soft px-1.5 py-0.5 text-xs">
            docs/phase-2-roadmap.md
          </code>{" "}
          in this repo for the plan.
        </p>
        <Link
          href="/"
          className="btn-secondary mt-8 inline-flex"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
