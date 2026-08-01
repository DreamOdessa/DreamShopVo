"use client";

import { Check, Minus, Plus, ShoppingBag, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";

import {
  MAX_CART_LINES,
  MAX_CART_QUANTITY,
  type CartProduct,
} from "../../lib/cart";
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
  const { addItem, addItems, items } = useCart();
  const [quantity, setQuantity] = useState(1);
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

  const addSelectedQuantity = () => {
    const stockLimit = Math.min(
      product.stockQuantity ?? MAX_CART_QUANTITY,
      MAX_CART_QUANTITY,
    );
    const existing = items.find((item) => item.id === product.id);

    if (!product.inStock || stockLimit < 1) return;

    if (!existing && items.length >= MAX_CART_LINES) {
      setState("full");
      return;
    }

    const availableQuantity = stockLimit - (existing?.quantity ?? 0);

    if (availableQuantity < 1) {
      setState("limit");
      return;
    }

    const quantityToAdd = Math.min(quantity, availableQuantity);
    addItems([{ product, quantity: quantityToAdd }]);
    setState(quantityToAdd < quantity ? "limit" : "added");
  };

  const button = (
    <button
      aria-label={compact ? `${label}: ${product.name}` : undefined}
      aria-live="polite"
      className={compact ? "product-card-cart" : "store-primary-action"}
      disabled={!product.inStock}
      onClick={() => {
        if (compact) {
          const result = addItem(product);
          setState(result === "unavailable" ? "idle" : result);
          return;
        }

        addSelectedQuantity();
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

  if (compact) return button;

  const maximumQuantity = Math.max(
    1,
    Math.min(product.stockQuantity ?? MAX_CART_QUANTITY, MAX_CART_QUANTITY),
  );

  return (
    <div className="product-purchase-controls">
      <div className="product-quantity" aria-label="Кількість товару">
        <button
          aria-label="Зменшити кількість"
          disabled={!product.inStock || quantity <= 1}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          type="button"
        >
          <Minus aria-hidden size={17} />
        </button>
        <output aria-live="polite" aria-label={`Кількість: ${quantity}`}>
          {quantity}
        </output>
        <button
          aria-label="Збільшити кількість"
          disabled={!product.inStock || quantity >= maximumQuantity}
          onClick={() =>
            setQuantity((current) => Math.min(maximumQuantity, current + 1))
          }
          type="button"
        >
          <Plus aria-hidden size={17} />
        </button>
      </div>
      {button}
    </div>
  );
}
