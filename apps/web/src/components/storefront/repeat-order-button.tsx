"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import type { CartItem } from "../../lib/cart";
import { useCart } from "./cart-provider";

type RepeatOrderButtonProps = {
  items: CartItem[];
  unavailableItemCount: number;
};

export function RepeatOrderButton({
  items,
  unavailableItemCount,
}: RepeatOrderButtonProps) {
  const { addItems, hydrated } = useCart();
  const router = useRouter();
  const hasAvailableItems = items.length > 0;

  return (
    <div className="order-repeat">
      <button
        className="store-primary-action order-repeat-button"
        disabled={!hydrated || !hasAvailableItems}
        onClick={() => {
          addItems(
            items.map((item) => ({
              product: item,
              quantity: item.quantity,
            })),
          );
          router.push("/cart");
        }}
        type="button"
      >
        <RotateCcw aria-hidden size={18} strokeWidth={1.8} />
        {hasAvailableItems
          ? "Повторити замовлення"
          : "Товари більше недоступні"}
      </button>
      {unavailableItemCount > 0 ? (
        <p>
          Недоступні позиції не потраплять до кошика: {unavailableItemCount}.
        </p>
      ) : null}
    </div>
  );
}
