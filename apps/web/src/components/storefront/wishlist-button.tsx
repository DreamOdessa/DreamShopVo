"use client";

import { Heart } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import { toggleWishlistItem } from "../../app/(store)/wishlist/actions";
import { createClient } from "../../lib/supabase/client";

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
  const [currentWishlisted, setCurrentWishlisted] = useState(wishlisted);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;

      const { data } = await supabase
        .from("wishlist_items")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .maybeSingle();

      if (mounted) setCurrentWishlisted(Boolean(data));
    });

    return () => {
      mounted = false;
    };
  }, [productId]);

  useEffect(() => {
    const onWishlistUpdated = (event: Event) => {
      const { detail } = event as CustomEvent<{
        productId: string;
        wishlisted: boolean;
      }>;

      if (detail.productId === productId) {
        setCurrentWishlisted(detail.wishlisted);
      }
    };

    window.addEventListener("dreamshop:wishlist-updated", onWishlistUpdated);

    return () => {
      window.removeEventListener("dreamshop:wishlist-updated", onWishlistUpdated);
    };
  }, [productId]);

  const actionLabel = currentWishlisted
    ? `Видалити ${productName} з обраного`
    : `Додати ${productName} до обраного`;

  const updateWishlist = async (formData: FormData) => {
    await toggleWishlistItem(formData);
    const nextWishlisted = !currentWishlisted;

    setCurrentWishlisted(nextWishlisted);
    window.dispatchEvent(
      new CustomEvent("dreamshop:wishlist-updated", {
        detail: { productId, wishlisted: nextWishlisted },
      }),
    );
  };

  return (
    <form
      action={updateWishlist}
      className={compact ? "wishlist-form wishlist-form-compact" : "wishlist-form"}
    >
      <input name="productId" type="hidden" value={productId} />
      <input name="returnPath" type="hidden" value={returnPath} />
      <input
        name="wishlisted"
        type="hidden"
        value={currentWishlisted ? "true" : "false"}
      />
      <WishlistSubmitButton
        actionLabel={actionLabel}
        compact={compact}
        wishlisted={currentWishlisted}
      />
    </form>
  );
}
