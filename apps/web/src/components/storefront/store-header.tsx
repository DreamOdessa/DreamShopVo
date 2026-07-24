import { CircleUserRound, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getWishlistState } from "../../lib/wishlist";

import { CartLink } from "./cart-link";

export async function StoreHeader() {
  const wishlist = await getWishlistState();

  return (
    <header className="store-header">
      <div className="store-header-inner">
        <Link className="store-logo-link" href="/catalog" aria-label="DreamShop">
          <Image
            className="store-logo"
            src="/logo-name.PNG"
            alt="DreamShop"
            width={180}
            height={144}
            priority
          />
        </Link>

        <nav className="store-primary-nav" aria-label="Основна навігація">
          <Link href="/catalog">Каталог</Link>
        </nav>

        <div className="store-header-actions">
          <Link
            aria-label={
              wishlist.productIds.length
                ? `Обране: ${wishlist.productIds.length} товарів`
                : "Обране"
            }
            className="icon-button wishlist-link"
            href="/wishlist"
            title="Обране"
          >
            <Heart aria-hidden size={20} strokeWidth={1.8} />
            {wishlist.productIds.length ? (
              <span aria-hidden className="wishlist-count">
                {wishlist.productIds.length > 99
                  ? "99+"
                  : wishlist.productIds.length}
              </span>
            ) : null}
          </Link>
          <CartLink />
          <Link className="icon-button" href="/account" title="Мій акаунт">
            <CircleUserRound aria-hidden size={21} strokeWidth={1.8} />
            <span className="sr-only">Мій акаунт</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
