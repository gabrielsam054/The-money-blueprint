import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark as BookmarkIcon, LogOut, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { parts } from "@/lib/book-data";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const totalChapters = parts.reduce((sum, p) => sum + p.chapters.length, 0);

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const completedChapters = new Set(
    (progress ?? []).map((p: ProgressRow) => p.chapter_number)
  );
  const completedCount = completedChapters.size;
  const percentComplete = Math.round((completedCount / totalChapters) * 100);

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

        <div className="card mt-10">
          <div className="flex items-center justify-between">
            <p className="font-heading text-sm font-semibold text-slate-ink">
              Overall Reading Progress
            </p>
            <p className="text-sm text-slate-muted">
              {completedCount} / {totalChapters} chapters
            </p>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-emerald transition-all duration-500"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-heading text-lg font-semibold text-slate-ink">
              Progress by Part
            </h2>
            <div className="mt-4 space-y-3">
              {parts
                .filter((p) => p.chapters.length > 0)
                .map((part) => {
                  const done = part.chapters.filter((c) =>
                    completedChapters.has(c.number)
                  ).length;
                  const pct = Math.round((done / part.chapters.length) * 100);
                  return (
                    <div key={part.number} className="card !p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-ink">
                          Part {part.number} — {part.title}
                        </span>
                        <span className="text-slate-muted">
                          {done}/{part.chapters.length}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-soft">
                        <div
                          className="h-full rounded-full bg-gold transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-slate-ink">
                <BookmarkIcon size={18} /> Bookmarks
              </h2>
              {!bookmarks || bookmarks.length === 0 ? (
                <p className="mt-3 text-sm text-slate-muted">
                  No bookmarks yet — they'll show up here once you save one
                  from a chapter.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {bookmarks.map((b: BookmarkRow) => (
                    <li key={b.id} className="card !p-4 text-sm">
                      <span className="font-medium text-slate-ink">
                        Chapter {b.chapter_number}
                      </span>
                      {b.note && (
                        <p className="mt-1 text-slate-muted">{b.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="card border-2 border-dashed border-surface-line !p-5 text-center">
              <Sparkles className="mx-auto text-gold" size={22} />
              <p className="mt-2 font-heading text-sm font-semibold text-slate-ink">
                AI Coach — Coming Soon
              </p>
              <p className="mt-1 text-xs text-slate-muted">
                Trained specifically on this book, not general ChatGPT.
              </p>
            </div>
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
