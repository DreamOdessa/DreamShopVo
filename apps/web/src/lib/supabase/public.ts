import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnv } from "../env";
import type { Database } from "./database.types";

export function createPublicClient() {
  const env = getSupabaseEnv();

  return createSupabaseClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
