"use client";

import { Heart } from "lucide-react";
import { useFormStatus } from "react-dom";

import { toggleWishlistItem } from "../../app/(store)/wishlist/actions";

type WishlistButtonProps = {
  compact?: boolean;
  productId: string;
  productName: string;
  returnPath: string;
  wishlisted: boolean;
};

function WishlistSubmitButton({
  actionLabel,
  compact,
  wishlisted,
}: Pick<WishlistButtonProps, "compact" | "wishlisted"> & {
  actionLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-label={actionLabel}
      aria-pressed={wishlisted}
      className={`wishlist-button${wishlisted ? " is-active" : ""}`}
      disabled={pending}
      title={actionLabel}
      type="submit"
    >
      <Heart
        aria-hidden
        fill={wishlisted ? "currentColor" : "none"}
        size={compact ? 18 : 19}
        strokeWidth={1.8}
      />
      {compact ? null : (
        <span>{pending ? "Збереження…" : wishlisted ? "В обраному" : "До обраного"}</span>
      )}
    </button>
  );
}

export function WishlistButton({
  compact = false,
  productId,
  productName,
  returnPath,
  wishlisted,
}: WishlistButtonProps) {
  const actionLabel = wishlisted
    ? `Видалити ${productName} з обраного`
    : `Додати ${productName} до обраного`;

  return (
    <form
      action={toggleWishlistItem}
      className={compact ? "wishlist-form wishlist-form-compact" : "wishlist-form"}
    >
      <input name="productId" type="hidden" value={productId} />
      <input name="returnPath" type="hidden" value={returnPath} />
      <input
        name="wishlisted"
        type="hidden"
        value={wishlisted ? "true" : "false"}
      />
      <WishlistSubmitButton
        actionLabel={actionLabel}
        compact={compact}
        wishlisted={wishlisted}
      />
    </form>
  );
}
