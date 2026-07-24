import { createClient } from "../supabase/server";
import { appRoleFromClaims } from "./claims";

export async function getAdminContext() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  return {
    isAdmin: !error && appRoleFromClaims(data?.claims) === "admin",
    supabase,
    userId: typeof userId === "string" ? userId : null,
  };
}
