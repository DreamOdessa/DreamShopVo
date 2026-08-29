"use server";

import { revalidatePath } from "next/cache";

import type { CheckoutField, CheckoutState } from "./checkout-state";
import { normalizePhone } from "../../../lib/phone";
import type { Database } from "../../../lib/supabase/database.types";
import { createClient } from "../../../lib/supabase/server";

type DeliveryMethod = Database["public"]["Enums"]["delivery_method"];
type PaymentMethod = Database["public"]["Enums"]["payment_method"];

const DELIVERY_METHODS = new Set<string>([
  "post_office",
  "address",
  "schedule",
  "taxi",
]);
const PAYMENT_METHODS = new Set<string>([
  "cash_on_delivery",
  "card_on_delivery",
]);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isDeliveryMethod(value: string): value is DeliveryMethod {
  return DELIVERY_METHODS.has(value);
}

function isPaymentMethod(value: string): value is PaymentMethod {
  return PAYMENT_METHODS.has(value);
}

function valueFrom(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorState(
  message: string,
  fieldErrors?: Partial<Record<CheckoutField, string>>,
): CheckoutState {
  return { fieldErrors, message, status: "error" };
}

function normalizedText(value: string) {
  return value.trim().replace(/\s+/g, " ");
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
        !UUID_PATTERN.test(record.productId) ||
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

    const productIds = normalized.map((item) => item?.productId);

    if (new Set(productIds).size !== productIds.length) {
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
  const firstName = normalizedText(valueFrom(formData, "firstName"));
  const lastName = normalizedText(valueFrom(formData, "lastName"));
  const phone = normalizePhone(valueFrom(formData, "phone"));
  const city = normalizedText(valueFrom(formData, "city"));
  const deliveryMethod = valueFrom(formData, "deliveryMethod");
  const deliveryDetails = normalizedText(valueFrom(formData, "deliveryDetails"));
  const establishmentName = valueFrom(formData, "establishmentName");
  const paymentMethod = valueFrom(formData, "paymentMethod");
  const note = valueFrom(formData, "note");
  const checkoutToken = valueFrom(formData, "checkoutToken");

  if (!items) {
    return errorState("Кошик порожній або містить некоректні дані.");
  }

  const fieldErrors: Partial<Record<CheckoutField, string>> = {};

  if (firstName.length < 2 || firstName.length > 80) {
    fieldErrors.firstName = "Вкажіть ім’я від 2 до 80 символів.";
  }
  if (lastName.length < 2 || lastName.length > 80) {
    fieldErrors.lastName = "Вкажіть прізвище від 2 до 80 символів.";
  }
  if (!phone) {
    fieldErrors.phone = "Вкажіть коректний номер телефону.";
  }
  if (city.length < 2 || city.length > 120) {
    fieldErrors.city = "Вкажіть місто або населений пункт.";
  }
  if (deliveryDetails.length < 2 || deliveryDetails.length > 500) {
    fieldErrors.deliveryDetails = "Вкажіть адресу, відділення або поштомат.";
  }

  if (Object.keys(fieldErrors).length) {
    return errorState("Перевірте виділені поля.", fieldErrors);
  }

  if (
    establishmentName.length > 160 ||
    note.length > 1000 ||
    !UUID_PATTERN.test(checkoutToken) ||
    !isDeliveryMethod(deliveryMethod)
  ) {
    return errorState("Перевірте дані замовлення та повторіть спробу.");
  }

  if (!isPaymentMethod(paymentMethod)) {
    return errorState("Обраний спосіб оплати тимчасово недоступний.");
  }

  if (!phone) {
    return errorState("Вкажіть коректний номер телефону.", {
      phone: "Вкажіть коректний номер телефону.",
    });
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
    p_checkout_token: checkoutToken,
    p_customer_first_name: firstName,
    p_customer_last_name: lastName,
    p_customer_note: note,
    p_customer_phone: phone,
    p_delivery_city: city,
    p_delivery_details: deliveryDetails,
    p_delivery_method: deliveryMethod,
    p_establishment_name: establishmentName,
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
    const errorMessage = error?.message ?? "";

    return errorState(
      error?.code === "54000"
        ? "Забагато замовлень за короткий час. Спробуйте трохи пізніше."
        : error?.code === "42501"
          ? "Сесія завершилася. Увійдіть знову та повторіть замовлення."
          : error?.code === "22023"
            ? "Дані замовлення не пройшли перевірку. Перевірте форму."
            : errorMessage.includes("payment method") ||
                errorMessage.includes("Online card payments")
              ? "Обраний спосіб оплати тимчасово недоступний."
              : errorMessage.includes("unavailable")
                ? "Один із товарів уже недоступний. Оновіть кошик."
                : "Не вдалося створити замовлення. Спробуйте ще раз.",
    );
  }

  if (formData.get("saveAddress") === "on") {
    await supabase.rpc("save_default_checkout_address", {
      p_city: city,
      p_delivery_details: deliveryDetails,
      p_delivery_method: deliveryMethod,
      p_establishment_name: establishmentName,
      p_first_name: firstName,
      p_is_private_person: formData.get("isPrivatePerson") === "on",
      p_last_name: lastName,
      p_phone: phone,
    });

    revalidatePath("/account");
    revalidatePath("/checkout");
  }

  return {
    message: "Замовлення успішно створено.",
    orderId: order.order_id,
    orderNumber: Number(order.order_number),
    status: "success",
  };
}
