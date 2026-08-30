import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getStorefrontHomeCatalog } from "../../lib/catalog";

import { CategoryCard } from "./category-card";
import { ProductCard } from "./product-card";

export async function StoreHome() {
  const homeCatalogResult = await Promise.allSettled([getStorefrontHomeCatalog()]);
  const homeCatalog =
    homeCatalogResult[0].status === "fulfilled"
      ? homeCatalogResult[0].value
      : { popularProducts: [], showcaseCategories: [] };
  const { popularProducts, showcaseCategories } = homeCatalog;

  return (
    <main className="store-home">
      <section className="store-home-hero" aria-labelledby="store-home-title">
        <div className="store-home-hero-content">
          <p className="store-home-eyebrow">DreamShop · Одеса</p>
          <h1 id="store-home-title">
            Фруктові чипси та прикраси для коктейлів
          </h1>
          <span>
            Натуральні продукти для здорового харчування та гарної подачі.
          </span>
          <Link className="store-home-primary-action" href="/catalog">
            До каталогу
            <ArrowRight aria-hidden size={18} />
          </Link>
        </div>
        <div className="store-home-hero-art" aria-hidden="true">
          <Image
            alt=""
            className="store-home-hero-logo"
            height={945}
            priority
            src="/logo.png"
            width={1483}
          />
        </div>
        <a className="store-home-scroll" href="#home-categories" aria-label="До категорій">
          <ArrowDown aria-hidden size={22} />
        </a>
      </section>

      <section className="store-home-showcase" id="home-categories">
        {showcaseCategories.length ? (
          showcaseCategories.map(({ category, products }, categoryIndex) => (
            <section
              className={`home-category-row${categoryIndex % 2 ? " is-reversed" : ""}`}
              key={category.id}
              aria-labelledby={`home-category-${category.id}`}
            >
              <div className="home-category-products">
                <div className="home-category-heading">
                  <h2 id={`home-category-${category.id}`}>
                    <Link href={`/catalog/${category.slug}`}>{category.name}</Link>
                  </h2>
                </div>
                <div className="home-category-product-grid">
                  {products.map((product, productIndex) => (
                    <ProductCard
                      eager={categoryIndex === 0 && productIndex < 3}
                      key={product.id}
                      product={product}
                      returnPath="/"
                      wishlisted={false}
                    />
                  ))}
                </div>
                {category.description ? <p>{category.description}</p> : null}
              </div>
              <CategoryCard category={category} eager={categoryIndex < 2} />
            </section>
          ))
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
          {popularProducts.length ? (
            <div className="product-card-grid">
              {popularProducts.map((product, index) => (
                <ProductCard
                  eager={index < 4}
                  key={product.id}
                  product={product}
                  returnPath="/"
                  wishlisted={false}
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
