"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "../../../../lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CancelOrderState = {
  message: string;
  status: "error" | "idle" | "success";
};

function errorState(message: string): CancelOrderState {
  return { message, status: "error" };
}

export async function cancelOrder(
  _previousState: CancelOrderState,
  formData: FormData,
): Promise<CancelOrderState> {
  const value = formData.get("orderId");
  const orderId = typeof value === "string" ? value.trim() : "";

  if (!UUID_PATTERN.test(orderId)) {
    return errorState("Замовлення не знайдено.");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return errorState("Сесія завершилася. Увійдіть повторно.");
  }

  const { data, error } = await supabase.rpc("cancel_own_order", {
    p_order_id: orderId,
  });

  if (error || !data?.length) {
    return errorState(
      error?.code === "23514"
        ? "Замовлення вже прийнято в роботу або скасовано."
        : error?.code === "42501"
          ? "Замовлення не знайдено або немає права на його скасування."
          : "Не вдалося скасувати замовлення. Спробуйте ще раз.",
    );
  }

  revalidatePath("/account");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  return {
    message: "Замовлення скасовано.",
    status: "success",
  };
}
