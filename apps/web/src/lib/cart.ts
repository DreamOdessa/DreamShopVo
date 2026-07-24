export const MAX_CART_LINES = 50;
export const MAX_CART_QUANTITY = 99;

export type CartProduct = {
  id: string;
  imageObjectKey: string | null;
  inStock: boolean;
  name: string;
  price: number;
  slug: string;
  stockQuantity: number | null;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export type CartAddition = {
  product: CartProduct;
  quantity: number;
};

export function cartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) =>
      item.inStock ? total + item.price * item.quantity : total,
    0,
  );
}

export function cartItemsMatch(first: CartItem[], second: CartItem[]) {
  return (
    first.length === second.length &&
    first.every((item, index) => {
      const other = second[index];

      return (
        other &&
        item.id === other.id &&
        item.imageObjectKey === other.imageObjectKey &&
        item.inStock === other.inStock &&
        item.name === other.name &&
        item.price === other.price &&
        item.quantity === other.quantity &&
        item.slug === other.slug &&
        item.stockQuantity === other.stockQuantity
      );
    })
  );
}

export function reconcileCartItems(
  current: CartItem[],
  products: CartProduct[],
) {
  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );

  return current.map((item) => {
    const product = productsById.get(item.id);

    if (!product) {
      return {
        ...item,
        inStock: false,
        stockQuantity: 0,
      };
    }

    const stockLimit = Math.min(
      product.stockQuantity ?? MAX_CART_QUANTITY,
      MAX_CART_QUANTITY,
    );
    const inStock = product.inStock && stockLimit > 0;

    return {
      ...item,
      ...product,
      inStock,
      quantity: inStock ? Math.min(item.quantity, stockLimit) : item.quantity,
    };
  });
}

export function mergeCartItems(
  current: CartItem[],
  additions: CartAddition[],
) {
  const next = current.slice(0, MAX_CART_LINES);

  additions.slice(0, MAX_CART_LINES).forEach(({ product, quantity }) => {
    if (!product.inStock || !Number.isFinite(quantity) || quantity < 1) {
      return;
    }

    const stockLimit = Math.min(
      product.stockQuantity ?? MAX_CART_QUANTITY,
      MAX_CART_QUANTITY,
    );

    if (stockLimit < 1) {
      return;
    }

    const requestedQuantity = Math.min(Math.trunc(quantity), stockLimit);
    const existingIndex = next.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      const existing = next[existingIndex];

      next[existingIndex] = {
        ...existing,
        ...product,
        quantity: Math.min(existing.quantity + requestedQuantity, stockLimit),
      };
      return;
    }

    if (next.length < MAX_CART_LINES) {
      next.push({ ...product, quantity: requestedQuantity });
    }
  });

  return next;
}
