import type { Metadata } from "next";
import Link from "next/link";

import { CatalogToolbar } from "../../../components/storefront/catalog-toolbar";
import { CategoryCard } from "../../../components/storefront/category-card";
import { CategoryNav } from "../../../components/storefront/category-nav";
import { ProductCard } from "../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogProducts,
} from "../../../lib/catalog";
import {
  catalogReturnPath,
  normalizeCatalogSearch,
  normalizeCatalogSort,
} from "../../../lib/catalog-filters";
import { getWishlistState } from "../../../lib/wishlist";

export const metadata: Metadata = {
  title: "Каталог - DreamShop",
  description:
    "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
};

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    sort?: string | string[];
  }>;
};

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps) {
  const params = await searchParams;
  const search = normalizeCatalogSearch(params.q);
  const sort = normalizeCatalogSort(params.sort);
  const [categories, products, wishlist] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(undefined, search, sort),
    getWishlistState(),
  ]);
  const wishlistIds = new Set(wishlist.productIds);
  const returnPath = catalogReturnPath("/catalog", search, sort);

  return (
    <main className="store-main">
      <header className="catalog-heading">
        <p>DreamShop</p>
        <h1>Каталог</h1>
        <span>Натуральні смаки для легких перекусів і красивих моментів.</span>
      </header>

      <CategoryNav categories={categories} />
      <CatalogToolbar action="/catalog" search={search} sort={sort} />

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
            {search ? "Результати пошуку" : "Усі товари"}
          </h2>
          <span>{products.length}</span>
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
              {search
                ? `За запитом «${search}» товарів не знайдено.`
                : "Активних товарів поки немає."}
            </p>
            {search ? <Link href="/catalog">Скинути пошук</Link> : null}
          </div>
        )}
      </section>
    </main>
  );
}
