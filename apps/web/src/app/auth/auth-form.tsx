"use client";

import { KeyRound, LoaderCircle, Mail, UserRound } from "lucide-react";
import { useActionState } from "react";

import {
  signIn,
  signUp,
} from "./actions";
import { initialAuthState, type AuthActionState } from "./auth-state";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(
    action,
    initialAuthState,
  );

  return (
    <form action={formAction} className="auth-form">
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
        <span>Email</span>
        <span className="auth-input-wrap">
          <Mail aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoCapitalize="none"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            name="email"
            placeholder="name@example.com"
            required
            type="email"
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
