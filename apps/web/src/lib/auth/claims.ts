export type AppRole = "admin" | "customer" | "tester";

export function appRoleFromClaims(claims: unknown): AppRole | null {
  if (!claims || typeof claims !== "object") {
    return null;
  }

  const appMetadata = Reflect.get(claims, "app_metadata");

  if (!appMetadata || typeof appMetadata !== "object") {
    return null;
  }

  const role = Reflect.get(appMetadata, "role");

  return role === "admin" || role === "customer" || role === "tester"
    ? role
    : null;
}
