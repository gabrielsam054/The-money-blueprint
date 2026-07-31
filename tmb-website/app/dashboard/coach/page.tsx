import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { aiCoachConfigured } from "@/lib/ai-coach";
import { CoachChat } from "@/components/coach-chat";

export const metadata: Metadata = {
  title: "AI Coach",
  robots: { index: false, follow: false },
};

export default async function CoachPage() {
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
    redirect("/login?redirectTo=/dashboard/coach");
  }

  if (!aiCoachConfigured) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center py-20">
        <div className="card mx-auto max-w-md text-center">
          <Sparkles className="mx-auto text-gold" size={28} />
          <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
            AI Coach isn&apos;t set up yet
          </p>
          <p className="mt-2 text-sm text-slate-muted">
            This site&apos;s owner needs to add ANTHROPIC_API_KEY and
            VOYAGE_API_KEY, and run the embedding script — see{" "}
            <code className="rounded bg-surface-soft px-1.5 py-0.5 text-xs">
              docs/phase-2-roadmap.md
            </code>
            .
          </p>
        </div>
      </section>
    );
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
            The AI Coach is included with the book
          </p>
          <p className="mt-2 text-sm text-slate-muted">
            Trained specifically on The Modern Money Blueprint&apos;s
            frameworks — not general ChatGPT. Available once you&apos;ve
            purchased.
          </p>
          <Link href="/pricing" className="btn-primary mt-6 inline-flex">
            Get the Book <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container-content max-w-3xl">
        <div className="mb-6 text-center">
          <span className="eyebrow">Trained on This Book</span>
          <h1 className="mt-2 font-heading text-3xl font-bold text-slate-ink">
            AI Coach
          </h1>
        </div>
        <CoachChat />
      </div>
    </section>
  );
}
