import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction, MEMBERSHIP_PRICE_PESEWAS } from "@/lib/paystack";

/**
 * Requires PAYSTACK_MEMBERSHIP_PLAN_CODE — a Plan created in the
 * Paystack dashboard (Products → Plans), not something this code
 * creates automatically. See docs/phase-2-roadmap.md for the exact
 * steps; a Plan only needs to be created once, this route just
 * subscribes individual users to it.
 */
export async function POST(request: Request) {
  const planCode = process.env.PAYSTACK_MEMBERSHIP_PLAN_CODE;
  if (!planCode) {
    return NextResponse.json(
      { error: "Membership isn't set up yet — no plan configured." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json(
      { error: "Please log in first.", redirectTo: "/login?redirectTo=/dashboard/membership" },
      { status: 401 }
    );
  }

  const origin = new URL(request.url).origin;
  const reference = `membership_${crypto.randomUUID()}`;

  try {
    const { authorization_url } = await initializeTransaction({
      email: user.email,
      amountPesewas: MEMBERSHIP_PRICE_PESEWAS,
      reference,
      callbackUrl: `${origin}/dashboard/membership`,
      planCode,
      metadata: { user_id: user.id, product: "membership" },
    });

    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        plan_code: planCode,
        status: "pending",
      },
      { onConflict: "user_id,plan_code" }
    );

    return NextResponse.json({ authorization_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't start membership signup";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
