import { Search, X } from "lucide-react";
import Link from "next/link";

import type { CatalogSort } from "../../lib/catalog-filters";

type CatalogToolbarProps = {
  action: string;
  search: string;
  sort: CatalogSort;
};

export function CatalogToolbar({
  action,
  search,
  sort,
}: CatalogToolbarProps) {
  const filtered = Boolean(search) || sort !== "featured";

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
