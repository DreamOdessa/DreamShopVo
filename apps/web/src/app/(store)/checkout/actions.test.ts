import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("../../../lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { createOrder } from "./actions";

const initialState = { message: "", status: "idle" as const };
const productId = "11111111-1111-4111-8111-111111111111";
const checkoutToken = "22222222-2222-4222-8222-222222222222";

function validFormData() {
  const formData = new FormData();
  formData.set("items", JSON.stringify([{ productId, quantity: 2 }]));
  formData.set("firstName", "Ірина");
  formData.set("lastName", "Тестова");
  formData.set("phone", "+380 67 123 45 67");
  formData.set("city", "Одеса");
  formData.set("deliveryMethod", "post_office");
  formData.set("deliveryDetails", "Відділення 1");
  formData.set("paymentMethod", "card_on_delivery");
  formData.set("checkoutToken", checkoutToken);
  return formData;
}

beforeEach(() => {
  mocks.createClient.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("checkout order action", () => {
  it("rejects malformed cart data before opening a session", async () => {
    const formData = validFormData();
    formData.set("items", "[]");

    await expect(createOrder(initialState, formData)).resolves.toEqual({
      message: "Кошик порожній або містить некоректні дані.",
      status: "error",
    });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("rejects a missing authenticated session", async () => {
    const getClaims = vi.fn().mockResolvedValue({
      data: { claims: null },
      error: null,
    });
    mocks.createClient.mockResolvedValue({ auth: { getClaims } });

    await expect(createOrder(initialState, validFormData())).resolves.toEqual({
      message: "Сесія завершилася. Увійдіть знову та повторіть замовлення.",
      status: "error",
    });
  });

  it("rejects an unconfigured bank transfer before opening a session", async () => {
    const formData = validFormData();
    formData.set("paymentMethod", "bank_transfer");

    await expect(createOrder(initialState, formData)).resolves.toEqual({
      message: "Обраний спосіб оплати тимчасово недоступний.",
      status: "error",
    });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("creates one order through the checkout-token RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          order_id: "33333333-3333-4333-8333-333333333333",
          order_number: 42,
          total: "120.00",
        },
      ],
      error: null,
    });
    mocks.createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "44444444-4444-4444-8444-444444444444" } },
          error: null,
        }),
      },
      rpc,
    });

    await expect(createOrder(initialState, validFormData())).resolves.toEqual({
      message: "Замовлення успішно створено.",
      orderId: "33333333-3333-4333-8333-333333333333",
      orderNumber: 42,
      status: "success",
    });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith("create_order", {
      p_checkout_token: checkoutToken,
      p_contact_for_clarification: false,
      p_customer_first_name: "Ірина",
      p_customer_last_name: "Тестова",
      p_customer_note: "",
      p_customer_phone: "+380671234567",
      p_delivery_city: "Одеса",
      p_delivery_details: "Відділення 1",
      p_delivery_method: "post_office",
      p_establishment_name: "",
      p_is_private_person: false,
      p_items: [{ productId, quantity: 2 }],
      p_payment_method: "card_on_delivery",
    });
  });

  it("maps an unavailable product response without saving an address", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { code: "P0001", message: "Product unavailable" },
    });
    mocks.createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "44444444-4444-4444-8444-444444444444" } },
          error: null,
        }),
      },
      rpc,
    });
    const formData = validFormData();
    formData.set("saveAddress", "on");

    await expect(createOrder(initialState, formData)).resolves.toEqual({
      message: "Один із товарів уже недоступний. Оновіть кошик.",
      status: "error",
    });
    expect(rpc).toHaveBeenCalledTimes(1);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
