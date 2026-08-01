import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { downloadableTemplates } from "@/lib/templates-data";

/**
 * Files live in a PRIVATE Supabase Storage bucket ("templates"), not in
 * Next.js's public/ folder — a public path would be reachable by anyone
 * with the URL regardless of what the UI shows, defeating the purchase
 * gate entirely. This route checks purchase status first, then asks
 * Supabase for a signed URL that expires in 60 seconds — long enough for
 * the browser to start the download, short enough that the link is
 * useless if it leaks.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const template = downloadableTemplates.find((t) => t.slug === slug);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

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
      { error: "Templates are available after you purchase the book." },
      { status: 403 }
    );
  }

  // Signed URL generation needs elevated storage permissions, so this
  // uses the service-role client — the purchase check above is the real
  // gate, this is just the mechanism for producing a temporary link.
  const serviceClient = createServiceClient();
  const { data: signed, error } = await serviceClient.storage
    .from("templates")
    .createSignedUrl(template.filename, 60);

  if (error || !signed) {
    return NextResponse.json(
      { error: "Couldn't generate a download link. The file may not be uploaded yet." },
      { status: 500 }
    );
  }

  await supabase.from("downloads_log").insert({
    user_id: user.id,
    asset_slug: slug,
  });

  return NextResponse.redirect(signed.signedUrl);
}
