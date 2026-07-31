"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { parts } from "@/lib/book-data";
import { cn } from "@/lib/utils";

export function ChapterProgressList({
  initialCompleted,
}: {
  initialCompleted: number[];
}) {
  const [completed, setCompleted] = useState(new Set(initialCompleted));
  const [pending, startTransition] = useTransition();
  const [errorChapter, setErrorChapter] = useState<number | null>(null);

  async function toggleChapter(chapterNumber: number) {
    const wasCompleted = completed.has(chapterNumber);
    setErrorChapter(null);

    // Optimistic update — flips instantly, rolled back below only if the
    // request actually fails.
    setCompleted((prev) => {
      const next = new Set(prev);
      wasCompleted ? next.delete(chapterNumber) : next.add(chapterNumber);
      return next;
    });

    startTransition(async () => {
      try {
        const res = await fetch("/api/progress", {
          method: wasCompleted ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterNumber }),
        });
        if (!res.ok) throw new Error("Request failed");
      } catch {
        // Roll back on failure so the UI never lies about saved state.
        setCompleted((prev) => {
          const next = new Set(prev);
          wasCompleted ? next.add(chapterNumber) : next.delete(chapterNumber);
          return next;
        });
        setErrorChapter(chapterNumber);
      }
    });
  }

  const bookParts = parts.filter((p) => p.chapters.length > 0);
  const totalChapters = bookParts.reduce((sum, p) => sum + p.chapters.length, 0);
  const percentComplete = Math.round((completed.size / totalChapters) * 100);

  return (
    <div>
      <div className="card">
        <div className="flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-slate-ink">
            Overall Reading Progress
          </p>
          <p className="text-sm text-slate-muted">
            {completed.size} / {totalChapters} chapters
          </p>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-surface-soft">
          <div
            className="h-full rounded-full bg-emerald transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {bookParts.map((part) => {
          const doneInPart = part.chapters.filter((c) =>
            completed.has(c.number)
          ).length;
          return (
            <div key={part.number} className="card !p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-ink">
                  Part {part.number} — {part.title}
                </span>
                <span className="text-slate-muted">
                  {doneInPart}/{part.chapters.length}
                </span>
              </div>
              <ul className="mt-3 space-y-1">
                {part.chapters.map((chapter) => {
                  const isDone = completed.has(chapter.number);
                  return (
                    <li key={chapter.number}>
                      <button
                        type="button"
                        onClick={() => toggleChapter(chapter.number)}
                        disabled={pending}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-surface-soft disabled:opacity-60",
                          errorChapter === chapter.number && "bg-error/5"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                            isDone
                              ? "border-emerald bg-emerald text-white"
                              : "border-surface-line"
                          )}
                        >
                          {isDone && <Check size={13} strokeWidth={3} />}
                        </span>
                        <span className={cn(isDone && "text-slate-muted line-through")}>
                          Ch. {chapter.number} — {chapter.title}
                        </span>
                      </button>
                      {errorChapter === chapter.number && (
                        <p className="pl-10 text-xs text-error">
                          Couldn&apos;t save — try again.
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
