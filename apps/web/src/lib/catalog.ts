import { cache } from "react";

import type { CatalogSort } from "./catalog-filters";
import { createClient } from "./supabase/server";

export type CatalogMedia = {
  altText: string;
  objectKey: string;
  sortOrder: number;
};

export type CatalogCategory = {
  cover: CatalogMedia | null;
  description: string;
  id: string;
  name: string;
  slug: string;
};

export type CatalogProduct = {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  description: string;
  id: string;
  images: CatalogMedia[];
  inStock: boolean;
  name: string;
  organic: boolean;
  originalPrice: number | null;
  price: number;
  slug: string;
  stockQuantity: number | null;
  weight: string | null;
};

type CategoryRow = {
  description: string;
  id: string;
  media: Array<{
    alt_text: string;
    kind: string;
    object_key: string;
  }> | null;
  name: string;
  slug: string;
};

type ProductRow = {
  category: {
    id: string;
    is_active: boolean;
    name: string;
    slug: string;
  } | null;
  description: string;
  id: string;
  in_stock: boolean;
  media: Array<{
    alt_text: string;
    object_key: string;
    sort_order: number;
  }> | null;
  name: string;
  organic: boolean;
  original_price: number | null;
  price: number;
  slug: string;
  stock_quantity: number | null;
  weight: string | null;
};

function mapMedia(
  media: ProductRow["media"],
): CatalogMedia[] {
  return (media ?? [])
    .filter(({ sort_order }) => sort_order >= 0 && sort_order <= 2)
    .sort((first, second) => first.sort_order - second.sort_order)
    .map((image) => ({
      altText: image.alt_text,
      objectKey: image.object_key,
      sortOrder: image.sort_order,
    }));
}

function mapProduct(row: ProductRow): CatalogProduct | null {
  if (!row.category?.is_active) {
    return null;
  }

  return {
    category: {
      id: row.category.id,
      name: row.category.name,
      slug: row.category.slug,
    },
    description: row.description,
    id: row.id,
    images: mapMedia(row.media),
    inStock: row.in_stock && row.stock_quantity !== 0,
    name: row.name,
    organic: row.organic,
    originalPrice: row.original_price,
    price: row.price,
    slug: row.slug,
    stockQuantity: row.stock_quantity,
    weight: row.weight,
  };
}

function mapCategory(row: CategoryRow): CatalogCategory {
  const cover = row.media?.find(({ kind }) => kind === "cover");

  return {
    cover: cover
      ? {
          altText: cover.alt_text,
          objectKey: cover.object_key,
          sortOrder: 0,
        }
      : null,
    description: row.description,
    id: row.id,
    name: row.name,
    slug: row.slug,
  };
}

export const getCatalogCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id,name,slug,description,media:category_media(object_key,alt_text,kind)",
    )
    .eq("is_active", true)
    .order("sort_order")
    .order("name");

  if (error) {
    throw new Error("Unable to load catalog categories.");
  }

  return ((data ?? []) as unknown as CategoryRow[]).map(mapCategory);
});

export const getCatalogCategory = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(
      "id,name,slug,description,media:category_media(object_key,alt_text,kind)",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the catalog category.");
  }

  return data ? mapCategory(data as unknown as CategoryRow) : null;
});

function escapedSearchPattern(value: string) {
  return `%${value.replace(/[\\%_]/g, "\\$&")}%`;
}

export const getCatalogProducts = cache(async (
  categoryId?: string,
  search = "",
  sort: CatalogSort = "featured",
) => {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id,name,slug,description,price,original_price,weight,in_stock,stock_quantity,organic,category:categories!products_category_id_fkey(id,name,slug,is_active),media:product_media(object_key,alt_text,sort_order)",
    )
    .eq("is_active", true)
    .limit(120);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (search) {
    query = query.ilike("name", escapedSearchPattern(search));
  }

  query = query.order("in_stock", { ascending: false });

  if (sort === "newest") {
    query = query
      .order("created_at", { ascending: false })
      .order("sort_order");
  } else if (sort === "price-asc") {
    query = query.order("price").order("name");
  } else if (sort === "price-desc") {
    query = query
      .order("price", { ascending: false })
      .order("name");
  } else {
    query = query
      .order("sort_order")
      .order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load catalog products.");
  }

  return ((data ?? []) as unknown as ProductRow[])
    .map(mapProduct)
    .filter((product): product is CatalogProduct => Boolean(product));
});

export const getCatalogProduct = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,description,price,original_price,weight,in_stock,stock_quantity,organic,category:categories!products_category_id_fkey(id,name,slug,is_active),media:product_media(object_key,alt_text,sort_order)",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the catalog product.");
  }

  return data ? mapProduct(data as unknown as ProductRow) : null;
});
