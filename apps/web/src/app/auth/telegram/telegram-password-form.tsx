"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";

import {
  completeTelegramLogin,
  completeTelegramRegistration,
} from "./actions";
import {
  initialTelegramAuthState,
  type TelegramAuthState,
} from "./telegram-state";
import { PasswordField } from "../password-field";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

type TelegramLink = {
  mode: "login" | "register";
  token: string;
};

export function TelegramPasswordForm() {
  const [link, setLink] = useState<TelegramLink | null | undefined>(undefined);
  const loginFormRef = useRef<HTMLFormElement>(null);
  const submittedTokenRef = useRef("");
  const [loginState, loginAction, loginPending] = useActionState<
    TelegramAuthState,
    FormData
  >(completeTelegramLogin, initialTelegramAuthState);
  const [registrationState, registrationAction, registrationPending] = useActionState<
    TelegramAuthState,
    FormData
  >(completeTelegramRegistration, initialTelegramAuthState);

  useEffect(() => {
    const readToken = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const nextToken = hash.get("token") ?? "";
      const mode = hash.get("mode") === "login" ? "login" : "register";

      setLink(
        TOKEN_PATTERN.test(nextToken)
          ? { mode, token: nextToken }
          : null,
      );
      window.history.replaceState(null, "", window.location.pathname);
    };

    readToken();
    window.addEventListener("hashchange", readToken);

    return () => {
      window.removeEventListener("hashchange", readToken);
    };
  }, []);

  useEffect(() => {
    if (
      link?.mode === "login" &&
      submittedTokenRef.current !== link.token
    ) {
      submittedTokenRef.current = link.token;
      loginFormRef.current?.requestSubmit();
    }
  }, [link]);

  if (link === undefined) {
    return <p className="auth-message">Перевіряємо посилання…</p>;
  }

  if (!link) {
    return (
      <p className="auth-message auth-message-error" role="alert">
        Посилання недійсне. Поверніться до Telegram і запросіть нове.
      </p>
    );
  }

  if (link.mode === "login") {
    return (
      <form action={loginAction} className="auth-form" ref={loginFormRef}>
        <input name="token" type="hidden" value={link.token} />

        <p className="auth-message" aria-live="polite">
          {loginPending
            ? "Входимо у ваш акаунт…"
            : loginState.message || "Підтверджуємо вхід…"}
        </p>

        <button className="auth-primary-button" disabled={loginPending} type="submit">
          {loginPending ? (
            <LoaderCircle aria-hidden className="auth-spinner" size={18} />
          ) : null}
          Увійти через Telegram
        </button>
      </form>
    );
  }

  return (
    <form action={registrationAction} className="auth-form">
      <input name="token" type="hidden" value={link.token} />

      <PasswordField autoComplete="new-password" label="Новий пароль" minLength={10} name="password" placeholder="Щонайменше 10 символів" />
      <PasswordField autoComplete="new-password" label="Повторіть пароль" minLength={10} name="passwordConfirmation" placeholder="Повторіть пароль" />

      <div
        aria-live="polite"
        className={`auth-message auth-message-${registrationState.status}`}
        role={registrationState.status === "error" ? "alert" : "status"}
      >
        {registrationState.message}
      </div>

      <button className="auth-primary-button" disabled={registrationPending} type="submit">
        {registrationPending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={18} />
        ) : null}
        Зберегти пароль
      </button>
    </form>
  );
}
