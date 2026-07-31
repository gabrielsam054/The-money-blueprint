"use client";

import { useState, useTransition, type FormEvent } from "react";
import { Bookmark as BookmarkIcon, Plus, Trash2 } from "lucide-react";

interface Bookmark {
  id: string;
  chapter_number: number;
  note: string | null;
}

export function BookmarkManager({
  initialBookmarks,
}: {
  initialBookmarks: Bookmark[];
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [showForm, setShowForm] = useState(false);
  const [chapterNumber, setChapterNumber] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function addBookmark(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const num = Number(chapterNumber);
    if (!num || num < 1 || num > 49) {
      setError("Enter a chapter number between 1 and 49.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterNumber: num, note: note || undefined }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to save");
        setBookmarks((prev) => [json.bookmark, ...prev]);
        setChapterNumber("");
        setNote("");
        setShowForm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      }
    });
  }

  function deleteBookmark(id: string) {
    const previous = bookmarks;
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    startTransition(async () => {
      try {
        const res = await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to delete");
      } catch {
        setBookmarks(previous); // roll back
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-slate-ink">
          <BookmarkIcon size={18} /> Bookmarks
        </h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-emerald hover:underline"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {showForm && (
        <form onSubmit={addBookmark} className="card mt-3 !p-4 space-y-3">
          <div>
            <label htmlFor="chapterNumber" className="text-xs font-medium text-slate-ink">
              Chapter number
            </label>
            <input
              id="chapterNumber"
              type="number"
              min={1}
              max={49}
              value={chapterNumber}
              onChange={(e) => setChapterNumber(e.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="note" className="text-xs font-medium text-slate-ink">
              Note (optional)
            </label>
            <input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Why this chapter mattered..."
              className="mt-1 w-full rounded-lg border border-surface-line px-3 py-2 text-sm focus:border-emerald focus:outline-none"
            />
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
          <button type="submit" disabled={pending} className="btn-primary w-full !py-2.5 text-sm">
            {pending ? "Saving..." : "Save Bookmark"}
          </button>
        </form>
      )}

      {bookmarks.length === 0 ? (
        <p className="mt-3 text-sm text-slate-muted">
          No bookmarks yet — add one for a chapter you want to revisit.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {bookmarks.map((b) => (
            <li key={b.id} className="card flex items-start justify-between gap-3 !p-4 text-sm">
              <div>
                <span className="font-medium text-slate-ink">
                  Chapter {b.chapter_number}
                </span>
                {b.note && <p className="mt-1 text-slate-muted">{b.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => deleteBookmark(b.id)}
                aria-label="Delete bookmark"
                className="shrink-0 text-slate-muted hover:text-error"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
