import { headers } from "next/headers";

import { getSiteUrl } from "../env";

type AuthOriginOptions = {
  branchUrl?: string;
  nodeEnv?: string;
  productionUrl?: string;
  requestOrigin?: string | null;
  siteUrl: string;
  vercelUrl?: string;
};

function parsedOrigin(value: string | null | undefined, defaultProtocol = "https:") {
  const normalized = value?.trim();

  if (!normalized) return null;

  try {
    const url = new URL(
      normalized.includes("://")
        ? normalized
        : `${defaultProtocol}//${normalized}`,
    );

    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return null;
    }

    return url;
  } catch {
    return null;
  }
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export function selectAuthRedirectOrigin({
  branchUrl,
  nodeEnv,
  productionUrl,
  requestOrigin,
  siteUrl,
  vercelUrl,
}: AuthOriginOptions) {
  const fallback = parsedOrigin(siteUrl);

  if (!fallback) {
    throw new Error("The configured site URL is invalid.");
  }

  const candidate = parsedOrigin(requestOrigin);

  if (!candidate) return fallback.origin;

  const trustedOrigins = new Set(
    [fallback.origin, branchUrl, productionUrl, vercelUrl]
      .map((value) => parsedOrigin(value)?.origin)
      .filter((value): value is string => Boolean(value)),
  );

  if (trustedOrigins.has(candidate.origin)) {
    return candidate.origin;
  }

  if (nodeEnv !== "production" && isLocalHostname(candidate.hostname)) {
    return candidate.origin;
  }

  return fallback.origin;
}

export async function getAuthRedirectOrigin() {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedOrigin = forwardedHost
    ? `${forwardedProtocol === "http" ? "http" : "https"}://${forwardedHost}`
    : null;

  return selectAuthRedirectOrigin({
    branchUrl: process.env.VERCEL_BRANCH_URL,
    nodeEnv: process.env.NODE_ENV,
    productionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    requestOrigin: requestHeaders.get("origin") ?? forwardedOrigin,
    siteUrl: getSiteUrl(),
    vercelUrl: process.env.VERCEL_URL,
  });
}
