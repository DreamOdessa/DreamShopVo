import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import { retryIntegrationEvent } from "./integration-actions";

const initialState = { message: "", status: "idle" as const };

beforeEach(() => {
  mocks.getAdminContext.mockReset();
  mocks.getAdminContext.mockResolvedValue({
    isAdmin: false,
    supabase: null,
    userId: null,
  });
});

describe("admin integration actions", () => {
  it("denies an unauthenticated integration retry", async () => {
    const formData = new FormData();
    formData.set("eventId", "1");

    await expect(retryIntegrationEvent(initialState, formData)).resolves.toEqual({
      message: "Сесія завершилася. Увійдіть повторно.",
      status: "error",
    });
  });
});
