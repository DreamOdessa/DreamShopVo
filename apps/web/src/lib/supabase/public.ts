import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "../env";

export function createPublicClient() {
  const env = getSupabaseEnv();

  return createSupabaseClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
