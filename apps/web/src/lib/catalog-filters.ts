export const catalogSortValues = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
] as const;

export type CatalogSort = (typeof catalogSortValues)[number];

type SearchParam = string | string[] | undefined;

function firstParam(value: SearchParam) {
  return Array.isArray(value) ? value[0] : value;
}

export function normalizeCatalogSearch(value: SearchParam) {
  return (firstParam(value) ?? "")
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

export function catalogReturnPath(
  pathname: string,
  search: string,
  sort: CatalogSort,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("q", search);
  }

  if (sort !== "featured") {
    params.set("sort", sort);
  }

  const query = params.toString();

  return query ? `${pathname}?${query}` : pathname;
}
