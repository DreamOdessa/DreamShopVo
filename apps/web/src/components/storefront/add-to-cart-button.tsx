"use client";

import { Check, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import type { CartProduct } from "../../lib/cart";
import { useCart } from "./cart-provider";

export function AddToCartButton({ product }: { product: CartProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) {
      return;
    }

    const timeout = window.setTimeout(() => setAdded(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [added]);

  return (
    <button
      className="store-primary-action"
      disabled={!product.inStock}
      onClick={() => {
        addItem(product);
        setAdded(true);
      }}
      type="button"
    >
      {added ? (
        <Check aria-hidden size={19} strokeWidth={2} />
      ) : (
        <ShoppingBag aria-hidden size={19} strokeWidth={1.9} />
      )}
      {product.inStock
        ? added
          ? "Додано до кошика"
          : "Додати до кошика"
        : "Немає в наявності"}
    </button>
  );
}
