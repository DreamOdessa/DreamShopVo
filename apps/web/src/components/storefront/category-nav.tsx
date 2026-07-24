import Link from "next/link";

import type { CatalogCategory } from "../../lib/catalog";

type CategoryNavProps = {
  activeSlug?: string;
  categories: CatalogCategory[];
};

export function CategoryNav({
  activeSlug,
  categories,
}: CategoryNavProps) {
  return (
    <nav className="catalog-category-nav" aria-label="Категорії товарів">
      <Link
        aria-current={!activeSlug ? "page" : undefined}
        href="/catalog"
      >
        Усі товари
      </Link>
      {categories.map((category) => (
        <Link
          aria-current={activeSlug === category.slug ? "page" : undefined}
          href={`/catalog/${category.slug}`}
          key={category.id}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}
