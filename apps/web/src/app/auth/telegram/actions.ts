"use server";

import { redirect } from "next/navigation";

import { getApiUrl } from "../../../lib/env";
import { sessionTokens } from "../../../lib/auth/session-tokens";
import { createClient } from "../../../lib/supabase/server";

import type { TelegramAuthState } from "./telegram-state";

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value : "";
}

function errorState(message: string): TelegramAuthState {
  return { message, status: "error" };
}

export async function completeTelegramRegistration(
  _previousState: TelegramAuthState,
  formData: FormData,
): Promise<TelegramAuthState> {
  const token = stringValue(formData, "token").trim();
  const password = stringValue(formData, "password");
  const passwordConfirmation = stringValue(formData, "passwordConfirmation");

  if (!TOKEN_PATTERN.test(token)) {
    return errorState("Посилання недійсне або пошкоджене.");
  }

  if (password.length < 10 || password.length > 72) {
    return errorState("Пароль має містити від 10 до 72 символів.");
  }

  if (password !== passwordConfirmation) {
    return errorState("Паролі не збігаються.");
  }

  let response: Response;

  try {
    response = await fetch(
      new URL("/auth/telegram/complete", `${getApiUrl().replace(/\/+$/, "")}/`),
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, token }),
        redirect: "error",
      },
    );
  } catch {
    return errorState("Сервіс реєстрації тимчасово недоступний.");
  }

  if (!response.ok) {
    if (response.status === 409) {
      return errorState("Акаунт із цим номером уже існує.");
    }

    if (response.status === 400) {
      return errorState("Посилання недійсне або вже використане.");
    }

    return errorState("Сервіс реєстрації тимчасово недоступний.");
  }

  const tokens = sessionTokens(await response.json());

  if (!tokens) {
    return errorState("Сервіс реєстрації повернув некоректну відповідь.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.setSession(tokens);

  if (error) {
    return errorState("Не вдалося створити сесію. Спробуйте увійти ще раз.");
  }

  redirect("/account");
}
