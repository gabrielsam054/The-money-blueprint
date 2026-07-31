import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paystack";
import { createServiceClient } from "@/lib/supabase/service";

interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    metadata: { user_id?: string; product?: string } | null;
  };
}

/**
 * The authoritative confirmation of payment — unlike app/checkout/callback,
 * this fires server-to-server regardless of whether the user's browser
 * ever makes it back to our site (closed tab, network drop, etc.), so
 * it's what should actually be trusted for granting access, not just the
 * redirect page.
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

  if (event.event === "charge.success") {
    const { reference, status, amount, currency, metadata } = event.data;
    const userId = metadata?.user_id;

    if (userId) {
      const supabase = createServiceClient();
      await supabase.from("purchases").upsert(
        {
          user_id: userId,
          paystack_reference: reference,
          amount,
          currency,
          status: status === "success" ? "success" : "failed",
          product: metadata?.product ?? "book",
          verified_at: new Date().toISOString(),
        },
        { onConflict: "paystack_reference" }
      );
    }
  }

  // Always 200 — Paystack retries on non-2xx responses, and we've either
  // handled the event or intentionally ignored an event type we don't
  // care about (no need to trigger a retry storm for those).
  return NextResponse.json({ received: true });
}
