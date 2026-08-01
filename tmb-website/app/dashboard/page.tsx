import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Sparkles, FileSpreadsheet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { ChapterProgressList } from "@/components/chapter-progress-list";
import { BookmarkManager } from "@/components/bookmark-manager";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!supabaseConfigured) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-20">
        <SupabaseNotConfiguredNotice />
      </section>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth — middleware.ts already redirects unauthenticated
  // requests before they reach here, but a Server Component should never
  // assume that held true by the time it renders.
  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  interface ProgressRow {
    chapter_number: number;
  }
  interface BookmarkRow {
    id: string;
    chapter_number: number;
    note: string | null;
    created_at: string;
  }

  const [{ data: progress }, { data: bookmarks }] = await Promise.all([
    supabase
      .from("reading_progress")
      .select("chapter_number")
      .eq("user_id", user.id)
      .returns<ProgressRow[]>(),
    supabase
      .from("bookmarks")
      .select("id, chapter_number, note, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<BookmarkRow[]>(),
  ]);

  return (
    <section className="py-16">
      <div className="container-content">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow">Your Dashboard</span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-slate-ink">
              Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}
            </h1>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm font-medium text-slate-muted hover:text-error"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </form>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <ChapterProgressList
            initialCompleted={(progress ?? []).map((p: ProgressRow) => p.chapter_number)}
          />

          <div className="space-y-8">
            <BookmarkManager initialBookmarks={bookmarks ?? []} />

            <Link
              href="/dashboard/coach"
              className="card block border-2 border-emerald !p-5 text-center transition-shadow hover:shadow-lift"
            >
              <Sparkles className="mx-auto text-gold" size={22} />
              <p className="mt-2 font-heading text-sm font-semibold text-slate-ink">
                Ask the AI Coach
              </p>
              <p className="mt-1 text-xs text-slate-muted">
                Trained specifically on this book, not general ChatGPT.
              </p>
            </Link>

            <Link
              href="/dashboard/templates"
              className="card block !p-5 text-center transition-shadow hover:shadow-lift"
            >
              <FileSpreadsheet className="mx-auto text-emerald" size={22} />
              <p className="mt-2 font-heading text-sm font-semibold text-slate-ink">
                Download Templates
              </p>
              <p className="mt-1 text-xs text-slate-muted">
                6 fillable Excel workbook tools, ready to use.
              </p>
            </Link>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/table-of-contents"
            className="text-sm font-semibold text-emerald hover:underline"
          >
            Browse the full table of contents →
          </Link>
        </div>
      </div>
    </section>
  );
}
