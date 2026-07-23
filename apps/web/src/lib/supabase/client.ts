"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "../env";

export function createClient() {
  const env = getSupabaseEnv();

  return createBrowserClient(env.supabaseUrl, env.supabasePublishableKey);
}
