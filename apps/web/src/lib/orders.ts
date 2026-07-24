export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orderStatusLabels: Record<OrderStatus, string> = {
  cancelled: "Скасовано",
  delivered: "Доставлено",
  pending: "Нове",
  processing: "В обробці",
  shipped: "Відправлено",
};

export const orderStatusTransitions: Record<OrderStatus, OrderStatus[]> = {
  cancelled: [],
  delivered: [],
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
};

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.some((status) => status === value);
}
