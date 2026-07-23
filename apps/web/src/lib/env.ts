type SupabaseEnv = {
  supabasePublishableKey: string;
  supabaseUrl: string;
};

function requirePublicValue(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseEnv(): SupabaseEnv {
  return {
    supabasePublishableKey: requirePublicValue(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    supabaseUrl: requirePublicValue(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
  };
}

export function getApiUrl() {
  return requirePublicValue("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);
}

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";
  const normalizedUrl = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;
  const url = new URL(normalizedUrl);

  url.pathname = "/";
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}
