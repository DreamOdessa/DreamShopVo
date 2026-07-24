import { ArrowUpRight, PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { CatalogProduct } from "../../lib/catalog";
import { publicMediaUrl } from "../../lib/media-url";

type ProductCardProps = {
  eager?: boolean;
  product: CatalogProduct;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export function ProductCard({ eager = false, product }: ProductCardProps) {
  const mainImage = product.images.find(({ sortOrder }) => sortOrder === 0);

  return (
    <article className="product-card">
      <Link className="product-card-media" href={`/product/${product.slug}`}>
        {mainImage ? (
          <Image
            alt={mainImage.altText || product.name}
            fill
            fetchPriority={eager ? "high" : "auto"}
            loading={eager ? "eager" : "lazy"}
            sizes="(max-width: 520px) 100vw, (max-width: 900px) 50vw, 25vw"
            src={publicMediaUrl(mainImage.objectKey)}
          />
        ) : (
          <div className="catalog-image-fallback">
            <PackageOpen aria-hidden size={32} strokeWidth={1.4} />
          </div>
        )}
        {product.organic ? (
          <span className="product-card-badge">Organic</span>
        ) : null}
      </Link>

      <div className="product-card-copy">
        <div className="product-card-meta">
          <span>{product.category.name}</span>
          {product.weight ? <span>{product.weight}</span> : null}
        </div>

        <div className="product-card-title-row">
          <h2>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h2>
          <Link
            className="product-card-open"
            href={`/product/${product.slug}`}
            title={`Відкрити ${product.name}`}
          >
            <ArrowUpRight aria-hidden size={18} strokeWidth={1.8} />
            <span className="sr-only">Відкрити {product.name}</span>
          </Link>
        </div>

        <div className="product-card-price-row">
          <strong>{priceFormatter.format(product.price)}</strong>
          {product.originalPrice ? (
            <del>{priceFormatter.format(product.originalPrice)}</del>
          ) : null}
          {!product.inStock ? <span>Немає в наявності</span> : null}
        </div>
      </div>
    </article>
  );
}
