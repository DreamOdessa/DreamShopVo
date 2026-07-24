export const MAX_CART_LINES = 50;
export const MAX_CART_QUANTITY = 99;

export type CartProduct = {
  id: string;
  imageObjectKey: string | null;
  inStock: boolean;
  name: string;
  price: number;
  slug: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};

export function cartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
}
