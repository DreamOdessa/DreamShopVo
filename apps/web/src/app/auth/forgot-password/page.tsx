import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { safeNextPath } from "../../../lib/auth/redirect";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Відновлення пароля - DreamShop",
  robots: {
    index: false,
    follow: false,
  },
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;
  const nextPath = safeNextPath(params.next);

  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="forgot-password-title">
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
          <h1 id="forgot-password-title">Відновлення пароля</h1>
          <p>
            Вкажіть email акаунта. Ми надішлемо захищене посилання для створення
            нового пароля.
          </p>
        </div>

        <ForgotPasswordForm nextPath={nextPath} />

        <Link
          className="auth-secondary-link auth-secondary-link-center"
          href={`/auth?next=${encodeURIComponent(nextPath)}`}
        >
          Повернутися до входу
        </Link>
      </section>
    </main>
  );
}
