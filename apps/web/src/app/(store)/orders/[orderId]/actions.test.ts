import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("../../../../lib/supabase/server", () => ({
  createClient: mocks.createClient,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { cancelOrder } from "./actions";

const initialState = { message: "", status: "idle" as const };
const orderId = "11111111-1111-4111-8111-111111111111";

function orderFormData() {
  const formData = new FormData();
  formData.set("orderId", orderId);
  return formData;
}

beforeEach(() => {
  mocks.createClient.mockReset();
  mocks.revalidatePath.mockReset();
});

describe("customer order cancellation action", () => {
  it("rejects malformed order identifiers before opening a session", async () => {
    const formData = new FormData();
    formData.set("orderId", "not-an-order");

    await expect(cancelOrder(initialState, formData)).resolves.toEqual({
      message: "Замовлення не знайдено.",
      status: "error",
    });
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("does not expose another customer's order on a permission denial", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { code: "42501" },
    });
    mocks.createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "22222222-2222-4222-8222-222222222222" } },
          error: null,
        }),
      },
      rpc,
    });

    await expect(cancelOrder(initialState, orderFormData())).resolves.toEqual({
      message: "Замовлення не знайдено або немає права на його скасування.",
      status: "error",
    });
    expect(rpc).toHaveBeenCalledWith("cancel_own_order", { p_order_id: orderId });
  });

  it("returns success after the owned-order cancellation RPC", async () => {
    const customerId = "22222222-2222-4222-8222-222222222222";
    const rpc = vi.fn().mockResolvedValue({ data: [{ id: orderId }], error: null });
    mocks.createClient.mockResolvedValue({
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: customerId } },
          error: null,
        }),
      },
      rpc,
    });

    await expect(cancelOrder(initialState, orderFormData())).resolves.toEqual({
      message: "Замовлення скасовано.",
      status: "success",
    });
    expect(rpc).toHaveBeenCalledWith("cancel_own_order", { p_order_id: orderId });
    expect(mocks.revalidatePath).toHaveBeenCalledWith(`/orders/${orderId}`);
    expect(mocks.revalidatePath).toHaveBeenCalledWith(
      `/admin/customers/${customerId}`,
    );
  });
});
