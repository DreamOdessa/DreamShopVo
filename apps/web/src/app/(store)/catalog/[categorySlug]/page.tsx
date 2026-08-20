import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CatalogPagination } from "../../../../components/storefront/catalog-pagination";
import { CatalogToolbar } from "../../../../components/storefront/catalog-toolbar";
import { CategoryNav } from "../../../../components/storefront/category-nav";
import { ProductCard } from "../../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogProductPage,
} from "../../../../lib/catalog";
import {
  catalogPath,
  catalogReturnPath,
  normalizeAvailableOnly,
  normalizeCatalogPage,
  normalizeCatalogPriceRange,
  normalizeCatalogSearch,
  normalizeCatalogSort,
  type CatalogFilters,
} from "../../../../lib/catalog-filters";
import { getSiteUrl } from "../../../../lib/env";
import { publicMediaUrl } from "../../../../lib/media-url";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
    available?: string | string[];
    max?: string | string[];
    min?: string | string[];
    page?: string | string[];
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCatalogCategory(categorySlug);

  if (!category) {
    return { title: "Категорію не знайдено - DreamShop" };
  }

  return {
    alternates: {
      canonical: `${getSiteUrl()}/catalog/${category.slug}`,
    },
    description:
      category.description || `${category.name} у каталозі DreamShop.`,
    title: `${category.name} - DreamShop`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { categorySlug } = await params;
  const queryParams = await searchParams;
  const priceRange = normalizeCatalogPriceRange(
    queryParams.min,
    queryParams.max,
  );
  const filters: CatalogFilters = {
    availableOnly: normalizeAvailableOnly(queryParams.available),
    maxPrice: priceRange.maxPrice,
    minPrice: priceRange.minPrice,
    page: normalizeCatalogPage(queryParams.page),
    search: normalizeCatalogSearch(queryParams.q),
    sort: normalizeCatalogSort(queryParams.sort),
  };
  const category = await getCatalogCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const [categories, productPage] = await Promise.all([
    getCatalogCategories(),
    getCatalogProductPage({ ...filters, categoryId: category.id }),
  ]);
  const { pageCount, products, total } = productPage;
  const categoryPath = `/catalog/${category.slug}`;

  if (filters.page > pageCount) {
    redirect(catalogPath(categoryPath, { ...filters, page: 1 }));
  }

  const returnPath = catalogReturnPath(categoryPath, filters);

  return (
    <main className="store-main">
      <nav className="store-breadcrumbs" aria-label="Навігаційний ланцюжок">
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden>/</span>
        <span>{category.name}</span>
      </nav>

      <header className="catalog-heading catalog-category-heading">
        <p>Категорія</p>
        <h1>{category.name}</h1>
        {category.description ? <span>{category.description}</span> : null}
      </header>

      {category.cover ? (
        <div className="catalog-category-cover">
          <Image
            alt={category.cover.altText || category.name}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 1200px"
            src={publicMediaUrl(category.cover.objectKey)}
          />
        </div>
      ) : null}

      <CategoryNav activeSlug={category.slug} categories={categories} />
      <CatalogToolbar
        action={categoryPath}
        availableOnly={filters.availableOnly}
        maxPrice={filters.maxPrice}
        minPrice={filters.minPrice}
        search={filters.search}
        sort={filters.sort}
      />

      <section className="catalog-section" aria-labelledby="category-products">
        <div className="catalog-section-heading">
          <h2 id="category-products">
            {filters.search ? "Результати пошуку" : "Товари"}
          </h2>
          <span>{total}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0 && !category.cover}
                key={product.id}
                product={product}
                returnPath={returnPath}
                wishlisted={false}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <p>
              {filters.search
                ? `У категорії немає товарів за запитом «${filters.search}» з вибраними фільтрами.`
                : "У категорії немає товарів за вибраними фільтрами."}
            </p>
            <Link href={categoryPath}>Скинути фільтри</Link>
          </div>
        )}
        <CatalogPagination
          filters={filters}
          pageCount={pageCount}
          pathname={categoryPath}
        />
      </section>
    </main>
  );
}
