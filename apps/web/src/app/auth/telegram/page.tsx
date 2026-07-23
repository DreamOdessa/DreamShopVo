import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { TelegramPasswordForm } from "./telegram-password-form";

export const metadata: Metadata = {
  title: "Реєстрація через Telegram - DreamShop",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramRegistrationPage() {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-labelledby="telegram-auth-title">
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

        <div className="auth-heading">
          <h1 id="telegram-auth-title">Створіть пароль</h1>
          <p>
            Номер телефону вже підтверджено через Telegram. Залишилося захистити
            ваш акаунт паролем.
          </p>
        </div>

        <TelegramPasswordForm />

        <Link className="auth-back-link" href="/auth">
          Повернутися до входу
        </Link>
      </section>
    </main>
  );
}
