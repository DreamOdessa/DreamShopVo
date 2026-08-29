import { PackageOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { CatalogProduct } from "../../lib/catalog";
import { publicMediaUrl } from "../../lib/media-url";

import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";

type ProductCardProps = {
  eager?: boolean;
  product: CatalogProduct;
  returnPath?: string;
  wishlisted?: boolean;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export function ProductCard({
  eager = false,
  product,
  returnPath = "/catalog",
  wishlisted = false,
}: ProductCardProps) {
  const mainImage = product.images.find(({ sortOrder }) => sortOrder === 0);

  return (
    <article className="product-card">
      <WishlistButton
        compact
        productId={product.id}
        productName={product.name}
        returnPath={returnPath}
        wishlisted={wishlisted}
      />
      <div className="product-card-media">
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
          <span className="product-card-badge">Органічний</span>
        ) : null}
      </div>

      <div className="product-card-copy">
        <div className="product-card-meta">
          <span>{product.category.name}</span>
          {product.weight ? <span>{product.weight}</span> : null}
        </div>

          <h2 className="product-card-title">
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h2>

        <div className="product-card-price-row">
          <strong>{priceFormatter.format(product.price)}</strong>
          {product.originalPrice ? (
            <del>{priceFormatter.format(product.originalPrice)}</del>
          ) : null}
          {!product.inStock ? <span>Немає в наявності</span> : null}
        </div>
        <AddToCartButton
          compact
          product={{
            id: product.id,
            imageObjectKey: mainImage?.objectKey ?? null,
            inStock: product.inStock,
            name: product.name,
            price: product.price,
            slug: product.slug,
            stockQuantity: product.stockQuantity,
          }}
        />
      </div>
    </article>
  );
}
