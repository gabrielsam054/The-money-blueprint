import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Thin Server Component so the (client) Nav can know whether someone's
 * signed in and whether they've purchased, without shipping any
 * Supabase code to the browser bundle just to check that.
 *
 * This renders on every page via the root layout, so it must never throw
 * — if Supabase isn't configured yet (Phase 2 not set up), it simply
 * falls back to "logged out" instead of crashing the entire site.
 */
export async function NavServer() {
  if (!supabaseConfigured) {
    return <Nav isAuthed={false} hasPurchased={false} />;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return <Nav isAuthed={false} hasPurchased={false} />;
    }

    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "success")
      .limit(1)
      .maybeSingle();

    return <Nav isAuthed={true} hasPurchased={!!purchase} />;
  } catch {
    return <Nav isAuthed={false} hasPurchased={false} />;
  }
}
