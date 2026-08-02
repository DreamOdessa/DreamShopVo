"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

type FilterOption = {
  label: string;
  value: string;
};

type CatalogFiltersProps = {
  categories: FilterOption[];
  category: string;
  query: string;
  sort: string;
  sorts: FilterOption[];
  stock: string;
};

export function CatalogFilters({
  categories,
  category,
  query,
  sort,
  sorts,
  stock,
}: CatalogFiltersProps) {
  const hasFilters = Boolean(query || category || stock !== "all" || sort !== "newest");

  return (
    <form
      action="/admin"
      aria-label="Пошук і фільтри товарів"
      className="admin-catalog-filter-form"
      method="get"
    >
      {stock !== "all" ? <input name="stock" type="hidden" value={stock} /> : null}
      <label className="admin-catalog-search-field">
        <span className="sr-only">Назва або slug товару</span>
        <input
          autoComplete="off"
          defaultValue={query}
          maxLength={80}
          name="q"
          placeholder="Назва або slug товару"
          type="search"
        />
      </label>
      <label>
        <span className="sr-only">Категорія товарів</span>
        <select
          aria-label="Категорія товарів"
          defaultValue={category}
          name="category"
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          <option value="">Усі категорії</option>
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Сортування товарів</span>
        <select
          aria-label="Сортування товарів"
          defaultValue={sort}
          name="sort"
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          {sorts.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button title="Застосувати пошук і фільтри" type="submit">
        {query ? (
          <Search aria-hidden size={17} strokeWidth={1.8} />
        ) : (
          <SlidersHorizontal aria-hidden size={17} strokeWidth={1.8} />
        )}
        <span className="sr-only">Застосувати пошук і фільтри</span>
      </button>
      {hasFilters ? (
        <Link href="/admin#products-title" title="Очистити всі фільтри">
          <X aria-hidden size={17} strokeWidth={1.8} />
          <span className="sr-only">Очистити всі фільтри</span>
        </Link>
      ) : null}
    </form>
  );
}
