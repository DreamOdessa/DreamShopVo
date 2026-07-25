import type { OrderStatus } from "../orders";

export type OrderPeriod = "7d" | "30d" | "90d" | "all";

export const ORDER_PERIODS: Array<{
  label: string;
  value: OrderPeriod;
}> = [
  { label: "7 днів", value: "7d" },
  { label: "30 днів", value: "30d" },
  { label: "90 днів", value: "90d" },
  { label: "Увесь час", value: "all" },
];

export function normalizedOrderSearch(value?: string | null) {
  return (value ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}+\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

export function orderPeriodFrom(value?: string | null): OrderPeriod {
  return ORDER_PERIODS.some((period) => period.value === value)
    ? (value as OrderPeriod)
    : "30d";
}

export function orderSince(period: OrderPeriod, now = new Date()) {
  if (period === "all") {
    return null;
  }

  const days = Number.parseInt(period, 10);
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

export function orderSearchFilter(query: string) {
  const filters = [
    `customer_first_name.ilike.%${query}%`,
    `customer_last_name.ilike.%${query}%`,
    `delivery_city.ilike.%${query}%`,
  ];
  const digits = query.replace(/\D/g, "");

  if (digits.length >= 3) {
    filters.push(`customer_phone.ilike.%${digits}%`);
  }

  if (/^\d{1,12}$/.test(query)) {
    const orderNumber = Number(query);

    if (Number.isSafeInteger(orderNumber)) {
      filters.push(`order_number.eq.${orderNumber}`);
    }
  }

  return filters.join(",");
}

export function orderFilterParams({
  period,
  query,
  status,
}: {
  period: OrderPeriod;
  query: string;
  status: OrderStatus | null;
}) {
  const params = new URLSearchParams();

  if (status) {
    params.set("status", status);
  }

  if (period !== "30d") {
    params.set("period", period);
  }

  if (query) {
    params.set("q", query);
  }

  return params;
}
