"use client";

import { useState, type FormEvent } from "react";
import { Star, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { safeJson } from "@/lib/safe-json";

interface ExistingReview {
  rating: number;
  review_text: string;
  reviewer_name: string | null;
  reviewer_role: string | null;
  status: "pending" | "approved" | "rejected";
}

export function ReviewForm({ existingReview }: { existingReview: ExistingReview | null }) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text ?? "");
  const [reviewerName, setReviewerName] = useState(existingReview?.reviewer_name ?? "");
  const [reviewerRole, setReviewerRole] = useState(existingReview?.reviewer_role ?? "");
  const [status, setStatus] = useState(existingReview?.status ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locked = status === "approved"; // can't edit after approval, per the RLS policy

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (rating === 0) {
      setError("Pick a star rating.");
      return;
    }
    if (reviewText.trim().length < 10) {
      setError("Write a little more — at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          reviewText: reviewText.trim(),
          reviewerName: reviewerName.trim() || undefined,
          reviewerRole: reviewerRole.trim() || undefined,
        }),
      });
      const json = await safeJson<{ error?: string }>(res, {});
      if (!res.ok) throw new Error(json.error ?? "Couldn't submit your review.");
      setStatus("pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      {status && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${
            status === "approved"
              ? "bg-emerald/10 text-emerald"
              : status === "rejected"
                ? "bg-error/10 text-error"
                : "bg-gold-50 text-gold-700"
          }`}
        >
          {status === "approved" && <CheckCircle2 size={16} />}
          {status === "pending" && <Clock size={16} />}
          {status === "rejected" && <AlertCircle size={16} />}
          {status === "approved" && "Your review is live on the site. Thank you!"}
          {status === "pending" && "Your review is submitted and waiting for approval."}
          {status === "rejected" && "Your review wasn't approved — feel free to edit and resubmit."}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={locked} className="space-y-5 disabled:opacity-60">
          <div>
            <label className="text-sm font-medium text-slate-ink">Your rating</label>
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                >
                  <Star
                    size={28}
                    className={
                      n <= (hoverRating || rating)
                        ? "fill-gold text-gold"
                        : "text-surface-line"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reviewText" className="text-sm font-medium text-slate-ink">
              Your review
            </label>
            <textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="What did the book actually help you do?"
              className="mt-1.5 w-full resize-y rounded-lg border border-surface-line px-3 py-2.5 text-sm focus:border-emerald focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="reviewerName" className="text-sm font-medium text-slate-ink">
                Display name (optional)
              </label>
              <input
                id="reviewerName"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="First name or initials"
                className="mt-1.5 w-full rounded-lg border border-surface-line px-3 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="reviewerRole" className="text-sm font-medium text-slate-ink">
                Role (optional)
              </label>
              <input
                id="reviewerRole"
                value={reviewerRole}
                onChange={(e) => setReviewerRole(e.target.value)}
                placeholder="e.g. Freelance Designer"
                className="mt-1.5 w-full rounded-lg border border-surface-line px-3 py-2.5 text-sm focus:border-emerald focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </button>
        </fieldset>
      </form>
    </div>
  );
}
