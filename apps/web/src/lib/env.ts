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

const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z0-9_]{5,32}$/;

export async function getTelegramBotUsername() {
  const configuredUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim() ?? "";

  if (TELEGRAM_USERNAME_PATTERN.test(configuredUsername)) {
    return configuredUsername;
  }

  try {
    const response = await fetch(
      new URL("/telegram/info", `${getApiUrl().replace(/\/+$/, "")}/`),
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5_000),
      },
    );

    if (!response.ok) {
      return "";
    }

    const body = (await response.json()) as { username?: unknown };
    const username = typeof body.username === "string" ? body.username : "";

    return TELEGRAM_USERNAME_PATTERN.test(username) ? username : "";
  } catch {
    return "";
  }
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
