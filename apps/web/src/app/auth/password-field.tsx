"use client";

import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

type PasswordFieldProps = {
  autoComplete: "current-password" | "new-password";
  label: string;
  minLength: number;
  name: string;
  placeholder: string;
};

export function PasswordField({
  autoComplete,
  label,
  minLength,
  name,
  placeholder,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="auth-field">
      <span>{label}</span>
      <span className="auth-input-wrap auth-password-wrap">
        <KeyRound aria-hidden size={18} strokeWidth={1.8} />
        <input
          autoComplete={autoComplete}
          maxLength={72}
          minLength={minLength}
          name={name}
          placeholder={placeholder}
          required
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? "Приховати пароль" : "Показати пароль"}
          aria-pressed={visible}
          className="auth-password-toggle"
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? <EyeOff aria-hidden size={18} /> : <Eye aria-hidden size={18} />}
        </button>
      </span>
    </label>
  );
}
