"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { normalizePhone } from "../../lib/phone";
import { getAuthRedirectOrigin } from "../../lib/auth/request-origin";
import { createClient } from "../../lib/supabase/server";
import { isInvalidSessionError } from "../../lib/auth/errors";

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

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
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
  const contactPhoneValue = normalizedValue(formData, "contactPhone");
  const contactPhone = contactPhoneValue
    ? normalizePhone(contactPhoneValue)
    : null;

  if (firstName.length < 2 || firstName.length > 80) {
    return errorState("Ім’я має містити від 2 до 80 символів.");
  }

  if (lastName.length > 80) {
    return errorState("Прізвище має містити не більше 80 символів.");
  }

  if (contactPhoneValue && !contactPhone) {
    return errorState("Вкажіть коректний номер телефону.");
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      contact_phone: contactPhone,
      first_name: firstName,
      last_name: lastName || null,
    })
    .eq("id", userId);

  if (error) {
    if (isInvalidSessionError(error)) {
      return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
    }

    return errorState("Не вдалося зберегти профіль. Спробуйте ще раз.");
  }

  revalidatePath("/account");
  revalidatePath("/checkout");

  return {
    message: "Профіль збережено.",
    status: "success",
  };
}

export async function updateAvatar(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const avatar = formData.get("avatar");

  if (!(avatar instanceof File) || avatar.size === 0) {
    return errorState("Оберіть зображення для аватара.");
  }

  if (avatar.size > 3 * 1024 * 1024) {
    return errorState("Зображення має бути не більше 3 МБ.");
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(avatar.type)) {
    return errorState("Підтримуються JPG, PNG та WebP.");
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const objectPath = `${userId}/avatar`;
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(objectPath, avatar, {
      cacheControl: "3600",
      contentType: avatar.type,
      upsert: true,
    });

  if (uploadError) {
    return errorState("Не вдалося завантажити аватар. Спробуйте ще раз.");
  }

  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(objectPath);
  const avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;
  const { error: authError } = await supabase.auth.updateUser({
    data: { avatar_url: avatarUrl },
  });

  if (authError) {
    return errorState("Аватар завантажено, але профіль не оновився.");
  }

  revalidatePath("/account");

  return { message: "Аватар оновлено.", status: "success" };
}

export async function requestEmailChange(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const email = normalizedValue(formData, "email").toLowerCase();

  if (!validEmail(email)) {
    return errorState("Вкажіть коректну email-адресу.");
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const { data: userData } = await supabase.auth.getUser();

  if (userData.user?.email?.toLowerCase() === email) {
    return errorState("Ця email-адреса вже використовується у профілі.");
  }

  const authOrigin = await getAuthRedirectOrigin();
  const { error } = await supabase.auth.updateUser(
    { email },
    {
      emailRedirectTo: `${authOrigin}/auth/callback?next=${encodeURIComponent("/account?contact=email-verified")}`,
    },
  );

  if (error) {
    return errorState("Не вдалося надіслати підтвердження. Спробуйте пізніше.");
  }

  return {
    message:
      "Ми надіслали посилання для підтвердження. До підтвердження діє попередній email.",
    pendingValue: email,
    status: "pending",
  };
}

export async function requestPhoneChange(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const phone = normalizePhone(normalizedValue(formData, "phone"));

  if (!phone) {
    return errorState("Вкажіть коректний номер у міжнародному форматі.");
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const { data: userData } = await supabase.auth.getUser();

  if (userData.user?.phone === phone) {
    return errorState("Цей номер уже підтверджений у профілі.");
  }

  const { error } = await supabase.auth.updateUser({ phone });

  if (error) {
    return errorState("Не вдалося надіслати SMS-код. Перевірте номер або спробуйте пізніше.");
  }

  return {
    message: "Код надіслано. Старий номер діятиме до успішної перевірки.",
    pendingValue: phone,
    status: "pending",
  };
}

export async function verifyPhoneChange(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const phone = normalizePhone(normalizedValue(formData, "phone"));
  const token = normalizedValue(formData, "token").replace(/\s/g, "");

  if (!phone || !/^\d{6}$/.test(token)) {
    return errorState("Вкажіть шестизначний код із SMS.");
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    return errorState("Сесія завершилася. Увійдіть в акаунт повторно.");
  }

  const { error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "phone_change",
  });

  if (error) {
    return {
      message: "Код неправильний або прострочений. Номер не змінено.",
      pendingValue: phone,
      status: "error",
    };
  }

  revalidatePath("/account");
  revalidatePath("/checkout");

  return { message: "Новий номер підтверджено.", status: "success" };
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

export async function deleteSavedAddress(formData: FormData) {
  const addressId = normalizedValue(formData, "addressId");

  if (!isUuid(addressId)) {
    return;
  }

  const { supabase, userId } = await authenticatedUser();

  if (!userId) {
    redirect("/auth");
  }

  const { error } = await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Unable to delete the saved address.");
  }

  revalidatePath("/account");
  revalidatePath("/checkout");
}

export async function openAdmin() {
  const supabase = await createClient();
  const { error } = await supabase.auth.refreshSession();

  if (error) {
    redirect("/auth");
  }

  redirect("/admin/dashboard");
}
