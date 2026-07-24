const TELEGRAM_AUTH_EMAIL_SUFFIX = "@auth.dreamshop.invalid";

export function isTelegramAuthEmail(email: string | null | undefined) {
  return email?.endsWith(TELEGRAM_AUTH_EMAIL_SUFFIX) ?? false;
}
