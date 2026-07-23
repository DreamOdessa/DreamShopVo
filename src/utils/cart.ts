import { CartItem } from '../types';

export function parseStoredArray<T>(serializedValue: string | null): T[] {
  if (!serializedValue) return [];

  try {
    const parsedValue: unknown = JSON.parse(serializedValue);
    return Array.isArray(parsedValue) ? parsedValue as T[] : [];
  } catch {
    return [];
  }
}

export function calculateCartTotal(items: CartItem[], userDiscount: number = 0): number {
  const subtotal = items.reduce((total, item) => {
    const price = Number(item.product.price);
    const quantity = Number(item.quantity);

    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(quantity) || quantity <= 0) {
      return total;
    }

    return total + price * quantity;
  }, 0);

  const normalizedDiscount = Number.isFinite(userDiscount)
    ? Math.min(100, Math.max(0, userDiscount))
    : 0;

  return subtotal * (1 - normalizedDiscount / 100);
}
