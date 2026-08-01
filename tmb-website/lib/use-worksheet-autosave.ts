"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Debounced auto-save to /api/worksheets/[slug] — waits 1.2s after the
 * last change before saving, so typing doesn't trigger a request per
 * keystroke. Shared by every worksheet form component so the save
 * behavior (and its status indicator) is consistent across all of them.
 */
export function useWorksheetAutosave<T extends Record<string, unknown>>(
  slug: string,
  initial: T
) {
  const [data, setData] = useState<T>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (next: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStatus("saving");
      timeoutRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/worksheets/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ responses: next }),
          });
          if (!res.ok) throw new Error();
          setStatus("saved");
        } catch {
          setStatus("error");
        }
      }, 1200);
    },
    [slug]
  );

  const update = useCallback(
    (updater: (prev: T) => T) => {
      setData((prev) => {
        const next = updater(prev);
        save(next);
        return next;
      });
    },
    [save]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { data, update, status };
}
