"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminContext } from "../../lib/auth/admin";
import { getApiUrl } from "../../lib/env";

import type { AdminActionState } from "./action-state";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type CategoryValues = {
  description: string;
  is_active: boolean;
  name: string;
  show_in_showcase: boolean;
  slug: string;
  sort_order: number;
};

type ProductValues = {
  category_id: string;
  description: string;
  in_stock: boolean;
  is_active: boolean;
  is_popular: boolean;
  name: string;
  organic: boolean;
  original_price: number | null;
  price: number;
  slug: string;
  sort_order: number;
  stock_quantity: number | null;
  weight: string | null;
};

type ValidatedValues<T> =
  | { error: AdminActionState; values?: never }
  | { error?: never; values: T };

function stringValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function normalizedText(formData: FormData, name: string) {
  return stringValue(formData, name).replace(/\s+/g, " ");
}

function checkboxValue(formData: FormData, name: string) {
  return formData.get(name) === "on";
}

function numericValue(value: string) {
  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(",", "."));

  return Number.isFinite(parsed) ? parsed : null;
}

function errorState(message: string): AdminActionState {
  return { message, status: "error" };
}

function databaseErrorState(code?: string): AdminActionState {
  if (code === "23505") {
    return errorState("Запис із такою назвою або slug уже існує.");
  }

  if (code === "23503") {
    return errorState(
      "Запис використовується в каталозі. Спочатку перемістіть або видаліть пов'язані товари.",
    );
  }

  if (code === "42501") {
    return errorState("Недостатньо прав. Увійдіть в адмін-акаунт повторно.");
  }

  return errorState("Не вдалося зберегти дані. Спробуйте ще раз.");
}

async function verifiedAdmin() {
  const context = await getAdminContext();

  return context.userId && context.isAdmin ? context : null;
}

function validateCategory(formData: FormData): ValidatedValues<CategoryValues> {
  const name = normalizedText(formData, "name");
  const slug = stringValue(formData, "slug").toLowerCase();
  const description = stringValue(formData, "description");
  const sortOrder = numericValue(stringValue(formData, "sortOrder"));

  if (name.length < 2 || name.length > 100) {
    return {
      error: errorState("Назва категорії має містити від 2 до 100 символів."),
    };
  }

  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    return {
      error: errorState(
        "Slug має містити лише латинські літери, цифри та дефіси.",
      ),
    };
  }

  if (description.length > 2000) {
    return { error: errorState("Опис категорії занадто довгий.") };
  }

  if (
    sortOrder === null ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 10000
  ) {
    return {
      error: errorState("Порядок має бути цілим числом від 0 до 10000."),
    };
  }

  return {
    values: {
      description,
      is_active: checkboxValue(formData, "isActive"),
      name,
      show_in_showcase: checkboxValue(formData, "showInShowcase"),
      slug,
      sort_order: sortOrder,
    },
  };
}

function validateProduct(formData: FormData): ValidatedValues<ProductValues> {
  const name = normalizedText(formData, "name");
  const slug = stringValue(formData, "slug").toLowerCase();
  const description = stringValue(formData, "description");
  const categoryId = stringValue(formData, "categoryId");
  const price = numericValue(stringValue(formData, "price"));
  const originalPrice = numericValue(stringValue(formData, "originalPrice"));
  const weight = normalizedText(formData, "weight");
  const sortOrder = numericValue(stringValue(formData, "sortOrder"));
  const stockQuantity = numericValue(stringValue(formData, "stockQuantity"));

  if (name.length < 2 || name.length > 160) {
    return {
      error: errorState("Назва товару має містити від 2 до 160 символів."),
    };
  }

  if (!SLUG_PATTERN.test(slug) || slug.length > 180) {
    return {
      error: errorState(
        "Slug має містити лише латинські літери, цифри та дефіси.",
      ),
    };
  }

  if (!UUID_PATTERN.test(categoryId)) {
    return { error: errorState("Оберіть категорію товару.") };
  }

  if (price === null || price < 0 || price > 9999999999.99) {
    return { error: errorState("Вкажіть коректну ціну.") };
  }

  if (
    originalPrice !== null &&
    (originalPrice < price || originalPrice > 9999999999.99)
  ) {
    return {
      error: errorState("Стара ціна не може бути меншою за поточну."),
    };
  }

  if (description.length > 10000 || weight.length > 100) {
    return { error: errorState("Опис або вага товару занадто довгі.") };
  }

  if (
    sortOrder === null ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 10000
  ) {
    return {
      error: errorState("Порядок має бути цілим числом від 0 до 10000."),
    };
  }

  if (
    stockQuantity !== null &&
    (!Number.isInteger(stockQuantity) ||
      stockQuantity < 0 ||
      stockQuantity > 1000000)
  ) {
    return {
      error: errorState(
        "Залишок має бути цілим числом від 0 до 1 000 000.",
      ),
    };
  }

  return {
    values: {
      category_id: categoryId,
      description,
      in_stock: checkboxValue(formData, "inStock"),
      is_active: checkboxValue(formData, "isActive"),
      is_popular: checkboxValue(formData, "isPopular"),
      name,
      organic: checkboxValue(formData, "organic"),
      original_price: originalPrice,
      price,
      slug,
      sort_order: sortOrder,
      stock_quantity: stockQuantity,
      weight: weight || null,
    },
  };
}

function mediaUrl(key: string) {
  const encodedKey = key.split("/").map(encodeURIComponent).join("/");

  return `${getApiUrl()}/admin/media/${encodedKey}`;
}

async function deleteStoredMedia(key: string, accessToken: string) {
  const response = await fetch(mediaUrl(key), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "DELETE",
  });

  return response.ok || response.status === 404;
}

export async function createCategory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const validation = validateCategory(formData);

  if (validation.error) {
    return validation.error;
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { error } = await context.supabase
    .from("categories")
    .insert(validation.values);

  if (error) {
    return databaseErrorState(error.code);
  }

  revalidatePath("/admin");

  return {
    message: "Категорію створено.",
    status: "success",
  };
}

export async function updateCategory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const categoryId = stringValue(formData, "categoryId");
  const validation = validateCategory(formData);

  if (!UUID_PATTERN.test(categoryId)) {
    return errorState("Категорію не знайдено.");
  }

  if (validation.error) {
    return validation.error;
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data, error } = await context.supabase
    .from("categories")
    .update(validation.values)
    .eq("id", categoryId)
    .select("id")
    .maybeSingle();

  if (error) {
    return databaseErrorState(error.code);
  }

  if (!data) {
    return errorState("Категорію не знайдено або вона вже змінена.");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/categories/${categoryId}`);

  return {
    message: "Зміни категорії збережено.",
    status: "success",
  };
}

export async function deleteCategory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const categoryId = stringValue(formData, "categoryId");

  if (!UUID_PATTERN.test(categoryId)) {
    return errorState("Категорію не знайдено.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const [{ data: sessionData }, mediaResult] = await Promise.all([
    context.supabase.auth.getSession(),
    context.supabase
      .from("category_media")
      .select("object_key")
      .eq("category_id", categoryId),
  ]);
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  if (mediaResult.error) {
    return databaseErrorState(mediaResult.error.code);
  }

  const { error } = await context.supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    return databaseErrorState(error.code);
  }

  const cleanupResults = await Promise.allSettled(
    (mediaResult.data ?? []).map(({ object_key }) =>
      deleteStoredMedia(object_key, accessToken),
    ),
  );

  if (
    cleanupResults.some(
      (result) => result.status === "rejected" || !result.value,
    )
  ) {
    console.error("Category media cleanup requires a retry.", { categoryId });
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function createProduct(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const validation = validateProduct(formData);

  if (validation.error) {
    return validation.error;
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { error } = await context.supabase
    .from("products")
    .insert(validation.values);

  if (error) {
    return databaseErrorState(error.code);
  }

  revalidatePath("/admin");

  return {
    message: "Товар створено без фотографій.",
    status: "success",
  };
}

export async function updateProduct(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const productId = stringValue(formData, "productId");
  const validation = validateProduct(formData);

  if (!UUID_PATTERN.test(productId)) {
    return errorState("Товар не знайдено.");
  }

  if (validation.error) {
    return validation.error;
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data, error } = await context.supabase
    .from("products")
    .update(validation.values)
    .eq("id", productId)
    .select("id")
    .maybeSingle();

  if (error) {
    return databaseErrorState(error.code);
  }

  if (!data) {
    return errorState("Товар не знайдено або він уже змінений.");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${productId}`);

  return {
    message: "Зміни товару збережено.",
    status: "success",
  };
}

export async function deleteProduct(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const productId = stringValue(formData, "productId");

  if (!UUID_PATTERN.test(productId)) {
    return errorState("Товар не знайдено.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const [{ data: sessionData }, mediaResult] = await Promise.all([
    context.supabase.auth.getSession(),
    context.supabase
      .from("product_media")
      .select("object_key")
      .eq("product_id", productId),
  ]);
  const accessToken = sessionData.session?.access_token;

  if (!accessToken) {
    return errorState("Сесія адміністратора завершилася. Увійдіть повторно.");
  }

  if (mediaResult.error) {
    return databaseErrorState(mediaResult.error.code);
  }

  const { error } = await context.supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return databaseErrorState(error.code);
  }

  const cleanupResults = await Promise.allSettled(
    (mediaResult.data ?? []).map(({ object_key }) =>
      deleteStoredMedia(object_key, accessToken),
    ),
  );

  if (
    cleanupResults.some(
      (result) => result.status === "rejected" || !result.value,
    )
  ) {
    console.error("Product media cleanup requires a retry.", { productId });
  }

  revalidatePath("/admin");
  redirect("/admin");
}
