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

  it("reports an already-processed integration event without retrying it", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: false, error: null });
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: true,
      supabase: { rpc },
      userId: "11111111-1111-4111-8111-111111111111",
    });
    const formData = new FormData();
    formData.set("eventId", "1");

    await expect(retryIntegrationEvent(initialState, formData)).resolves.toEqual({
      message: "Подію вже оброблено або повтор уже запущено.",
      status: "error",
    });
    expect(rpc).toHaveBeenCalledWith("retry_admin_integration_event", {
      p_event_id: 1,
    });
  });
});
