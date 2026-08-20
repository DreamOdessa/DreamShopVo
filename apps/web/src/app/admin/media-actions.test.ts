import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import { removeProductImage, saveProductImage } from "./media-actions";

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

  it("reports a stale media deletion without removing a replacement", async () => {
    const productId = "11111111-1111-4111-8111-111111111111";
    const currentMedia = {
      id: "22222222-2222-4222-8222-222222222222",
      object_key: "products/2026/08/11111111-1111-4111-8111-111111111111.jpg",
    };
    const deleteMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const deleteSelect = vi.fn().mockReturnValue({ maybeSingle: deleteMaybeSingle });
    const deleteSecondEq = vi.fn().mockReturnValue({ select: deleteSelect });
    const deleteFirstEq = vi.fn().mockReturnValue({ eq: deleteSecondEq });
    const remove = vi.fn().mockReturnValue({ eq: deleteFirstEq });
    const lookupMaybeSingle = vi.fn().mockResolvedValue({
      data: currentMedia,
      error: null,
    });
    const lookupSecondEq = vi.fn().mockReturnValue({ maybeSingle: lookupMaybeSingle });
    const lookupFirstEq = vi.fn().mockReturnValue({ eq: lookupSecondEq });
    const select = vi.fn().mockReturnValue({ eq: lookupFirstEq });
    const from = vi
      .fn()
      .mockReturnValueOnce({ select })
      .mockReturnValueOnce({ delete: remove });
    mocks.getAdminContext.mockResolvedValue({
      isAdmin: true,
      supabase: { from },
      userId: productId,
    });

    await expect(removeProductImage(productId, 0)).resolves.toEqual({
      message: "Фото вже змінилося. Оновіть сторінку.",
      status: "error",
    });
    expect(deleteFirstEq).toHaveBeenCalledWith("id", currentMedia.id);
    expect(deleteSecondEq).toHaveBeenCalledWith(
      "object_key",
      currentMedia.object_key,
    );
  });
});
