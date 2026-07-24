import type { AppRole } from "./auth/claims";

const ALWAYS_AVAILABLE_PATHS = new Set(["/", "/robots.txt", "/sitemap.xml"]);

export function isStorefrontMaintenance() {
  return process.env.STOREFRONT_MAINTENANCE !== "false";
}

export function canAccessDuringMaintenance(
  pathname: string,
  role: AppRole | null,
) {
  return (
    ALWAYS_AVAILABLE_PATHS.has(pathname) ||
    pathname.startsWith("/auth/") ||
    pathname === "/auth" ||
    role === "admin" ||
    role === "tester"
  );
}
