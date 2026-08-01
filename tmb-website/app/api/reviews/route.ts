import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().min(10).max(1000),
  reviewerName: z.string().max(80).optional(),
  reviewerRole: z.string().max(80).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data } = await supabase
    .from("reviews")
    .select("rating, review_text, reviewer_name, reviewer_role, status")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ review: data ?? null });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "success")
    .limit(1)
    .maybeSingle();
  if (!purchase) {
    return NextResponse.json(
      { error: "Only readers who've purchased the book can leave a review." },
      { status: 403 }
    );
  }

  const parsed = reviewSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review" }, { status: 400 });
  }

  // Upsert, not insert — the unique(user_id) constraint means a second
  // submission edits the existing row. RLS (see
  // docs/database-schema-reviews.sql) independently enforces that this
  // can only happen while the review is still 'pending' — an already
  // approved review can't be silently edited after the fact.
  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      rating: parsed.data.rating,
      review_text: parsed.data.reviewText,
      reviewer_name: parsed.data.reviewerName || null,
      reviewer_role: parsed.data.reviewerRole || null,
      status: "pending",
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
