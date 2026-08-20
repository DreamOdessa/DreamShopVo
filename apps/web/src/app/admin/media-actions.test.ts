import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import { saveProductImage } from "./media-actions";

beforeEach(() => {
  mocks.getAdminContext.mockReset();
  mocks.getAdminContext.mockResolvedValue({
    isAdmin: false,
    supabase: null,
    userId: null,
  });
});

describe("admin media actions", () => {
  it("denies a valid-looking product media request without an admin session", async () => {
    await expect(
      saveProductImage({
        altText: "Тестове фото",
        mimeType: "image/jpeg",
        objectKey:
          "products/2026/08/11111111-1111-4111-8111-111111111111.jpg",
        productId: "11111111-1111-4111-8111-111111111111",
        sizeBytes: 1024,
        slot: 0,
      }),
    ).resolves.toEqual({
      message: "Сесія адміністратора недійсна. Увійдіть повторно.",
      status: "error",
    });
  });
});
