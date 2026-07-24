"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../lib/supabase/server";

import type { ProfileActionState } from "./profile-state";

function normalizedValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ")
    : "";
}

function errorState(message: string): ProfileActionState {
  return { message, status: "error" };
}

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const firstName = normalizedValue(formData, "firstName");
  const lastName = normalizedValue(formData, "lastName");

  if (firstName.length < 2 || firstName.length > 80) {
    return errorState("Ім’я має містити від 2 до 80 символів.");
  }

  if (lastName.length > 80) {
    return errorState("Прізвище має містити не більше 80 символів.");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName || null,
    })
    .eq("id", userId);

  if (error) {
    return errorState("Не вдалося зберегти профіль. Спробуйте ще раз.");
  }

  revalidatePath("/account");

  return {
    message: "Профіль збережено.",
    status: "success",
  };
}

export async function openAdmin() {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession();

  if (error) {
    redirect("/auth");
  }

  redirect("/admin");
}
