"use server";

import { redirect } from "next/navigation";

import { getApiUrl, getSiteUrl } from "../../lib/env";
import { sessionTokens } from "../../lib/auth/session-tokens";
import { createClient } from "../../lib/supabase/server";

import type { AuthActionState } from "./auth-state";

function valueFrom(formData: FormData, name: string, trim = true) {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return "";
  }

  return trim ? value.trim() : value;
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function validatePassword(password: string) {
  return password.length >= 10 && password.length <= 72;
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}

function errorState(message: string): AuthActionState {
  return { message, status: "error" };
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const identifier = valueFrom(formData, "identifier");
  const password = valueFrom(formData, "password", false);
  const email = identifier.includes("@") ? identifier.toLowerCase() : null;
  const phone = email ? null : normalizePhone(identifier);

  if ((!email && !phone) || (email && !validEmail(email)) || !password) {
    return errorState("Перевірте email або номер телефону та пароль.");
  }

  const supabase = await createClient();
  let error: unknown;

  if (email) {
    ({ error } = await supabase.auth.signInWithPassword({ email, password }));
  } else {
    try {
      const response = await fetch(
        new URL("/auth/phone/login", `${getApiUrl().replace(/\/+$/, "")}/`),
        {
          method: "POST",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, phone }),
          redirect: "error",
        },
      );
      const tokens = response.ok
        ? sessionTokens(await response.json())
        : null;

      if (!tokens) {
        error = new Error("Phone sign-in failed.");
      } else {
        ({ error } = await supabase.auth.setSession(tokens));
      }
    } catch {
      error = new Error("Phone sign-in failed.");
    }
  }

  if (error) {
    return errorState("Не вдалося увійти. Перевірте дані або підтвердьте email.");
  }

  redirect("/account");
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const firstName = valueFrom(formData, "firstName");
  const email = valueFrom(formData, "email").toLowerCase();
  const password = valueFrom(formData, "password", false);

  if (firstName.length < 2 || firstName.length > 80) {
    return errorState("Вкажіть ім’я від 2 до 80 символів.");
  }

  if (!validEmail(email)) {
    return errorState("Вкажіть коректну адресу електронної пошти.");
  }

  if (!validatePassword(password)) {
    return errorState("Пароль має містити від 10 до 72 символів.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
    },
  });

  if (error) {
    return errorState("Не вдалося створити обліковий запис. Спробуйте пізніше.");
  }

  if (data.session) {
    redirect("/account");
  }

  return {
    message: "Перевірте пошту та підтвердьте реєстрацію.",
    status: "success",
  };
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/account`,
    },
  });

  if (error || !data.url) {
    redirect("/auth?error=google");
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut({ scope: "local" });
  redirect("/auth");
}
