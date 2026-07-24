import { HeartOff } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProductCard } from "../../../components/storefront/product-card";
import { getCatalogProducts } from "../../../lib/catalog";
import { getWishlistState } from "../../../lib/wishlist";

export const metadata: Metadata = {
  title: "Обране - DreamShop",
  robots: {
    follow: false,
    index: false,
  },
};

export default async function WishlistPage() {
  const wishlist = await getWishlistState();

  if (!wishlist.authenticated) {
    redirect("/auth?next=%2Fwishlist");
  }

  const wishlistIds = new Set(wishlist.productIds);
  const products = (await getCatalogProducts()).filter(({ id }) =>
    wishlistIds.has(id),
  );

  return (
    <main className="store-main">
      <header className="catalog-heading">
        <p>Мій список</p>
        <h1>Обране</h1>
        <span>Товари, до яких ви хочете повернутися.</span>
      </header>

      <section className="catalog-section" aria-labelledby="wishlist-products">
        <div className="catalog-section-heading">
          <h2 id="wishlist-products">Збережені товари</h2>
          <span>{products.length}</span>
        </div>

        {products.length ? (
          <div className="product-card-grid">
            {products.map((product, index) => (
              <ProductCard
                eager={index === 0}
                key={product.id}
                product={product}
                returnPath="/wishlist"
                wishlisted
              />
            ))}
          </div>
        ) : (
          <div className="wishlist-empty">
            <HeartOff aria-hidden size={30} strokeWidth={1.5} />
            <h2>В обраному поки порожньо</h2>
            <p>Зберігайте товари сердечком, щоб швидко знайти їх пізніше.</p>
            <Link className="store-primary-action" href="/catalog">
              Перейти до каталогу
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
