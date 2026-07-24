import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { safeNextPath } from "../../../lib/auth/redirect";
import { createClient } from "../../../lib/supabase/server";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Новий пароль - DreamShop",
  robots: {
    index: false,
    follow: false,
  },
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="reset-password-title">
        <Link aria-label="DreamShop" className="auth-logo-link" href="/">
          <Image
            alt="DreamShop"
            className="auth-logo"
            height={208}
            priority
            src="/logo-name.PNG"
            width={260}
          />
        </Link>

        <div className="auth-heading">
          <h1 id="reset-password-title">Створіть новий пароль</h1>
          <p>
            Використайте щонайменше 10 символів і не повторюйте пароль з інших
            сервісів.
          </p>
        </div>

        {user ? (
          <ResetPasswordForm nextPath={nextPath} />
        ) : (
          <p className="auth-message auth-message-error" role="alert">
            Посилання недійсне або застаріло. Запросіть нове посилання.
          </p>
        )}

        <Link
          className="auth-secondary-link auth-secondary-link-center"
          href={`/auth/forgot-password?next=${encodeURIComponent(nextPath)}`}
        >
          Запросити нове посилання
        </Link>
      </section>
    </main>
  );
}
