import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { safeNextPath } from "../../../lib/auth/redirect";
import { getSupabaseEnv } from "../../../lib/env";
import type { Database } from "../../../lib/supabase/database.types";

function repairedRedirectUrl(request: NextRequest, next: string) {
  const redirectUrl = new URL(next, request.url);
  redirectUrl.searchParams.set("session_repaired", "1");

  return redirectUrl;
}

export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(repairedRedirectUrl(request, next));
  const env = getSupabaseEnv();
  const supabase = createServerClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          cookiesToSet.forEach(({ name, options, value }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );
  const { data, error } = await supabase.auth.refreshSession();

  if (!error && data.session) {
    return response;
  }

  const resetUrl = new URL("/auth/session-reset", request.url);
  resetUrl.searchParams.set("next", next);

  return NextResponse.redirect(resetUrl);
}
