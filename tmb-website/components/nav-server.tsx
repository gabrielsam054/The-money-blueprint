import { Nav } from "@/components/nav";
import { createClient } from "@/lib/supabase/server";

/**
 * Thin Server Component so the (client) Nav can know whether someone's
 * signed in without shipping any Supabase code to the browser bundle
 * just to check auth state.
 */
export async function NavServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <Nav isAuthed={!!user} />;
}
