"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { updatePassword } from "../actions";
import { initialAuthState, type AuthActionState } from "../auth-state";

type ResetPasswordFormProps = {
  nextPath: string;
};

export function ResetPasswordForm({ nextPath }: ResetPasswordFormProps) {
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(updatePassword, initialAuthState);

  return (
    <form action={formAction} className="auth-form">
      <input name="next" type="hidden" value={nextPath} />
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
            placeholder="Повторіть новий пароль"
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
        Зберегти новий пароль
      </button>
    </form>
  );
}
