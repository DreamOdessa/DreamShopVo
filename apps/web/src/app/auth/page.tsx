import { CircleUserRound, Send } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AuthForm } from "./auth-form";
import { signInWithGoogle } from "./actions";

export const metadata: Metadata = {
  title: "Вхід - DreamShop",
  description: "Вхід та реєстрація в DreamShop.",
  robots: {
    index: false,
    follow: false,
  },
};

type AuthPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
  const telegramUsername =
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim() ?? "";
  const telegramEnabled = /^[A-Za-z0-9_]{5,32}$/.test(telegramUsername);

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="auth-title">
        <Link aria-label="DreamShop" className="auth-logo-link" href="/">
          <Image
            className="auth-logo"
            src="/logo-name.PNG"
            alt="DreamShop"
            width={260}
            height={208}
            priority
          />
        </Link>

        <div className="auth-tabs" aria-label="Вхід або реєстрація">
          <Link
            aria-current={mode === "login" ? "page" : undefined}
            href="/auth"
          >
            Вхід
          </Link>
          <Link
            aria-current={mode === "register" ? "page" : undefined}
            href="/auth?mode=register"
          >
            Реєстрація
          </Link>
        </div>

        <div className="auth-heading">
          <h1 id="auth-title">
            {mode === "login" ? "Раді бачити знову" : "Створіть акаунт"}
          </h1>
          <p>
            {mode === "login"
              ? "Увійдіть, щоб керувати замовленнями та обраними товарами."
              : "Один акаунт для покупок, адрес доставки та історії замовлень."}
          </p>
        </div>

        {params.error === "google" ? (
          <p className="auth-message auth-message-error" role="alert">
            Вхід через Google поки недоступний. Скористайтеся email.
          </p>
        ) : null}

        <div className="auth-provider-list">
          <form action={signInWithGoogle}>
            <button
              aria-disabled={!googleEnabled}
              className="auth-provider-button"
              disabled={!googleEnabled}
              type="submit"
            >
              <CircleUserRound aria-hidden size={19} strokeWidth={1.8} />
              Продовжити з Google
            </button>
          </form>
          {telegramEnabled ? (
            <a
              className="auth-provider-button"
              href={`https://t.me/${telegramUsername}?start=register`}
              rel="noreferrer"
            >
              <Send aria-hidden size={19} strokeWidth={1.8} />
              Продовжити з Telegram
            </a>
          ) : (
            <button
              aria-disabled="true"
              className="auth-provider-button"
              disabled
              type="button"
            >
              <Send aria-hidden size={19} strokeWidth={1.8} />
              Продовжити з Telegram
            </button>
          )}
        </div>

        <div className="auth-divider">
          <span>або через email</span>
        </div>

        <AuthForm mode={mode} />

        <p className="auth-legal">
          Продовжуючи, ви погоджуєтеся з правилами магазину та обробкою
          персональних даних.
        </p>
      </section>
    </main>
  );
}
