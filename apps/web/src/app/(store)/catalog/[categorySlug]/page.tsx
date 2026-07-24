import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogToolbar } from "../../../../components/storefront/catalog-toolbar";
import { CategoryNav } from "../../../../components/storefront/category-nav";
import { ProductCard } from "../../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogProducts,
} from "../../../../lib/catalog";
import {
  catalogReturnPath,
  normalizeCatalogSearch,
  normalizeCatalogSort,
} from "../../../../lib/catalog-filters";
import { getSiteUrl } from "../../../../lib/env";
import { publicMediaUrl } from "../../../../lib/media-url";
import { getWishlistState } from "../../../../lib/wishlist";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{
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
  const search = normalizeCatalogSearch(queryParams.q);
  const sort = normalizeCatalogSort(queryParams.sort);
  const category = await getCatalogCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const [categories, products, wishlist] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(category.id, search, sort),
    getWishlistState(),
  ]);
  const wishlistIds = new Set(wishlist.productIds);
  const categoryPath = `/catalog/${category.slug}`;
  const returnPath = catalogReturnPath(categoryPath, search, sort);

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
      <CatalogToolbar action={categoryPath} search={search} sort={sort} />

      <section className="catalog-section" aria-labelledby="category-products">
        <div className="catalog-section-heading">
          <h2 id="category-products">
            {search ? "Результати пошуку" : "Товари"}
          </h2>
          <span>{products.length}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0 && !category.cover}
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
              {search
                ? `У категорії немає товарів за запитом «${search}».`
                : "У цій категорії поки немає активних товарів."}
            </p>
            {search ? <Link href={categoryPath}>Скинути пошук</Link> : null}
          </div>
        )}
      </section>
    </main>
  );
}
