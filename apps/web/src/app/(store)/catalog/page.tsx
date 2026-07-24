import type { Metadata } from "next";

import { CategoryCard } from "../../../components/storefront/category-card";
import { CategoryNav } from "../../../components/storefront/category-nav";
import { ProductCard } from "../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogProducts,
} from "../../../lib/catalog";
import { getWishlistState } from "../../../lib/wishlist";

export const metadata: Metadata = {
  title: "Каталог - DreamShop",
  description:
    "Натуральні фруктові чипси та смаколики DreamShop в Одесі.",
};

export default async function CatalogPage() {
  const [categories, products, wishlist] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(),
    getWishlistState(),
  ]);
  const wishlistIds = new Set(wishlist.productIds);

  return (
    <main className="store-main">
      <header className="catalog-heading">
        <p>DreamShop</p>
        <h1>Каталог</h1>
        <span>Натуральні смаки для легких перекусів і красивих моментів.</span>
      </header>

      <CategoryNav categories={categories} />

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
          <h2 id="product-list-title">Усі товари</h2>
          <span>{products.length}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0}
                key={product.id}
                product={product}
                wishlisted={wishlistIds.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <p>Активних товарів поки немає.</p>
          </div>
        )}
      </section>
    </main>
  );
}
