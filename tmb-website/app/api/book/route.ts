import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

const BOOK_FILENAME = "The_Modern_Money_Blueprint.pdf";

/**
 * The actual book file. Lives in a private "books" bucket in Supabase
 * Storage (separate from the "templates" bucket, since this is the core
 * product, not a bonus). Same gated-signed-URL pattern as
 * app/api/templates/[slug] — see that file's comments for why this
 * can't just be a public path in Next.js's public/ folder.
 */
export async function GET() {
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
      { error: "Purchase the book first to download it." },
      { status: 403 }
    );
  }

  let signed;
  try {
    const serviceClient = createServiceClient();
    const result = await serviceClient.storage
      .from("books")
      .createSignedUrl(BOOK_FILENAME, 60);
    if (result.error || !result.data) {
      return NextResponse.json(
        { error: "Couldn't generate a download link. The file may not be uploaded yet." },
        { status: 500 }
      );
    }
    signed = result.data;
  } catch (err) {
    // createServiceClient() throws if SUPABASE_SERVICE_ROLE_KEY isn't
    // set — catching this explicitly means the client always gets a
    // real JSON error to display, never an uncaught crash with an empty
    // response body that breaks res.json() on the client side.
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Server isn't configured for downloads yet.",
      },
      { status: 500 }
    );
  }

  await supabase.from("downloads_log").insert({
    user_id: user.id,
    asset_slug: "the-book",
  });

  // JSON, not a redirect — a raw <a href> hitting this route directly
  // would show the browser's own ugly generic error page on any
  // non-2xx response, with no chance to display a friendly message.
  // The client component (components/download-button.tsx) fetches this,
  // checks the response, and navigates itself only on success.
  return NextResponse.json({ url: signed.signedUrl });
}
