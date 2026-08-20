import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getAdminContext: vi.fn(),
}));

vi.mock("../../lib/auth/admin", () => ({
  getAdminContext: mocks.getAdminContext,
}));

import {
  createCategory,
  createProduct,
  deleteProduct,
  updateProductStock,
} from "./actions";

const initialState = { message: "", status: "idle" as const };
const productId = "11111111-1111-4111-8111-111111111111";

function productFormData() {
  const formData = new FormData();

  formData.set("name", "Тестовий товар");
  formData.set("slug", "test-product");
  formData.set("categoryId", productId);
  formData.set("price", "100");
  formData.set("sortOrder", "0");

  return formData;
}

beforeEach(() => {
  mocks.getAdminContext.mockReset();
  mocks.getAdminContext.mockResolvedValue({
    isAdmin: false,
    supabase: null,
    userId: null,
  });
});

describe("admin catalog actions", () => {
  it("denies an unauthenticated category creation", async () => {
    const formData = new FormData();
    formData.set("name", "Тестова категорія");
    formData.set("slug", "test-category");
    formData.set("sortOrder", "0");

    await expect(createCategory(initialState, formData)).resolves.toEqual({
      message: "Сесія адміністратора недійсна. Увійдіть повторно.",
      status: "error",
    });
  });

  it("denies an unauthenticated product creation", async () => {
    await expect(createProduct(initialState, productFormData())).resolves.toEqual({
      message: "Сесія адміністратора недійсна. Увійдіть повторно.",
      status: "error",
    });
  });

  it("denies an unauthenticated inventory change", async () => {
    const formData = new FormData();
    formData.set("productId", productId);
    formData.set("expectedStock", "3");
    formData.set("stockQuantity", "4");

    await expect(updateProductStock(initialState, formData)).resolves.toEqual({
      message: "Сесія адміністратора недійсна. Увійдіть повторно.",
      status: "error",
    });
  });

  it("denies an unauthenticated product deletion", async () => {
    const formData = new FormData();
    formData.set("productId", productId);

    await expect(deleteProduct(initialState, formData)).resolves.toEqual({
      message: "Сесія адміністратора недійсна. Увійдіть повторно.",
      status: "error",
    });
  });
});
