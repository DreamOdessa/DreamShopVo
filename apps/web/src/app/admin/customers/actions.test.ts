import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import { updateCustomerDiscount } from "./actions";

const initialState = { message: "", status: "idle" as const };

beforeEach(() => {
  mocks.getAdminContext.mockReset();
  mocks.getAdminContext.mockResolvedValue({
    isAdmin: false,
    supabase: null,
    userId: null,
  });
});

describe("admin customer actions", () => {
  it("denies an unauthenticated discount update", async () => {
    const formData = new FormData();
    formData.set("customerId", "11111111-1111-4111-8111-111111111111");
    formData.set("discount", "12.5");

    await expect(updateCustomerDiscount(initialState, formData)).resolves.toEqual({
      message: "Сесія адміністратора завершилася. Увійдіть повторно.",
      status: "error",
    });
  });
});
