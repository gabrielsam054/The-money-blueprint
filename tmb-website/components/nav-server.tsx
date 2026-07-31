import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/is-configured";

/**
 * Thin Server Component so the (client) Nav can know whether someone's
 * signed in without shipping any Supabase code to the browser bundle
 * just to check auth state.
 *
 * This renders on every page via the root layout, so it must never throw
 * — if Supabase isn't configured yet (Phase 2 not set up), it simply
 * falls back to "logged out" instead of crashing the entire site.
 */
export async function NavServer() {
  if (!supabaseConfigured) {
    return <Nav isAuthed={false} />;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return <Nav isAuthed={!!user} />;
  } catch {
    return <Nav isAuthed={false} />;
  }
}
