import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { CatalogPagination } from "../../../components/storefront/catalog-pagination";
import { CatalogToolbar } from "../../../components/storefront/catalog-toolbar";
import { CategoryCard } from "../../../components/storefront/category-card";
import { CategoryNav } from "../../../components/storefront/category-nav";
import { ProductCard } from "../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogProductPage,
} from "../../../lib/catalog";
import {
  catalogPath,
  catalogReturnPath,
  normalizeAvailableOnly,
  normalizeCatalogPage,
  normalizeCatalogPriceRange,
  normalizeCatalogSearch,
  normalizeCatalogSort,
  type CatalogFilters,
} from "../../../lib/catalog-filters";
import { getSiteUrl } from "../../../lib/env";
import { getWishlistState } from "../../../lib/wishlist";

export const metadata: Metadata = {
  alternates: {
    canonical: `${getSiteUrl()}/catalog`,
  },
  title: "Каталог - DreamShop",
  description:
    "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
};

type CatalogPageProps = {
  searchParams: Promise<{
    available?: string | string[];
    max?: string | string[];
    min?: string | string[];
    page?: string | string[];
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;
  const priceRange = normalizeCatalogPriceRange(params.min, params.max);
  const filters: CatalogFilters = {
    availableOnly: normalizeAvailableOnly(params.available),
    maxPrice: priceRange.maxPrice,
    minPrice: priceRange.minPrice,
    page: normalizeCatalogPage(params.page),
    search: normalizeCatalogSearch(params.q),
    sort: normalizeCatalogSort(params.sort),
  };
  const [categories, productPage, wishlist] = await Promise.all([
    getCatalogCategories(),
    getCatalogProductPage(filters),
    getWishlistState(),
  ]);
  const { pageCount, products, total } = productPage;

  if (filters.page > pageCount) {
    redirect(catalogPath("/catalog", { ...filters, page: 1 }));
  }

  const wishlistIds = new Set(wishlist.productIds);
  const returnPath = catalogReturnPath("/catalog", filters);

  return (
    <main className="store-main">
      <header className="catalog-heading">
        <p>DreamShop</p>
        <h1>Каталог</h1>
        <span>Натуральні смаки для легких перекусів і красивих моментів.</span>
      </header>

      <CategoryNav categories={categories} />
      <CatalogToolbar
        action="/catalog"
        availableOnly={filters.availableOnly}
        maxPrice={filters.maxPrice}
        minPrice={filters.minPrice}
        search={filters.search}
        sort={filters.sort}
      />

      {categories.length ? (
        <section className="catalog-section" aria-labelledby="category-list-title">
          <div className="catalog-section-heading">
            <h2 id="category-list-title">Категорії</h2>
          </div>
          <div className="category-card-grid">
            {categories.map((category, index) => (
              <CategoryCard
                category={category}
                eager={index === 0}
                key={category.id}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="catalog-section" aria-labelledby="product-list-title">
        <div className="catalog-section-heading">
          <h2 id="product-list-title">
            {filters.search ? "Результати пошуку" : "Усі товари"}
          </h2>
          <span>{total}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0}
                key={product.id}
                product={product}
                returnPath={returnPath}
                wishlisted={wishlistIds.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <p>
              {filters.search
                ? `За запитом «${filters.search}» товарів не знайдено з вибраними фільтрами.`
                : "За вибраними фільтрами товарів не знайдено."}
            </p>
            <Link href="/catalog">Скинути фільтри</Link>
          </div>
        )}
        <CatalogPagination
          filters={filters}
          pageCount={pageCount}
          pathname="/catalog"
        />
      </section>
    </main>
  );
}
