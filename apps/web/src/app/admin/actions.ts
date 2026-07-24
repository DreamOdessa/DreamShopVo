"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../lib/auth/admin";

import type { AdminActionState } from "./action-state";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

  if (code === "42501") {
    return errorState("Недостатньо прав. Увійдіть в адмін-акаунт повторно.");
  }

  return errorState("Не вдалося зберегти дані. Спробуйте ще раз.");
}

async function adminClient() {
  const context = await getAdminContext();

  return context.userId && context.isAdmin ? context.supabase : null;
}

export async function createCategory(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const name = normalizedText(formData, "name");
  const slug = stringValue(formData, "slug").toLowerCase();
  const description = stringValue(formData, "description");
  const sortOrder = numericValue(stringValue(formData, "sortOrder"));

  if (name.length < 2 || name.length > 100) {
    return errorState("Назва категорії має містити від 2 до 100 символів.");
  }

  if (!SLUG_PATTERN.test(slug) || slug.length > 120) {
    return errorState("Slug має містити лише латинські літери, цифри та дефіси.");
  }

  if (description.length > 2000) {
    return errorState("Опис категорії занадто довгий.");
  }

  if (
    sortOrder === null ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 10000
  ) {
    return errorState("Порядок має бути цілим числом від 0 до 10000.");
  }

  const supabase = await adminClient();

  if (!supabase) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { error } = await supabase.from("categories").insert({
    description,
    is_active: checkboxValue(formData, "isActive"),
    name,
    show_in_showcase: checkboxValue(formData, "showInShowcase"),
    slug,
    sort_order: sortOrder,
  });

  if (error) {
    return databaseErrorState(error.code);
  }

  revalidatePath("/admin");

  return {
    message: "Категорію створено.",
    status: "success",
  };
}

export async function createProduct(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const name = normalizedText(formData, "name");
  const slug = stringValue(formData, "slug").toLowerCase();
  const description = stringValue(formData, "description");
  const categoryId = stringValue(formData, "categoryId");
  const price = numericValue(stringValue(formData, "price"));
  const originalPrice = numericValue(stringValue(formData, "originalPrice"));
  const weight = normalizedText(formData, "weight");
  const sortOrder = numericValue(stringValue(formData, "sortOrder"));

  if (name.length < 2 || name.length > 160) {
    return errorState("Назва товару має містити від 2 до 160 символів.");
  }

  if (!SLUG_PATTERN.test(slug) || slug.length > 180) {
    return errorState("Slug має містити лише латинські літери, цифри та дефіси.");
  }

  if (!UUID_PATTERN.test(categoryId)) {
    return errorState("Оберіть категорію товару.");
  }

  if (price === null || price < 0 || price > 9999999999.99) {
    return errorState("Вкажіть коректну ціну.");
  }

  if (
    originalPrice !== null &&
    (originalPrice < price || originalPrice > 9999999999.99)
  ) {
    return errorState("Стара ціна не може бути меншою за поточну.");
  }

  if (description.length > 10000 || weight.length > 100) {
    return errorState("Опис або вага товару занадто довгі.");
  }

  if (
    sortOrder === null ||
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder > 10000
  ) {
    return errorState("Порядок має бути цілим числом від 0 до 10000.");
  }

  const supabase = await adminClient();

  if (!supabase) {
    return errorState("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { error } = await supabase.from("products").insert({
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
    weight: weight || null,
  });

  if (error) {
    return databaseErrorState(error.code);
  }

  revalidatePath("/admin");

  return {
    message: "Товар створено без фотографій.",
    status: "success",
  };
}
