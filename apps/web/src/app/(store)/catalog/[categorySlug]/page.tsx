import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryNav } from "../../../../components/storefront/category-nav";
import { ProductCard } from "../../../../components/storefront/product-card";
import {
  getCatalogCategories,
  getCatalogCategory,
  getCatalogProducts,
} from "../../../../lib/catalog";
import { getSiteUrl } from "../../../../lib/env";
import { publicMediaUrl } from "../../../../lib/media-url";

type CategoryPageProps = {
  params: Promise<{ categorySlug: string }>;
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const category = await getCatalogCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const [categories, products] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(category.id),
  ]);

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

      <section className="catalog-section" aria-labelledby="category-products">
        <div className="catalog-section-heading">
          <h2 id="category-products">Товари</h2>
          <span>{products.length}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0 && !category.cover}
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <p>У цій категорії поки немає активних товарів.</p>
          </div>
        )}
      </section>
    </main>
  );
}
