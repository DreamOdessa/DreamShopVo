import { cache } from "react";
import { unstable_cache } from "next/cache";

import { CATALOG_CACHE_TAG } from "./catalog-cache";
import type { CatalogFilters, CatalogSort } from "./catalog-filters";
import { createPublicClient } from "./supabase/public";

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

const getCachedCatalogCategories = unstable_cache(async () => {
  const supabase = createPublicClient();
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

  return (data ?? []).map(mapCategory);
}, ["catalog-categories"], { revalidate: 300, tags: [CATALOG_CACHE_TAG] });

export const getCatalogCategories = cache(getCachedCatalogCategories);

const getCachedCatalogCategory = unstable_cache(async (slug: string) => {
  const supabase = createPublicClient();
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

  return data ? mapCategory(data) : null;
}, ["catalog-category"], { revalidate: 300, tags: [CATALOG_CACHE_TAG] });

export const getCatalogCategory = cache(getCachedCatalogCategory);

function escapedSearchPattern(value: string) {
  return `%${value.replace(/[\\%_]/g, "\\$&")}%`;
}

const catalogProductSelection =
  "id,name,slug,description,price,original_price,weight,in_stock,stock_quantity,organic,category:categories!products_category_id_fkey(id,name,slug,is_active),media:product_media(object_key,alt_text,sort_order)";
const catalogProductPageSelection =
  "id,name,slug,description,price,original_price,weight,in_stock,stock_quantity,organic,category:categories!products_category_id_fkey!inner(id,name,slug,is_active),media:product_media(object_key,alt_text,sort_order)";

function sortedProductQuery<T>(query: T, sort: CatalogSort) {
  const sortable = query as T & {
    order: (
      column: string,
      options?: { ascending?: boolean },
    ) => T;
  };

  sortable.order("in_stock", { ascending: false });

  if (sort === "newest") {
    sortable.order("created_at", { ascending: false });
    sortable.order("sort_order");
  } else if (sort === "price-asc") {
    sortable.order("price");
    sortable.order("name");
  } else if (sort === "price-desc") {
    sortable.order("price", { ascending: false });
    sortable.order("name");
  } else {
    sortable.order("sort_order");
    sortable.order("created_at", { ascending: false });
  }

  return sortable;
}

export type StorefrontHomeCatalog = {
  popularProducts: CatalogProduct[];
  showcaseCategories: Array<{
    category: CatalogCategory;
    products: CatalogProduct[];
  }>;
};

const getCachedStorefrontHomeCatalog = unstable_cache(async () => {
  const supabase = createPublicClient();
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select(
      "id,name,slug,description,media:category_media(object_key,alt_text,kind)",
    )
    .eq("is_active", true)
    .eq("show_in_showcase", true)
    .order("sort_order")
    .order("name")
    .limit(6);

  if (categoryError) {
    throw new Error("Unable to load storefront showcase categories.");
  }

  const categories = (categoryData ?? []).map(mapCategory);
  const categoryProductResults = await Promise.all(
    categories.map(async (category) => {
      let query = supabase
        .from("products")
        .select(catalogProductPageSelection)
        .eq("category_id", category.id)
        .eq("is_active", true)
        .eq("category.is_active", true)
        .limit(4);

      query = sortedProductQuery(query, "featured");
      const { data, error } = await query;

      if (error) {
        throw new Error("Unable to load storefront showcase products.");
      }

      return {
        category,
        products: (data ?? [])
          .map(mapProduct)
          .filter((product): product is CatalogProduct => Boolean(product)),
      };
    }),
  );

  let popularQuery = supabase
    .from("products")
    .select(catalogProductPageSelection)
    .eq("is_active", true)
    .eq("is_popular", true)
    .eq("category.is_active", true)
    .limit(8);

  popularQuery = sortedProductQuery(popularQuery, "featured");
  const { data: popularData, error: popularError } = await popularQuery;

  if (popularError) {
    throw new Error("Unable to load popular storefront products.");
  }

  return {
    popularProducts: (popularData ?? [])
      .map(mapProduct)
      .filter((product): product is CatalogProduct => Boolean(product)),
    showcaseCategories: categoryProductResults.filter(
      ({ products }) => products.length > 0,
    ),
  } satisfies StorefrontHomeCatalog;
}, ["storefront-home-catalog"], {
  revalidate: 300,
  tags: [CATALOG_CACHE_TAG],
});

export const getStorefrontHomeCatalog = cache(getCachedStorefrontHomeCatalog);

const getCachedCatalogProducts = unstable_cache(async (
  categoryId?: string,
  search = "",
  sort: CatalogSort = "featured",
) => {
  const supabase = createPublicClient();
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

  query = sortedProductQuery(query, sort);

  const { data, error } = await query;

  if (error) {
    throw new Error("Unable to load catalog products.");
  }

  return (data ?? [])
    .map(mapProduct)
    .filter((product): product is CatalogProduct => Boolean(product));
}, ["catalog-products"], { revalidate: 300, tags: [CATALOG_CACHE_TAG] });

export const getCatalogProducts = cache(getCachedCatalogProducts);

const getCachedSitemapCatalogProducts = unstable_cache(async () => {
  const supabase = createPublicClient();
  const pageSize = 1_000;
  const products: CatalogProduct[] = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select(catalogProductPageSelection)
      .eq("is_active", true)
      .eq("category.is_active", true)
      .order("id")
      .range(rangeStart, rangeStart + pageSize - 1);

    if (error) {
      throw new Error("Unable to load sitemap catalog products.");
    }

    const page = (data ?? [])
      .map(mapProduct)
      .filter((product): product is CatalogProduct => Boolean(product));
    products.push(...page);

    if ((data ?? []).length < pageSize) break;
    rangeStart += pageSize;
  }

  return products;
}, ["catalog-sitemap-products"], { revalidate: 300, tags: [CATALOG_CACHE_TAG] });

export const getSitemapCatalogProducts = cache(getCachedSitemapCatalogProducts);

export const getCatalogProductsByIds = cache(async (productIds: string[]) => {
  if (!productIds.length) {
    return [];
  }

  const uniqueProductIds = [...new Set(productIds)].slice(0, 120);
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(catalogProductPageSelection)
    .in("id", uniqueProductIds)
    .eq("is_active", true)
    .eq("category.is_active", true);

  if (error) {
    throw new Error("Unable to load selected catalog products.");
  }

  const products = (data ?? [])
    .map(mapProduct)
    .filter((product): product is CatalogProduct => Boolean(product));
  const productById = new Map(products.map((product) => [product.id, product]));

  return uniqueProductIds.flatMap((id) => {
    const product = productById.get(id);
    return product ? [product] : [];
  });
});

const getCachedRelatedCatalogProducts = unstable_cache(
  async (categoryId: string, excludedProductId: string, limit = 4) => {
    const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 12);
    const supabase = createPublicClient();
    let query = supabase
      .from("products")
      .select(catalogProductPageSelection)
      .eq("category_id", categoryId)
      .neq("id", excludedProductId)
      .eq("is_active", true)
      .eq("category.is_active", true)
      .limit(safeLimit);

    query = sortedProductQuery(query, "featured");

    const { data, error } = await query;

    if (error) {
      throw new Error("Unable to load related catalog products.");
    }

    return (data ?? [])
      .map(mapProduct)
      .filter((product): product is CatalogProduct => Boolean(product));
  },
  ["catalog-related-products"],
  { revalidate: 300, tags: [CATALOG_CACHE_TAG] },
);

export const getRelatedCatalogProducts = cache(getCachedRelatedCatalogProducts);

type CatalogProductPageInput = CatalogFilters & {
  categoryId?: string;
  pageSize?: number;
};

const getCachedCatalogProductPage = unstable_cache(
  async ({
    availableOnly,
    categoryId,
    maxPrice,
    minPrice,
    page,
    pageSize = 24,
    search,
    sort,
  }: CatalogProductPageInput) => {
    const supabase = createPublicClient();
    const rangeStart = (page - 1) * pageSize;
    let query = supabase
      .from("products")
      .select(catalogProductPageSelection, { count: "exact" })
      .eq("is_active", true)
      .eq("category.is_active", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (search) {
      const pattern = escapedSearchPattern(search);
      query = query.or(`name.ilike.${pattern},description.ilike.${pattern}`);
    }

    if (availableOnly) {
      query = query
        .eq("in_stock", true)
        .or("stock_quantity.is.null,stock_quantity.gt.0");
    }

    if (minPrice !== null) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== null) {
      query = query.lte("price", maxPrice);
    }

    query = sortedProductQuery(query, sort).range(
      rangeStart,
      rangeStart + pageSize - 1,
    );

    const { count, data, error } = await query;

    if (error) {
      throw new Error("Unable to load catalog product page.");
    }

    const products = (data ?? [])
      .map(mapProduct)
      .filter((product): product is CatalogProduct => Boolean(product));
    const total = count ?? 0;

    return {
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
      products,
      total,
    };
  },
  ["catalog-product-page"],
  { revalidate: 300, tags: [CATALOG_CACHE_TAG] },
);

export const getCatalogProductPage = cache(getCachedCatalogProductPage);

const getCachedCatalogProduct = unstable_cache(async (slug: string) => {
    const supabase = createPublicClient();
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

  return data ? mapProduct(data) : null;
}, ["catalog-product"], { revalidate: 300, tags: [CATALOG_CACHE_TAG] });

export const getCatalogProduct = cache(getCachedCatalogProduct);

const getCachedCatalogProductByLegacyId = unstable_cache(async (legacyId: string) => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(catalogProductPageSelection)
    .eq("legacy_id", legacyId)
    .eq("is_active", true)
    .eq("category.is_active", true)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the legacy catalog product.");
  }

  return data ? mapProduct(data) : null;
}, ["catalog-product-by-legacy-id"], {
  revalidate: 300,
  tags: [CATALOG_CACHE_TAG],
});

export const getCatalogProductByLegacyId = cache(getCachedCatalogProductByLegacyId);
