import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { createServiceClient } from "@/lib/supabase/service";

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    metadata: { user_id?: string; product?: string } | null;
    // subscription.create / subscription.disable shape
    subscription_code?: string;
    customer?: { customer_code?: string; email?: string };
    plan?: { plan_code?: string };
    next_payment_date?: string;
  };
}

/**
 * The authoritative confirmation of payment and subscription state —
 * unlike app/checkout/callback, this fires server-to-server regardless
 * of whether the user's browser ever makes it back to our site (closed
 * tab, network drop, etc.), so it's what should actually be trusted for
 * granting access, not just the redirect page.
 *
 * Configure this URL in the Paystack dashboard under Settings → API Keys
 * & Webhooks: https://yourdomain.com/api/webhooks/paystack
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  const isValid = await verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event: PaystackWebhookEvent = JSON.parse(rawBody);
  const supabase = createServiceClient();

  // charge.success fires for BOTH the one-time book purchase and every
  // subscription renewal charge — only the book purchase writes to
  // `purchases` here; subscription state is tracked separately via the
  // subscription.* events below, which are more precise for that.
  if (event.event === "charge.success" && event.data.metadata?.product === "book") {
    const { reference, status, amount, currency, metadata } = event.data;
    const userId = metadata?.user_id;

    if (userId && reference) {
      const { error } = await supabase.from("purchases").upsert(
        {
          user_id: userId,
          paystack_reference: reference,
          amount,
          currency,
          status: status === "success" ? "success" : "failed",
          product: "book",
          verified_at: new Date().toISOString(),
        },
        { onConflict: "paystack_reference" }
      );

      if (error) {
        // A genuine write failure here (missing table, RLS issue, etc.)
        // should NOT be silently swallowed — returning a non-2xx makes
        // Paystack retry this webhook automatically, and the failure
        // shows up in Paystack's own webhook delivery logs, which is the
        // only way to notice this kind of problem without a user
        // reporting it manually.
        console.error("Failed to record purchase from webhook:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  if (event.event === "subscription.create") {
    let userId = event.data.metadata?.user_id;
    const { subscription_code, customer, plan, next_payment_date } = event.data;

    // Uncertain whether Paystack propagates custom metadata onto
    // subscription.create specifically (charge.success definitely
    // carries it; this event's payload shape is less consistently
    // documented) — falling back to looking the user up by email via
    // the customer object, which subscription events reliably include,
    // rather than silently failing to link the subscription to anyone.
    if (!userId && customer?.email) {
      const { data: userRows } = await supabase.auth.admin.listUsers();
      const matched = userRows?.users.find((u) => u.email === customer.email);
      userId = matched?.id;
    }

    if (userId && plan?.plan_code) {
      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          plan_code: plan.plan_code,
          paystack_subscription_code: subscription_code ?? null,
          paystack_customer_code: customer?.customer_code ?? null,
          status: "active",
          current_period_end: next_payment_date ?? null,
        },
        { onConflict: "user_id,plan_code" }
      );
      if (error) {
        console.error("Failed to record subscription creation:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      console.error(
        "subscription.create: couldn't determine which user this belongs to (no metadata.user_id, no email match)"
      );
    }
  }

  if (event.event === "subscription.disable") {
    const userId = event.data.metadata?.user_id;
    if (userId && event.data.subscription_code) {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "cancelled" })
        .eq("paystack_subscription_code", event.data.subscription_code);
      if (error) {
        console.error("Failed to record subscription cancellation:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  if (event.event === "invoice.payment_failed") {
    const subCode = event.data.subscription_code;
    if (subCode) {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "past_due" })
        .eq("paystack_subscription_code", subCode);
      if (error) {
        console.error("Failed to record failed renewal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  // Reaches here only for successfully-handled or intentionally-ignored
  // events — a genuine write failure above already returned early with a
  // 500 so Paystack retries it, rather than this line masking that.
  return NextResponse.json({ received: true });
}
