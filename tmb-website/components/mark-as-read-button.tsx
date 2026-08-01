"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function MarkAsReadButton({
  chapterNumber,
  initiallyRead,
}: {
  chapterNumber: number;
  initiallyRead: boolean;
}) {
  const [isRead, setIsRead] = useState(initiallyRead);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function toggle() {
    const next = !isRead;
    setError(false);
    setIsRead(next); // optimistic

    startTransition(async () => {
      try {
        const res = await fetch("/api/progress", {
          method: next ? "POST" : "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chapterNumber }),
        });
        if (!res.ok) throw new Error("failed");
      } catch {
        setIsRead(!next); // roll back
        setError(true);
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={cn(
          "flex items-center gap-2 rounded-full px-5 py-2.5 font-heading text-sm font-semibold transition-colors disabled:opacity-70",
          isRead
            ? "bg-emerald text-white"
            : "border border-surface-line bg-white text-slate-ink hover:border-emerald"
        )}
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Check size={16} />
        )}
        {isRead ? "Marked as Read" : "Mark as Read"}
      </button>
      {error && <p className="text-xs text-error">Couldn&apos;t save — try again.</p>}
    </div>
  );
}
