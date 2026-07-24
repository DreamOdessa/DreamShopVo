"use client";

import { LoaderCircle, Mail } from "lucide-react";
import { useActionState } from "react";

import { requestPasswordReset } from "../actions";
import { initialAuthState, type AuthActionState } from "../auth-state";

type ForgotPasswordFormProps = {
  nextPath: string;
};

export function ForgotPasswordForm({
  nextPath,
}: ForgotPasswordFormProps) {
  const [state, formAction, pending] = useActionState<
    AuthActionState,
    FormData
  >(requestPasswordReset, initialAuthState);

  return (
    <form action={formAction} className="auth-form">
      <input name="next" type="hidden" value={nextPath} />
      <label className="auth-field">
        <span>Email</span>
        <span className="auth-input-wrap">
          <Mail aria-hidden size={18} strokeWidth={1.8} />
          <input
            autoCapitalize="none"
            autoComplete="email"
            maxLength={254}
            name="email"
            placeholder="name@example.com"
            required
            type="email"
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
        Надіслати посилання
      </button>
    </form>
  );
}
