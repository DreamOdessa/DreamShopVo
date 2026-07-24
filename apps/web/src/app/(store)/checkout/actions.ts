"use server";

import type { CheckoutState } from "./checkout-state";
import { createClient } from "../../../lib/supabase/server";

const DELIVERY_METHODS = new Set([
  "post_office",
  "address",
  "schedule",
  "taxi",
]);
const PAYMENT_METHODS = new Set([
  "cash_on_delivery",
  "card_online",
  "card_on_delivery",
  "bank_transfer",
]);

function valueFrom(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorState(message: string): CheckoutState {
  return { message, status: "error" };
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 15) {
    return null;
  }

  return `+${digits}`;
}

function parseItems(value: string) {
  try {
    const items = JSON.parse(value) as unknown;

    if (!Array.isArray(items) || items.length < 1 || items.length > 50) {
      return null;
    }

    const normalized = items.map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const quantity = Number(record.quantity);

      if (
        typeof record.productId !== "string" ||
        !/^[0-9a-f-]{36}$/i.test(record.productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 99
      ) {
        return null;
      }

      return {
        productId: record.productId,
        quantity,
      };
    });

    if (normalized.some((item) => !item)) {
      return null;
    }

    return normalized;
  } catch {
    return null;
  }
}

export async function createOrder(
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const items = parseItems(valueFrom(formData, "items"));
  const firstName = valueFrom(formData, "firstName");
  const lastName = valueFrom(formData, "lastName");
  const phone = normalizePhone(valueFrom(formData, "phone"));
  const city = valueFrom(formData, "city");
  const deliveryMethod = valueFrom(formData, "deliveryMethod");
  const deliveryDetails = valueFrom(formData, "deliveryDetails");
  const establishmentName = valueFrom(formData, "establishmentName");
  const paymentMethod = valueFrom(formData, "paymentMethod");
  const note = valueFrom(formData, "note");

  if (!items) {
    return errorState("Кошик порожній або містить некоректні дані.");
  }

  if (
    firstName.length < 2 ||
    firstName.length > 80 ||
    lastName.length < 2 ||
    lastName.length > 80 ||
    !phone ||
    city.length < 2 ||
    city.length > 120 ||
    deliveryDetails.length < 2 ||
    deliveryDetails.length > 500 ||
    establishmentName.length > 160 ||
    note.length > 1000 ||
    !DELIVERY_METHODS.has(deliveryMethod) ||
    !PAYMENT_METHODS.has(paymentMethod)
  ) {
    return errorState("Перевірте контактні дані та спосіб доставки.");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims?.sub) {
    return errorState("Сесія завершилася. Увійдіть знову та повторіть замовлення.");
  }

  const { data, error } = await supabase.rpc("create_order", {
    p_contact_for_clarification:
      formData.get("contactForClarification") === "on",
    p_customer_first_name: firstName,
    p_customer_last_name: lastName,
    p_customer_note: note || null,
    p_customer_phone: phone,
    p_delivery_city: city,
    p_delivery_details: deliveryDetails,
    p_delivery_method: deliveryMethod,
    p_establishment_name: establishmentName || null,
    p_is_private_person: formData.get("isPrivatePerson") === "on",
    p_items: items,
    p_payment_method: paymentMethod,
  });
  const order = (
    data as Array<{
      order_id: string;
      order_number: number | string;
      total: number | string;
    }> | null
  )?.[0];

  if (error || !order) {
    return errorState(
      error?.message.includes("unavailable")
        ? "Один із товарів уже недоступний. Оновіть кошик."
        : "Не вдалося створити замовлення. Спробуйте ще раз.",
    );
  }

  return {
    message: "Замовлення успішно створено.",
    orderId: order.order_id,
    orderNumber: Number(order.order_number),
    status: "success",
  };
}
