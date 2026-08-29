import type { Category, Order, Product, User } from "./types";

/**
 * A local-only legacy UI reference. It is enabled exclusively by the
 * start:legacy-preview command and never connects to production data.
 */
export const isLegacyLocalPreview =
  process.env.REACT_APP_LEGACY_LOCAL_PREVIEW === "true";

export const legacyPreviewAdmin: User = {
  id: "local-preview-admin",
  name: "Адміністратор",
  email: "admin@local.preview",
  isAdmin: true,
  isTester: true,
};

export const legacyPreviewCategories: Category[] = [
  {
    id: "local-category-chips",
    name: "Фруктові чіпси",
    slug: "chips",
    description: "Демонстраційна категорія для локального перегляду.",
    icon: "🍊",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "local-category-decor",
    name: "Прикраси для коктейлів",
    slug: "decorations",
    description: "Демонстраційна категорія для локального перегляду.",
    icon: "🍸",
    isActive: true,
    sortOrder: 2,
  },
];

export const legacyPreviewProducts: Product[] = [
  {
    id: "local-mango",
    name: "Манго",
    description: "Демонстраційний товар для перевірки старого інтерфейсу.",
    price: 300,
    image: "/small-icon.png",
    category: "chips",
    organic: true,
    inStock: true,
    isActive: true,
    isPopular: true,
    weight: "50 г",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
  {
    id: "local-lime",
    name: "Лайм",
    description: "Демонстраційний товар для перевірки старого інтерфейсу.",
    price: 260,
    image: "/small-icon.png",
    category: "chips",
    organic: true,
    inStock: true,
    isActive: true,
    isPopular: false,
    weight: "40 г",
    createdAt: "2026-01-09T09:00:00.000Z",
  },
  {
    id: "local-citrus-decor",
    name: "Цитрусова прикраса",
    description: "Демонстраційний товар для перевірки старого інтерфейсу.",
    price: 180,
    image: "/small-icon.png",
    category: "decorations",
    organic: false,
    inStock: false,
    isActive: true,
    isPopular: false,
    createdAt: "2026-01-08T09:00:00.000Z",
  },
];

export const legacyPreviewUsers: User[] = [
  legacyPreviewAdmin,
  {
    id: "local-preview-customer",
    name: "Тестовий клієнт",
    email: "customer@local.preview",
    discount: 5,
  },
];

export const legacyPreviewOrders: Order[] = [
  {
    id: "local-order-1",
    userId: "local-preview-customer",
    items: [{ product: legacyPreviewProducts[0], quantity: 2 }],
    total: 600,
    status: "pending",
    createdAt: "2026-01-11T10:30:00.000Z",
    customerInfo: {
      firstName: "Тестовий",
      lastName: "Клієнт",
      phone: "+380000000000",
    },
    deliveryInfo: {
      city: "Одеса",
      deliveryMethod: "post_office",
      deliveryDetails: "Тестове відділення",
    },
    recipientInfo: { isPrivatePerson: true },
    paymentInfo: {
      paymentMethod: "cash_on_delivery",
      contactForClarification: false,
    },
    shippingAddress: {
      name: "Тестовий Клієнт",
      address: "Тестова адреса",
      city: "Одеса",
      postalCode: "65000",
      phone: "+380000000000",
    },
  },
];

export function clonePreviewData<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function blockLegacyPreviewWrite(): never {
  throw new Error("Локальний режим перегляду працює лише для читання.");
}
