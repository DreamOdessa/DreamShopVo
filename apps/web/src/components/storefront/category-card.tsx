import { ArrowRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { CatalogCategory } from "../../lib/catalog";
import { publicMediaUrl } from "../../lib/media-url";

type CategoryCardProps = {
  category: CatalogCategory;
  eager?: boolean;
};

export function CategoryCard({ category, eager = false }: CategoryCardProps) {
  return (
    <article className="category-card">
      <Link href={`/catalog/${category.slug}`}>
        <div className="category-card-media">
          {category.cover ? (
            <Image
              alt={category.cover.altText || category.name}
              fill
              fetchPriority={eager ? "high" : "auto"}
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, 420px"
              src={publicMediaUrl(category.cover.objectKey)}
            />
          ) : (
            <div className="catalog-image-fallback">
              <ImageIcon aria-hidden size={30} strokeWidth={1.4} />
            </div>
          )}
        </div>
        <div className="category-card-copy">
          <div>
            <h2>{category.name}</h2>
            {category.description ? <p>{category.description}</p> : null}
          </div>
          <ArrowRight aria-hidden size={20} strokeWidth={1.8} />
        </div>
      </Link>
    </article>
  );
}
