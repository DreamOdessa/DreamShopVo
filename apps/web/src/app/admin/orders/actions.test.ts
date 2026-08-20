import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
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
});
