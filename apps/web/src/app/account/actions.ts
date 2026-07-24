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

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function authenticatedUser() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  return {
    supabase,
    userId: claimsError ? undefined : userId,
  };
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

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
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

export async function markNotificationRead(formData: FormData) {
  const notificationId = normalizedValue(formData, "notificationId");

  if (!isUuid(notificationId)) {
    return;
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    redirect("/auth");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    throw new Error("Unable to update the notification.");
  }

  revalidatePath("/account");
}

export async function markAllNotificationsRead() {
  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    redirect("/auth");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) {
    throw new Error("Unable to update notifications.");
  }

  revalidatePath("/account");
}

export async function openAdmin() {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession();

  if (error) {
    redirect("/auth");
  }

  redirect("/admin");
}
