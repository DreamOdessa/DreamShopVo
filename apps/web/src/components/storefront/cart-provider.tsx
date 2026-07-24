"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  MAX_CART_LINES,
  MAX_CART_QUANTITY,
  type CartItem,
  type CartProduct,
} from "../../lib/cart";

const STORAGE_KEY = "dreamshop_cart_v1";

type CartContextValue = {
  addItem: (product: CartProduct) => void;
  clear: () => void;
  hydrated: boolean;
  itemCount: number;
  items: CartItem[];
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function validItem(value: unknown): CartItem | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const item = value as Record<string, unknown>;
  const quantity = Number(item.quantity);
  const price = Number(item.price);

  if (
    typeof item.id !== "string" ||
    typeof item.slug !== "string" ||
    typeof item.name !== "string" ||
    (item.imageObjectKey !== null &&
      typeof item.imageObjectKey !== "string") ||
    typeof item.inStock !== "boolean" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return null;
  }

  return {
    id: item.id.slice(0, 100),
    imageObjectKey: item.imageObjectKey?.slice(0, 500) ?? null,
    inStock: item.inStock,
    name: item.name.slice(0, 200),
    price,
    quantity: Math.min(quantity, MAX_CART_QUANTITY),
    slug: item.slug.slice(0, 200),
  };
}

function storedItems(): CartItem[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .slice(0, MAX_CART_LINES)
      .map(validItem)
      .filter((item): item is CartItem => Boolean(item));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(storedItems());
    setHydrated(true);

    function syncCart(event: StorageEvent) {
      if (event.key === STORAGE_KEY) {
        setItems(storedItems());
      }
    }

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [hydrated, items]);

  const addItem = useCallback((product: CartProduct) => {
    if (!product.inStock) {
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                ...product,
                quantity: Math.min(
                  item.quantity + 1,
                  MAX_CART_QUANTITY,
                ),
              }
            : item,
        );
      }

      if (current.length >= MAX_CART_LINES) {
        return current;
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!Number.isFinite(quantity)) {
      return;
    }

    const safeQuantity = Math.max(
      1,
      Math.min(Math.trunc(quantity), MAX_CART_QUANTITY),
    );

    setItems((current) =>
      current.map((item) =>
        item.id === productId
          ? { ...item, quantity: safeQuantity }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.id !== productId));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(
    () => ({
      addItem,
      clear,
      hydrated,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      items,
      removeItem,
      updateQuantity,
    }),
    [addItem, clear, hydrated, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
