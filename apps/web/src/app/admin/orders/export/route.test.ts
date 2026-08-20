import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import { GET } from "./route";

beforeEach(() => {
  mocks.getAdminContext.mockReset();
});

describe("admin order export route", () => {
  it("redirects unauthenticated requests to sign in", async () => {
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: false,
      supabase: null,
      userId: null,
    });

    const response = await GET(new Request("https://dreamshop.test/admin/orders/export"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://dreamshop.test/auth");
  });

  it("returns 403 to authenticated users without the admin role", async () => {
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: false,
      supabase: null,
      userId: "11111111-1111-4111-8111-111111111111",
    });

    const response = await GET(new Request("https://dreamshop.test/admin/orders/export"));

    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    expect(response.status).toBe(403);
  });
});
