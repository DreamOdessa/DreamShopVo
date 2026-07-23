"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { completeTelegramRegistration } from "./actions";
import {
  initialTelegramAuthState,
  type TelegramAuthState,
} from "./telegram-state";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function TelegramPasswordForm() {
  const [token, setToken] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<
    TelegramAuthState,
    FormData
  >(completeTelegramRegistration, initialTelegramAuthState);

  useEffect(() => {
    const readToken = () => {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const nextToken = hash.get("token") ?? "";

      setToken(TOKEN_PATTERN.test(nextToken) ? nextToken : "");
      window.history.replaceState(null, "", window.location.pathname);
    };

    readToken();
    window.addEventListener("hashchange", readToken);

    return () => {
      window.removeEventListener("hashchange", readToken);
    };
  }, []);

  if (token === null) {
    return <p className="auth-message">Перевіряємо посилання…</p>;
  }

  if (!token) {
    return (
      <p className="auth-message auth-message-error" role="alert">
        Посилання недійсне. Поверніться до Telegram і запросіть нове.
      </p>
    );
  }

  return (
    <form action={formAction} className="auth-form">
      <input name="token" type="hidden" value={token} />

      <label className="auth-field">
        <span>Новий пароль</span>
        <span className="auth-input-wrap">
          <KeyRound aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoComplete="new-password"
            maxLength={72}
            minLength={10}
            name="password"
            placeholder="Щонайменше 10 символів"
            required
            type="password"
          />
        </span>
      </label>

      <label className="auth-field">
        <span>Повторіть пароль</span>
        <span className="auth-input-wrap">
          <KeyRound aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoComplete="new-password"
            maxLength={72}
            minLength={10}
            name="passwordConfirmation"
            placeholder="Повторіть пароль"
            required
            type="password"
          />
        </span>
      </label>

      <div
        aria-live="polite"
        className={`auth-message auth-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </div>

      <button className="auth-primary-button" disabled={pending} type="submit">
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={18} />
        ) : null}
        Завершити реєстрацію
      </button>
    </form>
  );
}
