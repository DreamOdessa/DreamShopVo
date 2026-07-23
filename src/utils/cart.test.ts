import { calculateCartTotal, parseStoredArray } from './cart';
import { CartItem, Product } from '../types';

const product: Product = {
  id: 'product-1',
  name: 'Test product',
  description: 'Test',
  price: 100,
  originalPrice: 150,
  image: '',
  category: 'test',
  organic: false,
  inStock: true,
  createdAt: '2026-01-01T00:00:00.000Z'
};

describe('calculateCartTotal', () => {
  it('uses the current product price and applies the user discount', () => {
    const items: CartItem[] = [{ product, quantity: 2 }];

    expect(calculateCartTotal(items, 10)).toBe(180);
  });

  it('ignores invalid items and clamps discount to the valid range', () => {
    const invalidItem: CartItem = {
      product: { ...product, price: Number.NaN },
      quantity: 2
    };

    expect(calculateCartTotal([invalidItem], 10)).toBe(0);
    expect(calculateCartTotal([{ product, quantity: 1 }], 150)).toBe(0);
    expect(calculateCartTotal([{ product, quantity: 1 }], -10)).toBe(100);
  });
});

describe('parseStoredArray', () => {
  it('returns stored arrays and rejects malformed values', () => {
    expect(parseStoredArray<number>('[1,2]')).toEqual([1, 2]);
    expect(parseStoredArray<number>('{"value":1}')).toEqual([]);
    expect(parseStoredArray<number>('broken-json')).toEqual([]);
  });
});
