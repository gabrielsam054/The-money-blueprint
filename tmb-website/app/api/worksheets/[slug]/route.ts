import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { downloadableTemplates } from "@/lib/templates-data";

const saveSchema = z.object({
  responses: z.record(z.string(), z.unknown()),
});

function isValidSlug(slug: string) {
  return downloadableTemplates.some((t) => t.slug === slug);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data } = await supabase
    .from("worksheet_responses")
    .select("responses")
    .eq("user_id", user.id)
    .eq("worksheet_slug", slug)
    .maybeSingle();

  return NextResponse.json({ responses: data?.responses ?? {} });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Purchase-gated, same as the download routes — filling in a template
  // is one of the things bundled with the book purchase, not free.
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "success")
    .limit(1)
    .maybeSingle();
  if (!purchase) {
    return NextResponse.json({ error: "Purchase the book first." }, { status: 403 });
  }

  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const { error } = await supabase.from("worksheet_responses").upsert(
    {
      user_id: user.id,
      worksheet_slug: slug,
      responses: parsed.data.responses,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,worksheet_slug" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
