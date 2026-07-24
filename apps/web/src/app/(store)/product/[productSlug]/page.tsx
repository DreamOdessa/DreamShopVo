import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartButton } from "../../../../components/storefront/add-to-cart-button";
import { ProductCard } from "../../../../components/storefront/product-card";
import { ProductGallery } from "../../../../components/storefront/product-gallery";
import {
  getCatalogProduct,
  getCatalogProducts,
} from "../../../../lib/catalog";
import { getSiteUrl } from "../../../../lib/env";
import { publicMediaUrl } from "../../../../lib/media-url";
import { getWishlistState } from "../../../../lib/wishlist";
import { WishlistButton } from "../../../../components/storefront/wishlist-button";

type ProductPageProps = {
  params: Promise<{ productSlug: string }>;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

function descriptionText(description: string, name: string) {
  const normalized = description.trim().replace(/\s+/g, " ");

  return normalized || `${name} у каталозі DreamShop.`;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getCatalogProduct(productSlug);

  if (!product) {
    return { title: "Товар не знайдено - DreamShop" };
  }

  const mainImage = product.images.find(({ sortOrder }) => sortOrder === 0);

  return {
    alternates: {
      canonical: `${getSiteUrl()}/product/${product.slug}`,
    },
    description: descriptionText(product.description, product.name),
    openGraph: {
      description: descriptionText(product.description, product.name),
      images: mainImage
        ? [
            {
              alt: mainImage.altText || product.name,
              url: publicMediaUrl(mainImage.objectKey),
            },
          ]
        : undefined,
      title: product.name,
      type: "website",
    },
    title: `${product.name} - DreamShop`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getCatalogProduct(productSlug);

  if (!product) {
    notFound();
  }

  const [categoryProducts, wishlist] = await Promise.all([
    getCatalogProducts(product.category.id),
    getWishlistState(),
  ]);
  const wishlistIds = new Set(wishlist.productIds);
  const relatedProducts = categoryProducts
    .filter(({ id }) => id !== product.id)
    .slice(0, 4);
  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/product/${product.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    category: product.category.name,
    description: descriptionText(product.description, product.name),
    image: product.images.map(({ objectKey }) => publicMediaUrl(objectKey)),
    name: product.name,
    offers: {
      "@type": "Offer",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      price: product.price,
      priceCurrency: "UAH",
      url: productUrl,
    },
    url: productUrl,
  };

  return (
    <main className="store-main">
      <nav className="store-breadcrumbs" aria-label="Навігаційний ланцюжок">
        <Link href="/catalog">Каталог</Link>
        <span aria-hidden>/</span>
        <Link href={`/catalog/${product.category.slug}`}>
          {product.category.name}
        </Link>
        <span aria-hidden>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <ProductGallery
          images={product.images.map((image) => ({
            altText: image.altText,
            url: publicMediaUrl(image.objectKey),
          }))}
          productName={product.name}
        />

        <section className="product-detail-copy" aria-labelledby="product-title">
          <p>{product.category.name}</p>
          <h1 id="product-title">{product.name}</h1>

          <div className="product-detail-price">
            <strong>{priceFormatter.format(product.price)}</strong>
            {product.originalPrice ? (
              <del>{priceFormatter.format(product.originalPrice)}</del>
            ) : null}
          </div>

          <div className="product-detail-statuses">
            <span
              className={
                product.inStock
                  ? "product-stock product-stock-active"
                  : "product-stock"
              }
            >
              {product.inStock ? "У наявності" : "Немає в наявності"}
            </span>
            {product.inStock &&
            product.stockQuantity !== null &&
            product.stockQuantity <= 5 ? (
              <span>Залишилось: {product.stockQuantity}</span>
            ) : null}
            {product.organic ? <span>Organic</span> : null}
            {product.weight ? <span>{product.weight}</span> : null}
          </div>

          <div className="product-detail-actions">
            <AddToCartButton
              product={{
                id: product.id,
                imageObjectKey:
                  product.images.find(({ sortOrder }) => sortOrder === 0)
                    ?.objectKey ?? null,
                inStock: product.inStock,
                name: product.name,
                price: product.price,
                slug: product.slug,
                stockQuantity: product.stockQuantity,
              }}
            />
            <WishlistButton
              productId={product.id}
              productName={product.name}
              returnPath={`/product/${product.slug}`}
              wishlisted={wishlistIds.has(product.id)}
            />
          </div>

          {product.description ? (
            <div className="product-detail-description">
              <h2>Про товар</h2>
              <p>{product.description}</p>
            </div>
          ) : null}
        </section>
      </div>

      {relatedProducts.length ? (
        <section className="catalog-section" aria-labelledby="related-products">
          <div className="catalog-section-heading">
            <h2 id="related-products">Схожі товари</h2>
          </div>
          <div className="product-card-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                returnPath={`/product/${product.slug}`}
                wishlisted={wishlistIds.has(relatedProduct.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </main>
  );
}
