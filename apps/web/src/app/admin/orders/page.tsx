import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Download,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  normalizedOrderSearch,
  ORDER_PERIODS,
  orderFilterParams,
  orderPeriodFrom,
  orderSearchFilter,
  orderSince,
  type OrderPeriod,
} from "../../../lib/admin/order-filters";
import { getAdminContext } from "../../../lib/auth/admin";
import {
  isOrderStatus,
  ORDER_STATUSES,
  orderStatusLabels,
  type OrderStatus,
} from "../../../lib/orders";

import { AdminNavigation } from "../admin-navigation";

export const metadata: Metadata = {
  title: "Замовлення - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type AdminOrdersPageProps = {
  searchParams: Promise<{
    page?: string;
    period?: string;
    q?: string;
    status?: string;
  }>;
};

type OrderRow = {
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  delivery_city: string;
  id: string;
  items: Array<{ count: number }> | null;
  order_number: number;
  status: OrderStatus;
  total: number;
};

type OrderStatusCountRow = {
  order_count: number | string;
  status: string;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Kyiv",
});

const PAGE_SIZE = 25;

function pageFrom(value?: string) {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

function ordersHref({
  page,
  period,
  query,
  status,
}: {
  page?: number;
  period: OrderPeriod;
  query: string;
  status: OrderStatus | null;
}) {
  const params = orderFilterParams({ period, query, status });

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();
  return search ? `/admin/orders?${search}` : "/admin/orders";
}

function exportHref({
  period,
  query,
  status,
}: {
  period: OrderPeriod;
  query: string;
  status: OrderStatus | null;
}) {
  const params = orderFilterParams({ period, query, status });
  const search = params.toString();
  return search
    ? `/admin/orders/export?${search}`
    : "/admin/orders/export";
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const params = await searchParams;
  const activeStatus =
    params.status && isOrderStatus(params.status) ? params.status : null;
  const activePeriod = orderPeriodFrom(params.period);
  const searchQuery = normalizedOrderSearch(params.q);
  const since = orderSince(activePeriod);
  const currentPage = pageFrom(params.page);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  let ordersQuery = supabase
    .from("orders")
    .select(
      "id,order_number,status,total,customer_first_name,customer_last_name,customer_phone,delivery_city,created_at,items:order_items(count)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(rangeStart, rangeStart + PAGE_SIZE - 1);

  if (activeStatus) {
    ordersQuery = ordersQuery.eq("status", activeStatus);
  }

  if (since) {
    ordersQuery = ordersQuery.gte("created_at", since);
  }

  if (searchQuery) {
    ordersQuery = ordersQuery.or(orderSearchFilter(searchQuery));
  }

  const [ordersResult, summaryResult, statusCountsResult] = await Promise.all([
    ordersQuery,
    supabase.rpc("get_admin_order_summary", {
      p_search: searchQuery || null,
      p_since: since,
      p_status: activeStatus,
    }),
    supabase.rpc("get_admin_order_status_counts", {
      p_search: searchQuery || null,
      p_since: since,
    }),
  ]);
  const fallbackCountResults = statusCountsResult.error
    ? await Promise.all(
        ORDER_STATUSES.map((status) => {
          let countQuery = supabase
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("status", status);

          if (since) {
            countQuery = countQuery.gte("created_at", since);
          }

          if (searchQuery) {
            countQuery = countQuery.or(orderSearchFilter(searchQuery));
          }

          return countQuery;
        }),
      )
    : null;

  if (currentPage > 1 && ordersResult.error?.code === "PGRST103") {
    redirect(
      ordersHref({
        period: activePeriod,
        query: searchQuery,
        status: activeStatus,
      }),
    );
  }

  if (
    ordersResult.error ||
    summaryResult.error ||
    fallbackCountResults?.some((result) => Boolean(result.error))
  ) {
    throw new Error("Unable to load orders.");
  }

  const orders = (ordersResult.data ?? []) as unknown as OrderRow[];
  const filteredOrderCount = ordersResult.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(filteredOrderCount / PAGE_SIZE));

  if (!orders.length && currentPage > 1) {
    redirect(
      ordersHref({
        period: activePeriod,
        query: searchQuery,
        status: activeStatus,
      }),
    );
  }

  const statusCounts = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0]),
  ) as Record<OrderStatus, number>;

  if (fallbackCountResults) {
    ORDER_STATUSES.forEach((status, index) => {
      statusCounts[status] = fallbackCountResults[index]?.count ?? 0;
    });
  } else {
    ((statusCountsResult.data ?? []) as OrderStatusCountRow[]).forEach((row) => {
      if (isOrderStatus(row.status)) {
        statusCounts[row.status] = Number(row.order_count ?? 0);
      }
    });
  }

  const totalOrders = Object.values(statusCounts).reduce(
    (total, count) => total + count,
    0,
  );
  const orderSummary = (summaryResult.data?.[0] ?? {
    order_count: 0,
    order_total: 0,
  }) as {
    order_count: number;
    order_total: number;
  };

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
          <strong>Замовлення</strong>
        </div>
        <Link className="icon-button" href="/account" title="До акаунта">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До акаунта</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="orders" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Керування магазином</p>
              <h1>Замовлення</h1>
            </div>
            <dl className="admin-counts">
              <div>
                <dt>У вибірці</dt>
                <dd>{orderSummary.order_count}</dd>
              </div>
              <div>
                <dt>Без скасованих</dt>
                <dd>
                  {priceFormatter.format(Number(orderSummary.order_total))}
                </dd>
              </div>
            </dl>
          </header>

          <form
            action="/admin/orders"
            aria-label="Пошук замовлень"
            className="admin-order-search"
            method="get"
          >
            {activeStatus ? (
              <input name="status" type="hidden" value={activeStatus} />
            ) : null}
            {activePeriod !== "30d" ? (
              <input name="period" type="hidden" value={activePeriod} />
            ) : null}
            <label>
              <span className="sr-only">
                Номер, телефон, ім’я або місто
              </span>
              <input
                autoComplete="off"
                defaultValue={searchQuery}
                maxLength={80}
                name="q"
                placeholder="Номер, телефон, ім’я або місто"
                type="search"
              />
            </label>
            <button title="Знайти замовлення" type="submit">
              <Search aria-hidden size={17} strokeWidth={1.8} />
              <span className="sr-only">Знайти замовлення</span>
            </button>
            {searchQuery ? (
              <Link
                href={ordersHref({
                  period: activePeriod,
                  query: "",
                  status: activeStatus,
                })}
                title="Очистити пошук"
              >
                <X aria-hidden size={17} strokeWidth={1.8} />
                <span className="sr-only">Очистити пошук</span>
              </Link>
            ) : null}
          </form>

          <div className="admin-order-tools">
            <nav
              aria-label="Період замовлень"
              className="admin-order-periods"
            >
              {ORDER_PERIODS.map((period) => (
                <Link
                  aria-current={
                    activePeriod === period.value ? "page" : undefined
                  }
                  href={ordersHref({
                    period: period.value,
                    query: searchQuery,
                    status: activeStatus,
                  })}
                  key={period.value}
                >
                  {period.label}
                </Link>
              ))}
            </nav>
            <a
              className="admin-export-button"
              download
              href={exportHref({
                period: activePeriod,
                query: searchQuery,
                status: activeStatus,
              })}
            >
              <Download aria-hidden size={16} strokeWidth={1.8} />
              CSV
            </a>
          </div>

          <nav className="admin-order-filters" aria-label="Фільтр замовлень">
            <Link
              aria-current={!activeStatus ? "page" : undefined}
              href={ordersHref({
                period: activePeriod,
                query: searchQuery,
                status: null,
              })}
            >
              Усі <span>{totalOrders}</span>
            </Link>
            {ORDER_STATUSES.map((status) => (
              <Link
                aria-current={activeStatus === status ? "page" : undefined}
                href={ordersHref({
                  period: activePeriod,
                  query: searchQuery,
                  status,
                })}
                key={status}
              >
                {orderStatusLabels[status]} <span>{statusCounts[status]}</span>
              </Link>
            ))}
          </nav>

          <section className="admin-orders-list" aria-label="Список замовлень">
            {orders.length ? (
              orders.map((order) => (
                <article className="admin-order-row" key={order.id}>
                  <div className="admin-order-number">
                    <strong>№{order.order_number}</strong>
                    <span>{dateFormatter.format(new Date(order.created_at))}</span>
                  </div>
                  <div>
                    <strong>
                      {order.customer_first_name} {order.customer_last_name}
                    </strong>
                    <span>
                      {order.customer_phone} · {order.delivery_city}
                    </span>
                  </div>
                  <div>
                    <strong>{priceFormatter.format(order.total)}</strong>
                    <span>Позицій: {order.items?.[0]?.count ?? 0}</span>
                  </div>
                  <span
                    className={`admin-order-status admin-order-status-${order.status}`}
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                  <Link
                    className="admin-row-button"
                    href={`/admin/orders/${order.id}`}
                    title={`Відкрити замовлення №${order.order_number}`}
                  >
                    <ArrowUpRight aria-hidden size={17} strokeWidth={1.8} />
                    <span className="sr-only">
                      Відкрити замовлення №{order.order_number}
                    </span>
                  </Link>
                </article>
              ))
            ) : (
              <div className="admin-empty">
                <ShoppingBag aria-hidden size={26} strokeWidth={1.5} />
                <p>
                  {searchQuery
                    ? "За вашим запитом замовлень не знайдено"
                    : "Замовлень із таким статусом немає"}
                </p>
              </div>
            )}
          </section>

          {filteredOrderCount ? (
            <div className="admin-order-results">
              <span>Знайдено: {filteredOrderCount}</span>
              {pageCount > 1 ? (
                <nav aria-label="Сторінки замовлень">
                  {currentPage > 1 ? (
                    <Link
                      href={ordersHref({
                        page: currentPage - 1,
                        period: activePeriod,
                        query: searchQuery,
                        status: activeStatus,
                      })}
                      title="Попередня сторінка"
                    >
                      <ArrowLeft aria-hidden size={17} strokeWidth={1.8} />
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
                      href={ordersHref({
                        page: currentPage + 1,
                        period: activePeriod,
                        query: searchQuery,
                        status: activeStatus,
                      })}
                      title="Наступна сторінка"
                    >
                      <ArrowRight aria-hidden size={17} strokeWidth={1.8} />
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
          ) : null}
        </div>
      </div>
    </main>
  );
}
