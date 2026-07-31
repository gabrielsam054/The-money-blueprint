import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Uses the SERVICE ROLE key, which bypasses Row Level Security entirely.
 * Only ever use this for genuinely trusted server-only code — like the
 * Paystack webhook handler, which has no user session to authenticate
 * with (Paystack calls it directly, server-to-server, with no cookies).
 *
 * Never expose this client or the service role key to the browser.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (or the Supabase URL) is not set."
    );
  }
  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
