const REDIRECT_BASE_URL = "https://dreamshop.invalid";

export function safeNextPath(
  value: string | null | undefined,
  fallback = "/account",
) {
  if (
    !value?.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  try {
    const url = new URL(value, REDIRECT_BASE_URL);

    if (url.origin !== REDIRECT_BASE_URL) {
      return fallback;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
