import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { safeNextPath } from "../../../lib/auth/redirect";

function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("-auth-token");
}

export async function GET(request: NextRequest) {
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));
  const redirectUrl = new URL("/auth", request.url);

  redirectUrl.searchParams.set("notice", "session-reset");
  redirectUrl.searchParams.set("next", next);

  const response = NextResponse.redirect(redirectUrl);

  request.cookies.getAll().forEach(({ name }) => {
    if (isSupabaseAuthCookie(name)) {
      response.cookies.set(name, "", {
        expires: new Date(0),
        httpOnly: true,
        maxAge: 0,
        path: "/",
        sameSite: "lax",
        secure: true,
      });
    }
  });

  return response;
}
