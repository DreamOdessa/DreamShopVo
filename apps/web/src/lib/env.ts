type SupabaseEnv = {
  supabasePublishableKey: string;
  supabaseUrl: string;
};

const PRODUCTION_SITE_HOST = "dream-odessa.shop";

function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

function isE2eMockRuntime() {
  return process.env.NEXT_PUBLIC_E2E_MOCK === "1";
}

function requirePublicValue(name: string, value: string | undefined) {
  const normalizedValue = value?.trim() ?? "";

  if (!normalizedValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return normalizedValue;
}

function parsePublicUrl(name: string, value: string | undefined) {
  const configuredValue = requirePublicValue(name, value);
  let url: URL;

  try {
    url = new URL(configuredValue);
  } catch {
    throw new Error(`Invalid required environment variable: ${name} must be an absolute URL`);
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      `Invalid required environment variable: ${name} must be an origin without credentials, path, query, or hash`,
    );
  }

  return url;
}

function assertProductionUrl(
  name: string,
  url: URL,
  expectedHost: string,
) {
  if (!isProductionRuntime()) {
    return;
  }

  if (url.protocol !== "https:" || url.hostname !== expectedHost || url.port) {
    throw new Error(
      `Invalid production environment variable: ${name} must be https://${expectedHost}`,
    );
  }
}

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function assertProductionApiUrl(url: URL) {
  if (!isProductionRuntime() || isE2eMockRuntime()) {
    return;
  }

  if (url.protocol !== "https:" || url.port || isLocalHost(url.hostname)) {
    throw new Error(
      "Invalid production environment variable: NEXT_PUBLIC_API_URL must be a public HTTPS origin",
    );
  }
}

function assertProductionSupabaseUrl(url: URL) {
  if (!isProductionRuntime() || isE2eMockRuntime()) {
    return;
  }

  if (
    url.protocol !== "https:" ||
    url.port ||
    !url.hostname.endsWith(".supabase.co") ||
    url.hostname.startsWith("your-project-ref.")
  ) {
    throw new Error(
      "Invalid production environment variable: NEXT_PUBLIC_SUPABASE_URL must be a deployed https://<project-ref>.supabase.co URL",
    );
  }
}

function assertProductionPublishableKey(value: string) {
  if (
    isProductionRuntime() &&
    !isE2eMockRuntime() &&
    value === "your_supabase_publishable_key"
  ) {
    throw new Error(
      "Invalid production environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is still a placeholder",
    );
  }
}

export function getSupabaseEnv(): SupabaseEnv {
  const supabaseUrl = parsePublicUrl(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const supabasePublishableKey = requirePublicValue(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  assertProductionSupabaseUrl(supabaseUrl);
  assertProductionPublishableKey(supabasePublishableKey);

  return {
    supabasePublishableKey,
    supabaseUrl: supabaseUrl.toString().replace(/\/$/, ""),
  };
}

export function getApiUrl() {
  const apiUrl = parsePublicUrl("NEXT_PUBLIC_API_URL", process.env.NEXT_PUBLIC_API_URL);

  assertProductionApiUrl(apiUrl);

  return apiUrl.toString().replace(/\/$/, "");
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
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredUrl && !isProductionRuntime()) {
    return "http://localhost:3000";
  }

  const siteUrl = parsePublicUrl("NEXT_PUBLIC_SITE_URL", configuredUrl);

  assertProductionUrl("NEXT_PUBLIC_SITE_URL", siteUrl, PRODUCTION_SITE_HOST);

  return siteUrl.toString().replace(/\/$/, "");
}

export function validateProductionEnv() {
  if (!isProductionRuntime()) {
    return;
  }

  getSiteUrl();
  getApiUrl();
  getSupabaseEnv();
}
