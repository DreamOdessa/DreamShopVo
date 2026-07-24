"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../../lib/auth/admin";
import { isOrderStatus, type OrderStatus } from "../../../lib/orders";

import type { AdminActionState } from "../action-state";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorState(message: string): AdminActionState {
  return { message, status: "error" };
}

function trackingNumberValue(formData: FormData) {
  return stringValue(formData, "trackingNumber").replace(/\s/g, "");
}

function isTrackingNumber(value: string) {
  return /^[0-9]{14}$/.test(value);
}

export async function updateOrderStatus(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const orderId = stringValue(formData, "orderId");
  const status = stringValue(formData, "status");
  const trackingNumber = trackingNumberValue(formData);

  if (!UUID_PATTERN.test(orderId) || !isOrderStatus(status)) {
    return errorState("Замовлення або статус некоректні.");
  }

  if (
    status === "shipped" &&
    trackingNumber &&
    !isTrackingNumber(trackingNumber)
  ) {
    return errorState("Вкажіть ТТН Нової пошти: рівно 14 цифр.");
  }

  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId || !isAdmin) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  const update: {
    status: OrderStatus;
    tracking_number?: string;
  } = { status };

  if (status === "shipped" && trackingNumber) {
    update.tracking_number = trackingNumber;
  }

  const { data, error } = await supabase
    .from("orders")
    .update(update)
    .eq("id", orderId)
    .select("id")
    .maybeSingle();

  if (error) {
    return errorState(
      error.code === "23514"
        ? status === "shipped"
          ? "Для відправлення Новою поштою потрібна ТТН із 14 цифр."
          : "Цей перехід статусу вже недоступний. Оновіть сторінку."
        : "Не вдалося змінити статус замовлення.",
    );
  }

  if (!data) {
    return errorState("Замовлення не знайдено.");
  }

  revalidatePath("/account");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);

  return {
    message: "Статус замовлення оновлено.",
    status: "success",
  };
}

export async function updateOrderTracking(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const orderId = stringValue(formData, "orderId");
  const trackingNumber = trackingNumberValue(formData);

  if (!UUID_PATTERN.test(orderId) || !isTrackingNumber(trackingNumber)) {
    return errorState("Вкажіть ТТН Нової пошти: рівно 14 цифр.");
  }

  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId || !isAdmin) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ tracking_number: trackingNumber })
    .eq("id", orderId)
    .eq("status", "shipped")
    .select("id")
    .maybeSingle();

  if (error) {
    return errorState("Не вдалося оновити ТТН.");
  }

  if (!data) {
    return errorState("ТТН можна змінити лише для відправленого замовлення.");
  }

  revalidatePath("/account");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/orders/${orderId}`);

  return {
    message: "ТТН оновлено.",
    status: "success",
  };
}
