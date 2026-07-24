"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { refreshCartProducts } from "../../app/(store)/cart/actions";
import { cartItemsMatch, reconcileCartItems } from "../../lib/cart";
import { useCart } from "./cart-provider";

type SyncStatus = "error" | "idle" | "loading" | "ready";

export function useCartInventorySync() {
  const { hydrated, items, syncItems } = useCart();
  const [attempt, setAttempt] = useState(0);
  const [changed, setChanged] = useState(false);
  const [status, setStatus] = useState<SyncStatus>("idle");
  const productIds = useMemo(
    () => items.map(({ id }) => id).sort(),
    [items],
  );
  const productIdKey = productIds.join(",");

  useEffect(() => {
    if (!hydrated) {
      setStatus("idle");
      return;
    }

    if (!productIdKey) {
      setChanged(false);
      setStatus("ready");
      return;
    }

    let cancelled = false;
    const ids = productIdKey.split(",");

    setStatus("loading");

    void refreshCartProducts(ids).then((result) => {
      if (cancelled) {
        return;
      }

      if (result.status === "error") {
        setStatus("error");
        return;
      }

      const nextItems = reconcileCartItems(items, result.products);

      setChanged(!cartItemsMatch(items, nextItems));
      syncItems(result.products);
      setStatus("ready");
    });

    return () => {
      cancelled = true;
    };
  }, [attempt, hydrated, productIdKey, syncItems]);

  const retry = useCallback(() => {
    setAttempt((current) => current + 1);
  }, []);

  return { changed, retry, status };
}
