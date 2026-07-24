"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../../lib/auth/admin";

import type { AdminActionState } from "../action-state";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISCOUNT_PATTERN = /^(?:100(?:\.0{1,2})?|\d{1,2}(?:\.\d{1,2})?)$/;

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorState(message: string): AdminActionState {
  return { message, status: "error" };
}

export async function updateCustomerDiscount(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const customerId = stringValue(formData, "customerId");
  const discountValue = stringValue(formData, "discount").replace(",", ".");

  if (!UUID_PATTERN.test(customerId) || !DISCOUNT_PATTERN.test(discountValue)) {
    return errorState("Вкажіть знижку від 0 до 100% з точністю до сотих.");
  }

  const discount = Number(discountValue);
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId || !isAdmin) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  const { error } = await supabase.rpc("set_customer_discount", {
    p_discount_percent: discount,
    p_user_id: customerId,
  });

  if (error) {
    if (error.code === "P0002") {
      return errorState("Клієнта не знайдено.");
    }

    if (error.code === "42501") {
      return errorState("Недостатньо прав для зміни знижки.");
    }

    return errorState("Не вдалося зберегти знижку.");
  }

  revalidatePath("/admin/customers");
  revalidatePath("/checkout");

  return {
    message: "Знижку збережено.",
    status: "success",
  };
}
