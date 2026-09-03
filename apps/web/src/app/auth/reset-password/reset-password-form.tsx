"use client";

import { LoaderCircle } from "lucide-react";
import { useActionState } from "react";

import { updatePassword } from "../actions";
import { initialAuthState, type AuthActionState } from "../auth-state";
import { PasswordField } from "../password-field";

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
      <PasswordField autoComplete="new-password" label="Новий пароль" minLength={10} name="password" placeholder="Щонайменше 10 символів" />
      <PasswordField autoComplete="new-password" label="Повторіть пароль" minLength={10} name="passwordConfirmation" placeholder="Повторіть новий пароль" />

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
