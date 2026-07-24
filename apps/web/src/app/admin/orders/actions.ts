"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../../lib/auth/admin";
import { isOrderStatus } from "../../../lib/orders";

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

export async function updateOrderStatus(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const orderId = stringValue(formData, "orderId");
  const status = stringValue(formData, "status");

  if (!UUID_PATTERN.test(orderId) || !isOrderStatus(status)) {
    return errorState("Замовлення або статус некоректні.");
  }

  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId || !isAdmin) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id")
    .maybeSingle();

  if (error) {
    return errorState(
      error.code === "23514"
        ? "Цей перехід статусу вже недоступний. Оновіть сторінку."
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
