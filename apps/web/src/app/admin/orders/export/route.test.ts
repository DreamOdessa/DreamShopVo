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

  it("exports CSV safely for an admin", async () => {
    const result = {
      data: [
        {
          created_at: "2026-08-20T12:00:00.000Z",
          customer_first_name: "=HYPERLINK(\"https://example.test\")",
          customer_last_name: "Клієнт",
          customer_phone: "+380000000000",
          delivery_city: "Одеса",
          delivery_details: "Відділення 1",
          delivery_method: "post_office",
          order_number: 42,
          status: "pending",
          total: 12.5,
          tracking_number: null,
        },
      ],
      error: null,
    };
    const exportQuery = {
      gte: vi.fn().mockResolvedValue(result),
      order: vi.fn(),
      range: vi.fn(),
    };
    exportQuery.order.mockReturnValue(exportQuery);
    exportQuery.range.mockReturnValue(exportQuery);
    const select = vi.fn().mockReturnValue(exportQuery);
    const from = vi.fn().mockReturnValue({ select });

    mocks.getAdminContext.mockResolvedValue({
      isAdmin: true,
      supabase: { from },
      userId: "11111111-1111-4111-8111-111111111111",
    });

    const response = await GET(new Request("https://dreamshop.test/admin/orders/export"));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/csv; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(body).toContain("\"'=HYPERLINK(\"\"https://example.test\"\") Клієнт\"");
    expect(body).toContain("\"12.50\"");
    expect(from).toHaveBeenCalledWith("orders");
  });
});
