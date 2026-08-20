"use server";

import type { CartProduct } from "../../../lib/cart";
import { createClient } from "../../../lib/supabase/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CartRefreshResult =
  | { products: CartProduct[]; status: "success" }
  | { products: []; status: "error" };

export async function refreshCartProducts(
  productIds: string[],
): Promise<CartRefreshResult> {
  const ids = Array.from(new Set(productIds))
    .filter((id) => UUID_PATTERN.test(id))
    .slice(0, 50);

  if (!ids.length) {
    return { products: [], status: "success" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,price,in_stock,stock_quantity,category:categories!products_category_id_fkey!inner(is_active),media:product_media(object_key,sort_order)",
    )
    .eq("is_active", true)
    .eq("category.is_active", true)
    .in("id", ids);

  if (error) {
    return { products: [], status: "error" };
  }

  const products = (data ?? []).map((product) => {
    const mainImage = product.media?.find(
      ({ sort_order }) => sort_order === 0,
    );
    const inStock = product.in_stock && product.stock_quantity !== 0;

    return {
      id: product.id,
      imageObjectKey: mainImage?.object_key ?? null,
      inStock,
      name: product.name,
      price: product.price,
      slug: product.slug,
      stockQuantity: product.stock_quantity,
    };
  });

  return { products, status: "success" };
}
