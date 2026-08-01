import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { ReviewForm } from "@/components/review-form";

export const metadata: Metadata = {
  title: "Leave a Review",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
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

  if (!user) {
    redirect("/login?redirectTo=/dashboard/review");
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "success")
    .limit(1)
    .maybeSingle();

  if (!purchase) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="card mx-auto max-w-md text-center">
          <Lock className="mx-auto text-emerald" size={28} />
          <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
            Only purchasers can leave a review
          </p>
          <Link href="/pricing" className="btn-primary mt-6 inline-flex">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const { data: existingReview } = await supabase
    .from("reviews")
    .select("rating, review_text, reviewer_name, reviewer_role, status")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <section className="py-16">
      <div className="container-content max-w-xl">
        <div className="text-center">
          <span className="eyebrow">Your Honest Take</span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-slate-ink">
            Leave a Review
          </h1>
          <p className="mt-3 text-sm text-slate-muted">
            Real reviews from real readers — shown on the homepage once
            approved.
          </p>
        </div>

        <div className="mt-10">
          <ReviewForm existingReview={existingReview ?? null} />
        </div>
      </div>
    </section>
  );
}
