import { cookies } from "next/headers";

export function isSupabaseAuthCookie(name: string) {
  return name.startsWith("sb-") && name.includes("-auth-token");
}

export async function clearSupabaseAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.getAll().forEach(({ name }) => {
    if (isSupabaseAuthCookie(name)) {
      cookieStore.delete(name);
    }
  });
}
