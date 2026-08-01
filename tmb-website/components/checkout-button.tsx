"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { safeJson } from "@/lib/safe-json";

export function CheckoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const json = await safeJson<{
        redirectTo?: string;
        error?: string;
        authorization_url?: string;
      }>(res, {});

      if (res.status === 401 && json.redirectTo) {
        router.push(json.redirectTo);
        return;
      }
      if (!res.ok || !json.authorization_url) {
        throw new Error(json.error ?? "Checkout failed. Please try again.");
      }
      window.location.href = json.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="btn-primary w-full disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Redirecting to payment...
          </>
        ) : (
          "Get the Book"
        )}
      </button>
      {error && <p className="mt-2 text-center text-xs text-error">{error}</p>}
    </div>
  );
}
