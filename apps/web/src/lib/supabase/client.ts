"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "../env";
import type { Database } from "./database.types";
import { createSupabaseFetch } from "./fetch";

const supabaseFetch = createSupabaseFetch();

export function createClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    { global: { fetch: supabaseFetch } },
  );
}
