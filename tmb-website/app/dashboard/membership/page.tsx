import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckCircle2, Sparkles, AlertCircle, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";
import { SupabaseNotConfiguredNotice } from "@/components/supabase-not-configured-notice";
import { MembershipSubscribeButton } from "@/components/membership-subscribe-button";
import { MEMBERSHIP_PRICE_GHS } from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Membership",
  robots: { index: false, follow: false },
};

export default async function MembershipPage() {
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
    redirect("/login?redirectTo=/dashboard/membership");
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();

  const planConfigured = !!process.env.PAYSTACK_MEMBERSHIP_PLAN_CODE;

  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="card mx-auto max-w-md text-center">
        {!planConfigured ? (
          <>
            <AlertCircle className="mx-auto text-gold" size={28} />
            <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              Membership isn&apos;t set up yet
            </p>
            <p className="mt-2 text-sm text-slate-muted">
              This site&apos;s owner needs to create a Paystack Plan and add
              PAYSTACK_MEMBERSHIP_PLAN_CODE — see docs/phase-2-roadmap.md.
            </p>
          </>
        ) : subscription?.status === "active" ? (
          <>
            <CheckCircle2 className="mx-auto text-emerald" size={28} />
            <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              You&apos;re a member
            </p>
            <p className="mt-2 text-sm text-slate-muted">
              {subscription.current_period_end
                ? `Renews ${new Date(subscription.current_period_end).toLocaleDateString()}.`
                : "Your membership is active."}
            </p>
          </>
        ) : subscription?.status === "past_due" ? (
          <>
            <AlertCircle className="mx-auto text-error" size={28} />
            <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              Payment issue
            </p>
            <p className="mt-2 text-sm text-slate-muted">
              Your last renewal charge failed. Update your payment method with
              Paystack to keep your membership active.
            </p>
          </>
        ) : subscription?.status === "cancelled" ? (
          <>
            <XCircle className="mx-auto text-slate-muted" size={28} />
            <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              Membership cancelled
            </p>
            <p className="mt-2 text-sm text-slate-muted">
              You can resubscribe any time.
            </p>
            <div className="mt-6">
              <MembershipSubscribeButton />
            </div>
          </>
        ) : (
          <>
            <Sparkles className="mx-auto text-gold" size={28} />
            <p className="mt-3 font-heading text-lg font-semibold text-slate-ink">
              Become a Member
            </p>
            <p className="mt-2 text-sm text-slate-muted">
              GHS {MEMBERSHIP_PRICE_GHS}/month, billed automatically until you
              cancel.
            </p>
            <div className="mt-6">
              <MembershipSubscribeButton />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
