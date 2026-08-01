import { NextResponse } from "next/server";

import { safeNextPath } from "../../../lib/auth/redirect";
import { clearSupabaseAuthCookies } from "../../../lib/auth/cookies";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    await clearSupabaseAuthCookies();
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/auth?error=callback", requestUrl.origin));
}
