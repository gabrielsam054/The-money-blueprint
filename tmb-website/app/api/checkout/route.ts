import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction, BOOK_PRICE_PESEWAS } from "@/lib/paystack";

/**
 * Requires the user to be logged in — purchases are tied to a user_id so
 * the dashboard can later show what someone actually owns. Redirects to
 * login (with a redirect back here) rather than allowing anonymous
 * checkout.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json(
      { error: "Please log in first.", redirectTo: "/login?redirectTo=/pricing" },
      { status: 401 }
    );
  }

  const origin = new URL(request.url).origin;
  const reference = `book_${crypto.randomUUID()}`;

  try {
    const { authorization_url } = await initializeTransaction({
      email: user.email,
      amountPesewas: BOOK_PRICE_PESEWAS,
      reference,
      callbackUrl: `${origin}/checkout/callback`,
      metadata: { user_id: user.id, product: "book" },
    });

    // Record a pending purchase now, before the user even pays, so the
    // reference exists in our database either way. The webhook/callback
    // then update its status rather than inserting a fresh row.
    await supabase.from("purchases").insert({
      user_id: user.id,
      paystack_reference: reference,
      amount: BOOK_PRICE_PESEWAS,
      currency: "GHS",
      status: "pending",
      product: "book",
    });

    return NextResponse.json({ authorization_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
