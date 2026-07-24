"use server";

import { revalidatePath } from "next/cache";

import { getAdminContext } from "../../lib/auth/admin";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT_MEDIA_KEY_PATTERN =
  /^products\/\d{4}\/\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:avif|jpg|png|webp)$/i;
const CATEGORY_MEDIA_KEY_PATTERN =
  /^categories\/\d{4}\/\d{2}\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(?:avif|jpg|png|webp)$/i;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const IMAGE_EXTENSIONS = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type BaseMediaInput = {
  altText: string;
  mimeType: string;
  objectKey: string;
  sizeBytes: number;
};

export type ProductImageSlot = 0 | 1 | 2;

export type SaveProductImageInput = BaseMediaInput & {
  productId: string;
  slot: ProductImageSlot;
};

export type SaveCategoryCoverInput = BaseMediaInput & {
  categoryId: string;
};

export type MediaActionResult = {
  key?: string;
  message: string;
  oldKey?: string;
  status: "error" | "success";
};

function mediaError(message: string): MediaActionResult {
  return { message, status: "error" };
}

async function verifiedAdmin() {
  const context = await getAdminContext();

  return context.userId && context.isAdmin ? context : null;
}

function validBaseMediaInput(
  input: BaseMediaInput,
  keyPattern: RegExp,
) {
  const extension = IMAGE_EXTENSIONS[
    input.mimeType as keyof typeof IMAGE_EXTENSIONS
  ];

  return (
    keyPattern.test(input.objectKey) &&
    Boolean(extension) &&
    input.objectKey.toLowerCase().endsWith(`.${extension}`) &&
    Number.isInteger(input.sizeBytes) &&
    input.sizeBytes > 0 &&
    input.sizeBytes <= MAX_IMAGE_BYTES &&
    input.altText.trim().length <= 300
  );
}

export async function saveProductImage(
  input: SaveProductImageInput,
): Promise<MediaActionResult> {
  if (
    !UUID_PATTERN.test(input.productId) ||
    ![0, 1, 2].includes(input.slot) ||
    !validBaseMediaInput(input, PRODUCT_MEDIA_KEY_PATTERN)
  ) {
    return mediaError("Файл має некоректні параметри.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return mediaError("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data: product, error: productError } = await context.supabase
    .from("products")
    .select("id")
    .eq("id", input.productId)
    .maybeSingle();

  if (productError || !product) {
    return mediaError("Товар не знайдено.");
  }

  const kind = input.slot === 0 ? "main" : "gallery";
  const { data: current, error: currentError } = await context.supabase
    .from("product_media")
    .select("id,object_key")
    .eq("product_id", input.productId)
    .eq("sort_order", input.slot)
    .maybeSingle();

  if (currentError) {
    return mediaError("Не вдалося перевірити поточне фото.");
  }

  const values = {
    alt_text: input.altText.trim(),
    kind,
    mime_type: input.mimeType,
    object_key: input.objectKey,
    size_bytes: input.sizeBytes,
    sort_order: input.slot,
  };

  if (current) {
    const { data, error } = await context.supabase
      .from("product_media")
      .update(values)
      .eq("id", current.id)
      .eq("object_key", current.object_key)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return mediaError(
        "Фото товару вже змінилося. Оновіть сторінку та повторіть спробу.",
      );
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/products/${input.productId}`);

    return {
      message: "Фото замінено.",
      oldKey: current.object_key,
      status: "success",
    };
  }

  const { error } = await context.supabase.from("product_media").insert({
    ...values,
    product_id: input.productId,
  });

  if (error) {
    return mediaError(
      error.code === "23505"
        ? "Цей слот фото вже зайнятий. Оновіть сторінку."
        : "Не вдалося прив'язати фото до товару.",
    );
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${input.productId}`);

  return {
    message: "Фото додано.",
    status: "success",
  };
}

export async function removeProductImage(
  productId: string,
  slot: ProductImageSlot,
): Promise<MediaActionResult> {
  if (!UUID_PATTERN.test(productId) || ![0, 1, 2].includes(slot)) {
    return mediaError("Товар або слот фото не знайдено.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return mediaError("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data: current, error: currentError } = await context.supabase
    .from("product_media")
    .select("id,object_key")
    .eq("product_id", productId)
    .eq("sort_order", slot)
    .maybeSingle();

  if (currentError) {
    return mediaError("Не вдалося перевірити поточне фото.");
  }

  if (!current) {
    return mediaError("Фото вже видалено.");
  }

  const { data, error } = await context.supabase
    .from("product_media")
    .delete()
    .eq("id", current.id)
    .eq("object_key", current.object_key)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return mediaError("Фото вже змінилося. Оновіть сторінку.");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/products/${productId}`);

  return {
    key: current.object_key,
    message: "Фото видалено.",
    status: "success",
  };
}

export async function saveCategoryCover(
  input: SaveCategoryCoverInput,
): Promise<MediaActionResult> {
  if (
    !UUID_PATTERN.test(input.categoryId) ||
    !validBaseMediaInput(input, CATEGORY_MEDIA_KEY_PATTERN)
  ) {
    return mediaError("Файл має некоректні параметри.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return mediaError("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data: category, error: categoryError } = await context.supabase
    .from("categories")
    .select("id")
    .eq("id", input.categoryId)
    .maybeSingle();

  if (categoryError || !category) {
    return mediaError("Категорію не знайдено.");
  }

  const { data: current, error: currentError } = await context.supabase
    .from("category_media")
    .select("id,object_key")
    .eq("category_id", input.categoryId)
    .eq("kind", "cover")
    .maybeSingle();

  if (currentError) {
    return mediaError("Не вдалося перевірити обкладинку.");
  }

  const values = {
    alt_text: input.altText.trim(),
    kind: "cover",
    mime_type: input.mimeType,
    object_key: input.objectKey,
    sort_order: 0,
  };

  if (current) {
    const { data, error } = await context.supabase
      .from("category_media")
      .update(values)
      .eq("id", current.id)
      .eq("object_key", current.object_key)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return mediaError(
        "Обкладинка вже змінилася. Оновіть сторінку та повторіть спробу.",
      );
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/categories/${input.categoryId}`);

    return {
      message: "Обкладинку замінено.",
      oldKey: current.object_key,
      status: "success",
    };
  }

  const { error } = await context.supabase.from("category_media").insert({
    ...values,
    category_id: input.categoryId,
  });

  if (error) {
    return mediaError(
      error.code === "23505"
        ? "Обкладинку вже додано. Оновіть сторінку."
        : "Не вдалося прив'язати обкладинку до категорії.",
    );
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/categories/${input.categoryId}`);

  return {
    message: "Обкладинку додано.",
    status: "success",
  };
}

export async function removeCategoryCover(
  categoryId: string,
): Promise<MediaActionResult> {
  if (!UUID_PATTERN.test(categoryId)) {
    return mediaError("Категорію не знайдено.");
  }

  const context = await verifiedAdmin();

  if (!context) {
    return mediaError("Сесія адміністратора недійсна. Увійдіть повторно.");
  }

  const { data: current, error: currentError } = await context.supabase
    .from("category_media")
    .select("id,object_key")
    .eq("category_id", categoryId)
    .eq("kind", "cover")
    .maybeSingle();

  if (currentError) {
    return mediaError("Не вдалося перевірити обкладинку.");
  }

  if (!current) {
    return mediaError("Обкладинку вже видалено.");
  }

  const { data, error } = await context.supabase
    .from("category_media")
    .delete()
    .eq("id", current.id)
    .eq("object_key", current.object_key)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    return mediaError("Обкладинка вже змінилася. Оновіть сторінку.");
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/categories/${categoryId}`);

  return {
    key: current.object_key,
    message: "Обкладинку видалено.",
    status: "success",
  };
}
