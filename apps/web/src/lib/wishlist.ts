import { cache } from "react";

import { createClient } from "./supabase/server";

export type WishlistState = {
  authenticated: boolean;
  productIds: string[];
};

export const getWishlistState = cache(async (): Promise<WishlistState> => {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    return {
      authenticated: false,
      productIds: [],
    };
  }

  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id,product:products!inner(is_active)")
    .eq("user_id", userId)
    .eq("product.is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Unable to load the wishlist.");
  }

  return {
    authenticated: true,
    productIds: (data ?? []).map(({ product_id }) => product_id),
  };
});
