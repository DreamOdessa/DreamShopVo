"use server";

import { redirect } from "next/navigation";

import { getApiUrl, getSiteUrl } from "../../lib/env";
import { safeNextPath } from "../../lib/auth/redirect";
import { sessionTokens } from "../../lib/auth/session-tokens";
import { normalizePhone } from "../../lib/phone";
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

function errorState(message: string): AuthActionState {
  return { message, status: "error" };
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const identifier = valueFrom(formData, "identifier");
  const password = valueFrom(formData, "password", false);
  const next = safeNextPath(valueFrom(formData, "next"));
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

  redirect(next);
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const firstName = valueFrom(formData, "firstName");
  const email = valueFrom(formData, "email").toLowerCase();
  const password = valueFrom(formData, "password", false);
  const next = safeNextPath(valueFrom(formData, "next"));

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
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return errorState("Не вдалося створити обліковий запис. Спробуйте пізніше.");
  }

  if (data.session) {
    redirect(next);
  }

  return {
    message: "Перевірте пошту та підтвердьте реєстрацію.",
    status: "success",
  };
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(valueFrom(formData, "next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    redirect(
      `/auth?error=google&next=${encodeURIComponent(next)}`,
    );
  }

  redirect(data.url);
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = valueFrom(formData, "email").toLowerCase();
  const next = safeNextPath(valueFrom(formData, "next"));

  if (!validEmail(email)) {
    return errorState("Вкажіть коректну адресу електронної пошти.");
  }

  const resetPage = `/auth/reset-password?next=${encodeURIComponent(next)}`;
  const supabase = await createClient();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=${encodeURIComponent(resetPage)}`,
  });

  return {
    message:
      "Якщо акаунт з таким email існує, ми надіслали посилання для відновлення.",
    status: "success",
  };
}

export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = valueFrom(formData, "password", false);
  const confirmation = valueFrom(formData, "passwordConfirmation", false);
  const next = safeNextPath(valueFrom(formData, "next"));

  if (!validatePassword(password)) {
    return errorState("Пароль має містити від 10 до 72 символів.");
  }

  if (password !== confirmation) {
    return errorState("Паролі не збігаються.");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorState(
      "Посилання недійсне або застаріло. Запросіть нове посилання.",
    );
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return errorState("Не вдалося оновити пароль. Запросіть нове посилання.");
  }

  await supabase.auth.signOut({ scope: "local" });
  redirect(`/auth?notice=password-updated&next=${encodeURIComponent(next)}`);
}

export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut({ scope: "local" });
  redirect("/auth");
}
