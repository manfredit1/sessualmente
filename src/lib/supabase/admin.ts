import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Client con service_role key. Bypassa RLS.
 *
 * IMPORTANTE: usare SOLO lato server, in contesti fidati (server actions,
 * route handlers, middleware). MAI esportarlo a client components o usarlo in
 * risposta a input non validato.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client richiede NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
