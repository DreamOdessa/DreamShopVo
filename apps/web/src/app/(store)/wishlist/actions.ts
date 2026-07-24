"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "../../../lib/supabase/server";

function formValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function safeReturnPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//")
    ? value
    : "/catalog";
}

export async function toggleWishlistItem(formData: FormData) {
  const productId = formValue(formData, "productId");
  const returnPath = safeReturnPath(formValue(formData, "returnPath"));
  const remove = formValue(formData, "wishlisted") === "true";

  if (!isUuid(productId)) {
    return;
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect(
      `/auth?next=${encodeURIComponent(returnPath)}`,
    );
  }

  const result = remove
    ? await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId)
    : await supabase.from("wishlist_items").upsert(
        {
          product_id: productId,
          user_id: userId,
        },
        {
          ignoreDuplicates: true,
          onConflict: "user_id,product_id",
        },
      );

  if (result.error) {
    throw new Error("Unable to update the wishlist.");
  }

  revalidatePath(returnPath);
  revalidatePath("/wishlist");
}
