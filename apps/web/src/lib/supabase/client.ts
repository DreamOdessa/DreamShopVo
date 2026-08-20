"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "../env";
import type { Database } from "./database.types";

export function createClient() {
  const env = getSupabaseEnv();

  return createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey);
}
