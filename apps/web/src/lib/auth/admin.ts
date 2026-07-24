import { createClient } from "../supabase/server";

function roleFromClaims(claims: unknown) {
  if (!claims || typeof claims !== "object") {
    return null;
  }

  const appMetadata = Reflect.get(claims, "app_metadata");

  if (!appMetadata || typeof appMetadata !== "object") {
    return null;
  }

  const role = Reflect.get(appMetadata, "role");

  return typeof role === "string" ? role : null;
}

export async function getAdminContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  return {
    isAdmin: !error && roleFromClaims(data?.claims) === "admin",
    supabase,
    userId: typeof userId === "string" ? userId : null,
  };
}
