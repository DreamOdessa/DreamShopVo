"use client";

import { LoaderCircle, Save } from "lucide-react";
import { useActionState } from "react";

import { updateProfile } from "./actions";
import {
  initialProfileState,
  type ProfileActionState,
} from "./profile-state";

type ProfileFormProps = {
  firstName: string;
  lastName: string;
};

export function ProfileForm({
  firstName,
  lastName,
}: ProfileFormProps) {
  const [state, formAction, pending] = useActionState<
    ProfileActionState,
    FormData
  >(updateProfile, initialProfileState);

  return (
    <form action={formAction} className="profile-form">
      <div className="profile-fields">
        <label className="auth-field">
          <span>Ім’я</span>
          <span className="auth-input-wrap">
            <input
              autoComplete="given-name"
              defaultValue={firstName}
              maxLength={80}
              minLength={2}
              name="firstName"
              placeholder="Ваше ім’я"
              required
              type="text"
            />
          </span>
        </label>

        <label className="auth-field">
          <span>Прізвище</span>
          <span className="auth-input-wrap">
            <input
              autoComplete="family-name"
              defaultValue={lastName}
              maxLength={80}
              name="lastName"
              placeholder="Ваше прізвище"
              type="text"
            />
          </span>
        </label>
      </div>

      <div
        aria-live="polite"
        className={`auth-message auth-message-${state.status}`}
        role={state.status === "error" ? "alert" : "status"}
      >
        {state.message}
      </div>

      <button
        className="profile-save-button"
        disabled={pending}
        type="submit"
      >
        {pending ? (
          <LoaderCircle aria-hidden className="auth-spinner" size={18} />
        ) : (
          <Save aria-hidden size={18} strokeWidth={1.8} />
        )}
        Зберегти
      </button>
    </form>
  );
}
