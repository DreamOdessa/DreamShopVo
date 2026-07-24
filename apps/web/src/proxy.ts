import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { appRoleFromClaims } from "./lib/auth/claims";
import {
  canAccessDuringMaintenance,
  isStorefrontMaintenance,
} from "./lib/maintenance";
import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { claims, response } = await updateSession(request);

  if (
    isStorefrontMaintenance() &&
    !canAccessDuringMaintenance(
      request.nextUrl.pathname,
      appRoleFromClaims(claims),
    )
  ) {
    const maintenanceUrl = request.nextUrl.clone();

    maintenanceUrl.pathname = "/";
    maintenanceUrl.search = "";
    maintenanceUrl.hash = "";

    const redirectResponse = NextResponse.redirect(maintenanceUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
