export const catalogSortValues = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
] as const;

export type CatalogSort = (typeof catalogSortValues)[number];
export type CatalogFilters = {
  availableOnly: boolean;
  maxPrice: number | null;
  minPrice: number | null;
  page: number;
  search: string;
  sort: CatalogSort;
};

type SearchParam = string | string[] | undefined;

export type CatalogSearchParams = Record<string, SearchParam>;

export function hasCatalogQueryParameters(searchParams: CatalogSearchParams) {
  return Object.keys(searchParams).length > 0;
}

function firstParam(value: SearchParam) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeCatalogSearch(value: SearchParam) {
  return (firstParam(value) ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}'\-\s]/gu, " ")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export function normalizeCatalogSort(
  value: SearchParam,
): CatalogSort {
  const normalized = firstParam(value);

  return catalogSortValues.includes(normalized as CatalogSort)
    ? (normalized as CatalogSort)
    : "featured";
}

export function normalizeCatalogPrice(value: SearchParam) {
  const normalized = firstParam(value);

  if (!normalized) {
    return null;
  }

  const price = Number(normalized.replace(",", "."));
  return Number.isFinite(price) && price >= 0 && price <= 9999999999.99
    ? Math.round(price * 100) / 100
    : null;
}

export function normalizeCatalogPriceRange(
  minValue: SearchParam,
  maxValue: SearchParam,
) {
  const first = normalizeCatalogPrice(minValue);
  const second = normalizeCatalogPrice(maxValue);

  if (first !== null && second !== null && first > second) {
    return { maxPrice: first, minPrice: second };
  }

  return { maxPrice: second, minPrice: first };
}

export function normalizeCatalogPage(value: SearchParam) {
  const page = Number(firstParam(value));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

export function normalizeAvailableOnly(value: SearchParam) {
  return firstParam(value) === "1";
}

export function catalogPath(pathname: string, filters: CatalogFilters) {
  const params = new URLSearchParams();

  if (filters.search) {
    params.set("q", filters.search);
  }

  if (filters.sort !== "featured") {
    params.set("sort", filters.sort);
  }

  if (filters.availableOnly) {
    params.set("available", "1");
  }

  if (filters.minPrice !== null) {
    params.set("min", String(filters.minPrice));
  }

  if (filters.maxPrice !== null) {
    params.set("max", String(filters.maxPrice));
  }

  if (filters.page > 1) {
    params.set("page", String(filters.page));
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}

export const catalogReturnPath = catalogPath;
