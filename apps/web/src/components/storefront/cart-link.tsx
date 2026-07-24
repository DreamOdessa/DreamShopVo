"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { useCart } from "./cart-provider";

export function CartLink() {
  const { hydrated, itemCount } = useCart();
  const visibleCount = Math.min(itemCount, 99);

  return (
    <Link className="icon-button cart-link" href="/cart" title="Кошик">
      <ShoppingBag aria-hidden size={21} strokeWidth={1.8} />
      {hydrated && itemCount > 0 ? (
        <span aria-hidden className="cart-count">
          {visibleCount}
          {itemCount > 99 ? "+" : ""}
        </span>
      ) : null}
      <span className="sr-only">
        Кошик{hydrated && itemCount ? `, товарів: ${itemCount}` : ""}
      </span>
    </Link>
  );
}
