import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("../../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

import { updateOrderStatus, updateOrderTracking } from "./actions";

const initialState = { message: "", status: "idle" as const };
const orderId = "11111111-1111-4111-8111-111111111111";
const denial = {
  message: "Сесія адміністратора завершилася. Увійдіть повторно.",
  status: "error",
};

beforeEach(() => {
  mocks.getAdminContext.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.getAdminContext.mockResolvedValue({
    isAdmin: false,
    supabase: null,
    userId: null,
  });
});

describe("admin order actions", () => {
  it("denies an unauthenticated status transition", async () => {
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("currentStatus", "pending");
    formData.set("status", "processing");

    await expect(updateOrderStatus(initialState, formData)).resolves.toEqual(denial);
  });

  it("denies an unauthenticated tracking update", async () => {
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("trackingNumber", "20400000000000");

    await expect(updateOrderTracking(initialState, formData)).resolves.toEqual(denial);
  });

  it("reports a stale order status transition", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const select = vi.fn().mockReturnValue({ maybeSingle });
    const secondEq = vi.fn().mockReturnValue({ select });
    const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
    const update = vi.fn().mockReturnValue({ eq: firstEq });
    const from = vi.fn().mockReturnValue({ update });
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: true,
      supabase: { from },
      userId: orderId,
    });
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("currentStatus", "pending");
    formData.set("status", "processing");

    await expect(updateOrderStatus(initialState, formData)).resolves.toEqual({
      message: "Статус уже змінився в іншій вкладці. Оновіть сторінку.",
      status: "error",
    });
    expect(firstEq).toHaveBeenCalledWith("id", orderId);
    expect(secondEq).toHaveBeenCalledWith("status", "pending");
  });

  it("returns success before client-side order-page refresh", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { id: orderId },
      error: null,
    });
    const select = vi.fn().mockReturnValue({ maybeSingle });
    const secondEq = vi.fn().mockReturnValue({ select });
    const firstEq = vi.fn().mockReturnValue({ eq: secondEq });
    const update = vi.fn().mockReturnValue({ eq: firstEq });
    const from = vi.fn().mockReturnValue({ update });
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: true,
      supabase: { from },
      userId: orderId,
    });
    const formData = new FormData();
    formData.set("orderId", orderId);
    formData.set("currentStatus", "shipped");
    formData.set("status", "delivered");

    await expect(updateOrderStatus(initialState, formData)).resolves.toEqual({
      message: "Статус замовлення оновлено.",
      status: "success",
    });
    expect(select).toHaveBeenCalledWith("id");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
