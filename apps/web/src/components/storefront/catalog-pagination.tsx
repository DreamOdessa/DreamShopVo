import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  catalogPath,
  type CatalogFilters,
} from "../../lib/catalog-filters";

type CatalogPaginationProps = {
  filters: CatalogFilters;
  pageCount: number;
  pathname: string;
};

export function CatalogPagination({
  filters,
  pageCount,
  pathname,
}: CatalogPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="catalog-pagination" aria-label="Сторінки каталогу">
      {filters.page > 1 ? (
        <Link
          href={catalogPath(pathname, {
            ...filters,
            page: filters.page - 1,
          })}
          title="Попередня сторінка"
        >
          <ArrowLeft aria-hidden size={17} strokeWidth={1.8} />
          <span>Назад</span>
        </Link>
      ) : (
        <span aria-disabled="true">
          <ArrowLeft aria-hidden size={17} strokeWidth={1.8} />
          <span>Назад</span>
        </span>
      )}

      <strong>
        {filters.page} / {pageCount}
      </strong>

      {filters.page < pageCount ? (
        <Link
          href={catalogPath(pathname, {
            ...filters,
            page: filters.page + 1,
          })}
          title="Наступна сторінка"
        >
          <span>Далі</span>
          <ArrowRight aria-hidden size={17} strokeWidth={1.8} />
        </Link>
      ) : (
        <span aria-disabled="true">
          <span>Далі</span>
          <ArrowRight aria-hidden size={17} strokeWidth={1.8} />
        </span>
      )}
    </nav>
  );
}
