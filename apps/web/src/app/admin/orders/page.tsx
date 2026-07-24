import { ArrowLeft, ArrowUpRight, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

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
  searchParams: Promise<{ status?: string }>;
};

type OrderRow = {
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  delivery_city: string;
  id: string;
  items: Array<{ id: string }> | null;
  order_number: number;
  status: OrderStatus;
  total: number;
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
  let ordersQuery = supabase
    .from("orders")
    .select(
      "id,order_number,status,total,customer_first_name,customer_last_name,customer_phone,delivery_city,created_at,items:order_items(id)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (activeStatus) {
    ordersQuery = ordersQuery.eq("status", activeStatus);
  }

  const [ordersResult, ...countResults] = await Promise.all([
    ordersQuery,
    ...ORDER_STATUSES.map((status) =>
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", status),
    ),
  ]);

  if (
    ordersResult.error ||
    countResults.some((result) => Boolean(result.error))
  ) {
    throw new Error("Unable to load orders.");
  }

  const orders = (ordersResult.data ?? []) as unknown as OrderRow[];
  const statusCounts = Object.fromEntries(
    ORDER_STATUSES.map((status, index) => [
      status,
      countResults[index]?.count ?? 0,
    ]),
  ) as Record<OrderStatus, number>;

  const totalOrders = Object.values(statusCounts).reduce(
    (total, count) => total + count,
    0,
  );

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
                <dt>Усього</dt>
                <dd>{totalOrders}</dd>
              </div>
              <div>
                <dt>Нових</dt>
                <dd>{statusCounts.pending}</dd>
              </div>
            </dl>
          </header>

          <nav className="admin-order-filters" aria-label="Фільтр замовлень">
            <Link aria-current={!activeStatus ? "page" : undefined} href="/admin/orders">
              Усі <span>{totalOrders}</span>
            </Link>
            {ORDER_STATUSES.map((status) => (
              <Link
                aria-current={activeStatus === status ? "page" : undefined}
                href={`/admin/orders?status=${status}`}
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
                    <span>Позицій: {order.items?.length ?? 0}</span>
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
                <p>Замовлень із таким статусом немає</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
