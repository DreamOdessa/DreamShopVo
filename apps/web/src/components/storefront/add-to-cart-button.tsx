"use client";

import { Check, ShoppingBag, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import type { CartProduct } from "../../lib/cart";
import { useCart } from "./cart-provider";

type AddToCartButtonProps = {
  compact?: boolean;
  product: CartProduct;
};

type AddState = "added" | "full" | "idle" | "limit";

export function AddToCartButton({
  compact = false,
  product,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [state, setState] = useState<AddState>("idle");

  useEffect(() => {
    if (state === "idle") {
      return;
    }

    const timeout = window.setTimeout(() => setState("idle"), 2200);
    return () => window.clearTimeout(timeout);
  }, [state]);

  const label = !product.inStock
    ? "Немає в наявності"
    : state === "added"
      ? "Додано до кошика"
      : state === "limit"
        ? "Досягнуто доступний залишок"
        : state === "full"
          ? "Кошик заповнений"
          : compact
            ? "Додати"
            : "Додати до кошика";
  const warning = state === "limit" || state === "full";

  return (
    <button
      aria-label={compact ? `${label}: ${product.name}` : undefined}
      aria-live="polite"
      className={compact ? "product-card-cart" : "store-primary-action"}
      disabled={!product.inStock}
      onClick={() => {
        const result = addItem(product);

        setState(result === "unavailable" ? "idle" : result);
      }}
      title={compact ? `${label}: ${product.name}` : undefined}
      type="button"
    >
      {state === "added" ? (
        <Check aria-hidden size={19} strokeWidth={2} />
      ) : warning ? (
        <TriangleAlert aria-hidden size={18} strokeWidth={1.9} />
      ) : (
        <ShoppingBag aria-hidden size={19} strokeWidth={1.9} />
      )}
      {label}
    </button>
  );
}
