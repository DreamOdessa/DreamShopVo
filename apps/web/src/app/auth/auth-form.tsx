"use client";

import { KeyRound, LoaderCircle, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

import {
  signIn,
  signUp,
} from "./actions";
import { initialAuthState, type AuthActionState } from "./auth-state";

type AuthFormProps = {
  mode: "login" | "register";
  nextPath: string;
};

export function AuthForm({ mode, nextPath }: AuthFormProps) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    action,
    initialAuthState,
  );

  return (
    <form action={formAction} className="auth-form">
      <input name="next" type="hidden" value={nextPath} />
      {mode === "register" ? (
        <label className="auth-field">
          <span>Ім’я</span>
          <span className="auth-input-wrap">
            <UserRound aria-hidden size={18} strokeWidth={1.8} />
            <input
              autoComplete="given-name"
              maxLength={80}
              minLength={2}
              name="firstName"
              placeholder="Ваше ім’я"
              required
              type="text"
            />
          </span>
        </label>
      ) : null}

      <label className="auth-field">
        <span>{mode === "login" ? "Email або телефон" : "Email"}</span>
        <span className="auth-input-wrap">
          <Mail aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoCapitalize="none"
            autoComplete={mode === "login" ? "username" : "email"}
            inputMode={mode === "login" ? "text" : "email"}
            maxLength={254}
            name={mode === "login" ? "identifier" : "email"}
            placeholder={
              mode === "login" ? "Email або +380…" : "name@example.com"
            }
            required
            type={mode === "login" ? "text" : "email"}
          />
        </span>
      </label>

      <label className="auth-field">
        <span>Пароль</span>
        <span className="auth-input-wrap">
          <KeyRound aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            maxLength={72}
            minLength={mode === "login" ? 1 : 10}
            name="password"
            placeholder={mode === "register" ? "Щонайменше 10 символів" : "Ваш пароль"}
            required
            type="password"
          />
        </span>
      </label>

      {mode === "login" ? (
        <Link
          className="auth-secondary-link auth-secondary-link-end"
          href={`/auth/forgot-password?next=${encodeURIComponent(nextPath)}`}
        >
          Забули пароль?
        </Link>
      ) : null}

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
        {mode === "login" ? "Увійти" : "Створити акаунт"}
      </button>
    </form>
  );
}
