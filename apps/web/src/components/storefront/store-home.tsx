import { ArrowDown, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getStorefrontHomeCatalog } from "../../lib/catalog";

import { OrangeCategoryShowcase } from "./orange-category-showcase";
import { ProductCard } from "./product-card";

const requestedShowcaseCategories = [
  { id: "fruit-chips", name: "Фруктові чипси", terms: ["чіп", "чип", "chips"] },
  { id: "fruit-powders", name: "Фруктові пудри", terms: ["пудр", "powder"] },
  { id: "sweets", name: "Солодощі", terms: ["солод", "цукер", "candy", "sweet"] },
  { id: "syrups", name: "Сиропи", terms: ["сироп", "syrup"] },
  { id: "dried-flowers", name: "Сухоцвіти", terms: ["сухоцв", "dried-flower"] },
  { id: "natural-teas", name: "Натуральні чаї", terms: ["чай", "tea"] },
  {
    id: "cocktail-decorations",
    name: "Прикраси для коктейлів",
    terms: ["прикраш", "коктейл", "decor", "cocktail"],
  },
] as const;

function categoryMatches(
  category: { name: string; slug: string },
  terms: readonly string[],
) {
  const identity = `${category.slug} ${category.name}`.toLocaleLowerCase("uk-UA");
  return terms.some((term) => identity.includes(term));
}

export async function StoreHome() {
  const homeCatalogResult = await Promise.allSettled([getStorefrontHomeCatalog()]);
  const homeCatalog =
    homeCatalogResult[0].status === "fulfilled"
      ? homeCatalogResult[0].value
      : { popularProducts: [], showcaseCategories: [] };
  const { popularProducts, showcaseCategories } = homeCatalog;
  const completeShowcaseCategories = requestedShowcaseCategories.map((requested) => {
    const existing = showcaseCategories.find(({ category }) =>
      categoryMatches(category, requested.terms),
    );

    if (existing) {
      return {
        category: {
          ...existing.category,
          href: `/catalog/${existing.category.slug}`,
          name: requested.name,
        },
        products: existing.products,
      };
    }

    return {
      category: {
        cover: null,
        description: "Категорія готується до наповнення.",
        href: "/catalog",
        id: `showcase-${requested.id}`,
        name: requested.name,
        slug: requested.id,
      },
      products: [],
    };
  });

  return (
    <main className="store-home">
      <section className="store-home-hero" aria-labelledby="store-home-title">
        <div className="store-home-hero-content">
          <Image
            alt="DreamShop"
            className="store-home-hero-logo"
            height={945}
            priority
            src="/logo.png"
            width={1483}
          />
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
        <a className="store-home-scroll" href="#home-categories" aria-label="До категорій">
          <ArrowDown aria-hidden size={22} />
        </a>
      </section>

      {completeShowcaseCategories.length ? (
        <OrangeCategoryShowcase
          categories={completeShowcaseCategories.map(({ category, products }) => ({
            ...category,
            products: products.map(({ id, images }) => ({ id, images })),
          }))}
        />
      ) : (
        <section className="store-home-showcase" id="home-categories">
          <p className="store-home-empty">Категорії незабаром з&apos;являться.</p>
        </section>
      )}

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
              {popularProducts.map((product) => (
                <ProductCard
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
