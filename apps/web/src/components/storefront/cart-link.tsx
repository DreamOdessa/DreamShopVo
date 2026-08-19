"use client";

import { ShoppingBag } from "lucide-react";

import { useCart } from "./cart-provider";

export function CartLink() {
  const { hydrated, itemCount, openMiniCart } = useCart();
  const visibleCount = Math.min(itemCount, 99);

  return (
    <button
      aria-controls="store-mini-cart"
      aria-haspopup="dialog"
      className="icon-button cart-link"
      onClick={openMiniCart}
      title="Кошик"
      type="button"
    >
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
    </button>
  );
}
