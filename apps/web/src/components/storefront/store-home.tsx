import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getCatalogCategories, getCatalogProducts } from "../../lib/catalog";
import { getWishlistState } from "../../lib/wishlist";

import { CategoryCard } from "./category-card";
import { ProductCard } from "./product-card";

export async function StoreHome() {
  const [categoriesResult, productsResult, wishlistResult] =
    await Promise.allSettled([
    getCatalogCategories(),
    getCatalogProducts(undefined, "", "featured"),
    getWishlistState(),
  ]);
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const products =
    productsResult.status === "fulfilled" ? productsResult.value : [];
  const wishlist =
    wishlistResult.status === "fulfilled"
      ? wishlistResult.value
      : { authenticated: false, available: false, productIds: [] };
  const featuredProducts = products.slice(0, 8);
  const wishlistedIds = new Set(wishlist.productIds);

  return (
    <main className="store-home">
      <section className="store-home-hero" aria-labelledby="store-home-title">
        <Image
          alt="Фруктові напої та натуральні смаколики DreamShop"
          className="store-home-hero-image"
          fill
          priority
          sizes="100vw"
          src="/background-first.jpg"
        />
        <div className="store-home-hero-shade" />
        <div className="store-home-hero-content">
          <Image
            alt=""
            aria-hidden
            className="store-home-hero-logo"
            height={256}
            priority
            src="/logo-name.PNG"
            width={320}
          />
          <p>Натуральні смаки з турботою про вас</p>
          <h1 id="store-home-title">DreamShop</h1>
          <span>
            Фруктові чипси, сиропи та добірні смаколики з доставкою по Україні.
          </span>
          <Link className="store-home-primary-action" href="/catalog">
            Перейти до каталогу
            <ArrowRight aria-hidden size={18} />
          </Link>
        </div>
        <a className="store-home-scroll" href="#home-categories" aria-label="До категорій">
          <ArrowDown aria-hidden size={22} />
        </a>
      </section>

      <section className="store-home-section" id="home-categories">
        <div className="store-home-section-heading">
          <div>
            <p>Обирайте своє</p>
            <h2>Категорії</h2>
          </div>
          <Link href="/catalog">
            Увесь каталог
            <ArrowRight aria-hidden size={17} />
          </Link>
        </div>
        {categories.length ? (
          <div className="category-card-grid">
            {categories.map((category, index) => (
              <CategoryCard category={category} eager={index < 3} key={category.id} />
            ))}
          </div>
        ) : (
          <p className="store-home-empty">Категорії незабаром з&apos;являться.</p>
        )}
      </section>

      <section className="store-home-products">
        <div className="store-home-section">
          <div className="store-home-section-heading">
            <div>
              <p>Вибір DreamShop</p>
              <h2>Популярні товари</h2>
            </div>
            <Link href="/catalog">
              Дивитися всі
              <ArrowRight aria-hidden size={17} />
            </Link>
          </div>
          {featuredProducts.length ? (
            <div className="product-card-grid">
              {featuredProducts.map((product, index) => (
                <ProductCard
                  eager={index < 4}
                  key={product.id}
                  product={product}
                  returnPath="/"
                  wishlisted={wishlistedIds.has(product.id)}
                />
              ))}
            </div>
          ) : (
            <p className="store-home-empty">Товари незабаром з&apos;являться.</p>
          )}
        </div>
      </section>
    </main>
  );
}
