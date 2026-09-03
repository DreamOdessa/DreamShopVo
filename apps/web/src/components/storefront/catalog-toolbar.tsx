import { Search, X } from "lucide-react";
import Link from "next/link";

import type { CatalogSort } from "../../lib/catalog-filters";

type CatalogToolbarProps = {
  action: string;
  availableOnly: boolean;
  maxPrice: number | null;
  minPrice: number | null;
  search: string;
  sort: CatalogSort;
};

export function CatalogToolbar({
  action,
  availableOnly,
  maxPrice,
  minPrice,
  search,
  sort,
}: CatalogToolbarProps) {
  const filtered =
    Boolean(search) ||
    sort !== "featured" ||
    availableOnly ||
    minPrice !== null ||
    maxPrice !== null;
  const filterCount = Number(availableOnly) + Number(minPrice !== null) + Number(maxPrice !== null);

  return (
    <form action={action} className="catalog-toolbar" method="get">
      <label className="catalog-search-field">
        <span className="sr-only">Пошук товарів</span>
        <Search aria-hidden size={18} strokeWidth={1.8} />
        <input
          defaultValue={search}
          maxLength={80}
          name="q"
          placeholder="Пошук за назвою"
          type="search"
        />
      </label>

      <label className="catalog-sort-field">
        <span className="sr-only">Сортування товарів</span>
        <select defaultValue={sort} name="sort">
          <option value="featured">За замовчуванням</option>
          <option value="newest">Спочатку нові</option>
          <option value="price-asc">Від дешевих</option>
          <option value="price-desc">Від дорогих</option>
        </select>
      </label>

      <details className="catalog-filter-disclosure" open={filterCount > 0}>
        <summary>
          Фільтри
          {filterCount ? <span>{filterCount}</span> : null}
        </summary>
        <fieldset className="catalog-filter-fields">
          <legend className="sr-only">Фільтри товарів</legend>
          <label className="catalog-availability-field">
            <input
              defaultChecked={availableOnly}
              name="available"
              type="checkbox"
              value="1"
            />
            Тільки в наявності
          </label>
          <label className="catalog-price-field">
            <span>Ціна від</span>
            <input
              defaultValue={minPrice ?? ""}
              inputMode="decimal"
              min={0}
              name="min"
              placeholder="0"
              step="0.01"
              type="number"
            />
          </label>
          <label className="catalog-price-field">
            <span>до</span>
            <input
              defaultValue={maxPrice ?? ""}
              inputMode="decimal"
              min={0}
              name="max"
              placeholder="∞"
              step="0.01"
              type="number"
            />
          </label>
        </fieldset>
      </details>

      <button className="catalog-search-button" type="submit">
        <Search aria-hidden size={17} strokeWidth={1.8} />
        Знайти
      </button>

      {filtered ? (
        <Link className="catalog-reset-button" href={action}>
          <X aria-hidden size={17} strokeWidth={1.8} />
          Скинути
        </Link>
      ) : null}
    </form>
  );
}
