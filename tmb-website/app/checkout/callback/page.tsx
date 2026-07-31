import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { verifyTransaction } from "@/lib/paystack";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Paystack redirects here after payment with ?reference=... (or ?trxref=...
 * depending on integration method — both are checked). The transaction is
 * always re-verified against Paystack's API here rather than trusting the
 * redirect itself, since a redirect URL can be visited or faked by anyone
 * without having actually paid. The webhook (app/api/webhooks/paystack)
 * performs the same verification independently as the authoritative
 * source of truth, in case this page is never visited at all.
 */
export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const params = await searchParams;
  const reference = params.reference ?? params.trxref;

  if (!reference) {
    return <ResultCard success={false} message="No payment reference found." />;
  }

  try {
    const result = await verifyTransaction(reference);

    if (result.status !== "success") {
      return (
        <ResultCard
          success={false}
          message="Payment wasn't completed. No charge was made."
        />
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("purchases")
        .update({ status: "success", verified_at: new Date().toISOString() })
        .eq("paystack_reference", reference)
        .eq("user_id", user.id);
    }

    return <ResultCard success={true} message="Your purchase is confirmed." />;
  } catch {
    return (
      <ResultCard
        success={false}
        message="We couldn't verify this payment. If you were charged, contact us and we'll sort it out."
      />
    );
  }
}

function ResultCard({ success, message }: { success: boolean; message: string }) {
  return (
    <section className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="card max-w-md text-center">
        {success ? (
          <CheckCircle2 className="mx-auto text-emerald" size={40} />
        ) : (
          <XCircle className="mx-auto text-error" size={40} />
        )}
        <p className="mt-4 font-heading text-xl font-semibold text-slate-ink">
          {success ? "Thank you!" : "Something went wrong"}
        </p>
        <p className="mt-2 text-sm text-slate-muted">{message}</p>
        <Link
          href={success ? "/dashboard" : "/pricing"}
          className="btn-primary mt-8 inline-flex"
        >
          {success ? "Go to Dashboard" : "Back to Pricing"} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
