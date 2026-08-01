"use client";

import { useState, type ReactNode } from "react";
import { Loader2, AlertCircle } from "lucide-react";

export function DownloadButton({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(href);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "Download failed. Please try again.");
      }
      window.location.href = json.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={loading} className={className}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : children}
      </button>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-error">
          <AlertCircle size={13} /> {error}
        </p>
      )}
    </div>
  );
}
