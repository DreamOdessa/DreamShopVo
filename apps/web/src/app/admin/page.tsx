import {
  ArrowLeft,
  ArrowRight,
  FolderTree,
  PackageOpen,
  Pencil,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminContext } from "../../lib/auth/admin";

import { AdminNavigation } from "./admin-navigation";
import { CategoryForm } from "./category-form";
import { ProductForm } from "./product-form";
import { QuickStockForm } from "./quick-stock-form";

export const metadata: Metadata = {
  title: "Каталог - DreamShop Admin",
  robots: {
    index: false,
    follow: false,
  },
};

type CategoryRow = {
  id: string;
  is_active: boolean;
  name: string;
  slug: string;
  sort_order: number;
};

type ProductRow = {
  category: { name: string } | null;
  id: string;
  in_stock: boolean;
  is_active: boolean;
  name: string;
  price: number;
  slug: string;
  stock_quantity: number | null;
};

type ProductFilter = "active" | "all" | "inactive" | "low" | "out";
type ProductSort = "name" | "newest" | "price_high" | "price_low" | "stock";

type AdminPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
    q?: string;
    sort?: string;
    stock?: string;
  }>;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

const PAGE_SIZE = 20;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT_FILTERS: Array<{ label: string; value: ProductFilter }> = [
  { label: "Усі", value: "all" },
  { label: "У продажу", value: "active" },
  { label: "Мало", value: "low" },
  { label: "Немає", value: "out" },
  { label: "Приховані", value: "inactive" },
];
const PRODUCT_SORTS: Array<{ label: string; value: ProductSort }> = [
  { label: "Спочатку нові", value: "newest" },
  { label: "За назвою", value: "name" },
  { label: "Найменший залишок", value: "stock" },
  { label: "Найдешевші", value: "price_low" },
  { label: "Найдорожчі", value: "price_high" },
];

function normalizedSearch(value?: string) {
  return (value ?? "")
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function pageFrom(value?: string) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function productFilterFrom(value?: string): ProductFilter {
  return PRODUCT_FILTERS.some((filter) => filter.value === value)
    ? (value as ProductFilter)
    : "all";
}

function productSortFrom(value?: string): ProductSort {
  return PRODUCT_SORTS.some((sort) => sort.value === value)
    ? (value as ProductSort)
    : "newest";
}

function catalogHref({
  category,
  page,
  query,
  sort,
  stock,
}: {
  category: string | null;
  page?: number;
  query: string;
  sort: ProductSort;
  stock: ProductFilter;
}) {
  const params = new URLSearchParams();

  if (category) {
    params.set("category", category);
  }

  if (stock !== "all") {
    params.set("stock", stock);
  }

  if (sort !== "newest") {
    params.set("sort", sort);
  }

  if (query) {
    params.set("q", query);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return `${search ? `/admin?${search}` : "/admin"}#products-title`;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const params = await searchParams;
  const searchQuery = normalizedSearch(params.q);
  const activeFilter = productFilterFrom(params.stock);
  const activeCategory =
    params.category && UUID_PATTERN.test(params.category)
      ? params.category
      : null;
  const activeSort = productSortFrom(params.sort);
  const currentPage = pageFrom(params.page);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  let productsQuery = supabase
    .from("products")
    .select(
      "id,name,slug,price,is_active,in_stock,stock_quantity,category:categories!products_category_id_fkey(name)",
      { count: "exact" },
    );

  if (searchQuery) {
    productsQuery = productsQuery.or(
      `name.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`,
    );
  }

  if (activeCategory) {
    productsQuery = productsQuery.eq("category_id", activeCategory);
  }

  if (activeFilter === "active") {
    productsQuery = productsQuery
      .eq("is_active", true)
      .eq("in_stock", true)
      .or("stock_quantity.is.null,stock_quantity.gt.0");
  } else if (activeFilter === "low") {
    productsQuery = productsQuery
      .eq("is_active", true)
      .eq("in_stock", true)
      .gte("stock_quantity", 1)
      .lte("stock_quantity", 5);
  } else if (activeFilter === "out") {
    productsQuery = productsQuery
      .eq("is_active", true)
      .or("stock_quantity.eq.0,in_stock.eq.false");
  } else if (activeFilter === "inactive") {
    productsQuery = productsQuery.eq("is_active", false);
  }

  if (activeSort === "name") {
    productsQuery = productsQuery.order("name");
  } else if (activeSort === "stock") {
    productsQuery = productsQuery
      .order("stock_quantity", { ascending: true, nullsFirst: false })
      .order("name");
  } else if (activeSort === "price_low") {
    productsQuery = productsQuery.order("price", { ascending: true });
  } else if (activeSort === "price_high") {
    productsQuery = productsQuery.order("price", { ascending: false });
  } else {
    productsQuery = productsQuery.order("created_at", { ascending: false });
  }

  productsQuery = productsQuery.range(
    rangeStart,
    rangeStart + PAGE_SIZE - 1,
  );

  const [categoriesResult, productsResult, productCountResult] =
    await Promise.all([
      supabase
        .from("categories")
        .select("id,name,slug,is_active,sort_order")
        .order("sort_order")
        .order("name"),
      productsQuery,
      supabase.from("products").select("id", { count: "exact", head: true }),
    ]);

  if (
    categoriesResult.error ||
    productsResult.error ||
    productCountResult.error
  ) {
    throw new Error("Unable to load the admin catalog.");
  }

  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const products = (productsResult.data ?? []) as unknown as ProductRow[];
  const filteredProductCount = productsResult.count ?? 0;
  const totalProductCount = productCountResult.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(filteredProductCount / PAGE_SIZE));

  if ((!products.length && currentPage > 1) || currentPage > pageCount) {
    redirect(
      catalogHref({
        category: activeCategory,
        query: searchQuery,
        sort: activeSort,
        stock: activeFilter,
      }),
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Image
          className="admin-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={180}
          height={144}
          priority
        />
        <div className="admin-header-title">
          <span>Адмін-панель</span>
          <strong>Каталог</strong>
        </div>
        <Link className="icon-button" href="/account" title="До акаунта">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До акаунта</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="catalog" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Керування магазином</p>
              <h1>Каталог товарів</h1>
            </div>
            <dl className="admin-counts">
              <div>
                <dt>Категорій</dt>
                <dd>{categories.length}</dd>
              </div>
              <div>
                <dt>Товарів</dt>
                <dd>{totalProductCount}</dd>
              </div>
            </dl>
          </header>

          <section className="admin-section" aria-labelledby="categories-title">
            <div className="admin-section-title">
              <FolderTree aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="categories-title">Категорії</h2>
            </div>
            <div className="admin-workspace">
              <div className="admin-tool">
                <h3>Нова категорія</h3>
                <CategoryForm />
              </div>
              <div className="admin-list" aria-label="Список категорій">
                {categories.length ? (
                  categories.map((category) => (
                    <div className="admin-list-row" key={category.id}>
                      <div>
                        <strong>{category.name}</strong>
                        <span>/{category.slug}</span>
                      </div>
                      <div className="admin-list-actions">
                        <span
                          className={
                            category.is_active
                              ? "admin-state admin-state-active"
                              : "admin-state"
                          }
                        >
                          {category.is_active ? "Активна" : "Прихована"}
                        </span>
                        <Link
                          className="admin-row-button"
                          href={`/admin/categories/${category.id}`}
                          title={`Редагувати ${category.name}`}
                        >
                          <Pencil aria-hidden size={16} strokeWidth={1.8} />
                          <span className="sr-only">
                            Редагувати {category.name}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty">
                    <FolderTree aria-hidden size={24} strokeWidth={1.6} />
                    <p>Категорій поки немає</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="admin-section" aria-labelledby="products-title">
            <div className="admin-section-title">
              <PackageOpen aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="products-title">Товари</h2>
            </div>
            <div className="admin-catalog-controls">
              <div className="admin-catalog-control-row">
                <form
                  action="/admin#products-title"
                  aria-label="Пошук товарів"
                  className="admin-order-search"
                  method="get"
                >
                  {activeFilter !== "all" ? (
                    <input
                      name="stock"
                      type="hidden"
                      value={activeFilter}
                    />
                  ) : null}
                  {activeCategory ? (
                    <input
                      name="category"
                      type="hidden"
                      value={activeCategory}
                    />
                  ) : null}
                  {activeSort !== "newest" ? (
                    <input name="sort" type="hidden" value={activeSort} />
                  ) : null}
                  <label>
                    <span className="sr-only">Назва або slug товару</span>
                    <input
                      autoComplete="off"
                      defaultValue={searchQuery}
                      maxLength={80}
                      name="q"
                      placeholder="Назва або slug товару"
                      type="search"
                    />
                  </label>
                  <button title="Знайти товар" type="submit">
                    <Search aria-hidden size={17} strokeWidth={1.8} />
                    <span className="sr-only">Знайти товар</span>
                  </button>
                  {searchQuery ? (
                    <Link
                      href={catalogHref({
                        category: activeCategory,
                        query: "",
                        sort: activeSort,
                        stock: activeFilter,
                      })}
                      title="Очистити пошук"
                    >
                      <X aria-hidden size={17} strokeWidth={1.8} />
                      <span className="sr-only">Очистити пошук</span>
                    </Link>
                  ) : null}
                </form>

                <form
                  action="/admin#products-title"
                  aria-label="Категорія та сортування товарів"
                  className="admin-catalog-selectors"
                  method="get"
                >
                  {searchQuery ? (
                    <input name="q" type="hidden" value={searchQuery} />
                  ) : null}
                  {activeFilter !== "all" ? (
                    <input
                      name="stock"
                      type="hidden"
                      value={activeFilter}
                    />
                  ) : null}
                  <label>
                    <span className="sr-only">Категорія товарів</span>
                    <select
                      aria-label="Категорія товарів"
                      defaultValue={activeCategory ?? ""}
                      name="category"
                    >
                      <option value="">Усі категорії</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className="sr-only">Сортування товарів</span>
                    <select
                      aria-label="Сортування товарів"
                      defaultValue={activeSort}
                      name="sort"
                    >
                      {PRODUCT_SORTS.map((sort) => (
                        <option key={sort.value} value={sort.value}>
                          {sort.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button title="Застосувати фільтри" type="submit">
                    <SlidersHorizontal
                      aria-hidden
                      size={17}
                      strokeWidth={1.8}
                    />
                    <span className="sr-only">Застосувати фільтри</span>
                  </button>
                </form>
              </div>

              <nav
                aria-label="Фільтр товарів"
                className="admin-order-filters admin-catalog-filters"
              >
                {PRODUCT_FILTERS.map((filter) => (
                  <Link
                    aria-current={
                      activeFilter === filter.value ? "page" : undefined
                    }
                    href={catalogHref({
                      category: activeCategory,
                      query: searchQuery,
                      sort: activeSort,
                      stock: filter.value,
                    })}
                    key={filter.value}
                  >
                    {filter.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="admin-workspace admin-product-workspace">
              <div className="admin-tool">
                <h3>Новий товар</h3>
                <ProductForm
                  categories={categories.map(({ id, name }) => ({ id, name }))}
                />
              </div>
              <div className="admin-list" aria-label="Список товарів">
                {products.length ? (
                  products.map((product) => (
                    <div className="admin-list-row" key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <span>
                          {product.category?.name ?? "Без категорії"} ·{" "}
                          {priceFormatter.format(product.price)} ·{" "}
                          {product.stock_quantity === null
                            ? "без обліку залишку"
                            : `${product.stock_quantity} шт.`}
                        </span>
                      </div>
                      <div className="admin-list-actions">
                        <span
                          className={
                            product.is_active &&
                            product.in_stock &&
                            product.stock_quantity !== 0
                              ? "admin-state admin-state-active"
                              : "admin-state"
                          }
                        >
                          {product.is_active &&
                          product.in_stock &&
                          product.stock_quantity !== 0
                            ? "У продажу"
                            : "Неактивний"}
                        </span>
                        <QuickStockForm
                          expectedStock={product.stock_quantity}
                          productId={product.id}
                          productName={product.name}
                        />
                        <Link
                          className="admin-row-button"
                          href={`/admin/products/${product.id}`}
                          title={`Редагувати ${product.name}`}
                        >
                          <Pencil aria-hidden size={16} strokeWidth={1.8} />
                          <span className="sr-only">
                            Редагувати {product.name}
                          </span>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="admin-empty">
                    <PackageOpen aria-hidden size={24} strokeWidth={1.6} />
                    <p>
                      {searchQuery ||
                      activeCategory ||
                      activeFilter !== "all"
                        ? "За вибраними умовами товарів не знайдено"
                        : "Товарів поки немає"}
                    </p>
                  </div>
                )}
                <div className="admin-order-results">
                  <span>Знайдено: {filteredProductCount}</span>
                  {pageCount > 1 ? (
                    <nav aria-label="Сторінки товарів">
                      {currentPage > 1 ? (
                        <Link
                          href={catalogHref({
                            category: activeCategory,
                            page: currentPage - 1,
                            query: searchQuery,
                            sort: activeSort,
                            stock: activeFilter,
                          })}
                          title="Попередня сторінка"
                        >
                          <ArrowLeft
                            aria-hidden
                            size={17}
                            strokeWidth={1.8}
                          />
                          <span className="sr-only">Попередня сторінка</span>
                        </Link>
                      ) : (
                        <span aria-hidden className="is-disabled">
                          <ArrowLeft size={17} strokeWidth={1.8} />
                        </span>
                      )}
                      <strong>
                        {currentPage} / {pageCount}
                      </strong>
                      {currentPage < pageCount ? (
                        <Link
                          href={catalogHref({
                            category: activeCategory,
                            page: currentPage + 1,
                            query: searchQuery,
                            sort: activeSort,
                            stock: activeFilter,
                          })}
                          title="Наступна сторінка"
                        >
                          <ArrowRight
                            aria-hidden
                            size={17}
                            strokeWidth={1.8}
                          />
                          <span className="sr-only">Наступна сторінка</span>
                        </Link>
                      ) : (
                        <span aria-hidden className="is-disabled">
                          <ArrowRight size={17} strokeWidth={1.8} />
                        </span>
                      )}
                    </nav>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
