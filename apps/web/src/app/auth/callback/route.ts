import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { safeNextPath } from "../../../lib/auth/redirect";
import { getSupabaseEnv } from "../../../lib/env";
import type { Database } from "../../../lib/supabase/database.types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const response = NextResponse.redirect(new URL(next, requestUrl.origin));
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
  }

  return NextResponse.redirect(new URL("/auth?error=callback", requestUrl.origin));
}
