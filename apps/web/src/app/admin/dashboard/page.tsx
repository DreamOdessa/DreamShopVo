import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminContext } from "../../../lib/auth/admin";
import {
  isOrderStatus,
  orderStatusLabels,
  type OrderStatus,
} from "../../../lib/orders";

import { AdminNavigation } from "../admin-navigation";

export const metadata: Metadata = {
  title: "Огляд - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type DashboardSummary = {
  customer_count: number;
  low_stock_count: number;
  orders_30d_count: number;
  out_of_stock_count: number;
  pending_order_count: number;
  processing_order_count: number;
  revenue_30d: number;
};

type RecentOrder = {
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  delivery_city: string;
  id: string;
  order_number: number;
  status: OrderStatus;
  total: number;
};

type StockProduct = {
  category: { name: string } | null;
  id: string;
  in_stock: boolean;
  name: string;
  stock_quantity: number | null;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeZone: "Europe/Kyiv",
});

export default async function AdminDashboardPage() {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const [summaryResult, ordersResult, stockResult] = await Promise.all([
    supabase.rpc("get_admin_dashboard_summary"),
    supabase
      .from("orders")
      .select(
        "id,order_number,status,total,customer_first_name,customer_last_name,delivery_city,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("products")
      .select(
        "id,name,in_stock,stock_quantity,category:categories!products_category_id_fkey(name)",
      )
      .eq("is_active", true)
      .or("stock_quantity.lte.5,in_stock.eq.false")
      .order("stock_quantity", { ascending: true, nullsFirst: true })
      .limit(8),
  ]);

  if (summaryResult.error || ordersResult.error || stockResult.error) {
    throw new Error("Unable to load the admin dashboard.");
  }

  const summary = (summaryResult.data?.[0] ?? {
    customer_count: 0,
    low_stock_count: 0,
    orders_30d_count: 0,
    out_of_stock_count: 0,
    pending_order_count: 0,
    processing_order_count: 0,
    revenue_30d: 0,
  }) as DashboardSummary;
  const recentOrders = (ordersResult.data ?? [])
    .filter((order) => isOrderStatus(order.status))
    .map((order) => order as RecentOrder);
  const stockProducts = (stockResult.data ?? []) as unknown as StockProduct[];
  const attentionCount =
    Number(summary.low_stock_count) + Number(summary.out_of_stock_count);

  const metrics = [
    {
      href: "/admin/orders?status=pending",
      label: "Нові замовлення",
      value: summary.pending_order_count,
    },
    {
      href: "/admin/orders?status=processing",
      label: "В обробці",
      value: summary.processing_order_count,
    },
    {
      href: "/admin/orders",
      label: "За 30 днів",
      value: summary.orders_30d_count,
    },
    {
      label: "Виторг за 30 днів",
      value: priceFormatter.format(Number(summary.revenue_30d)),
    },
    {
      href: "/admin/customers",
      label: "Клієнтів",
      value: summary.customer_count,
    },
    {
      href: "#inventory-attention",
      label: "Залишки: увага",
      value: attentionCount,
    },
  ];

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
          <strong>Огляд</strong>
        </div>
        <Link className="icon-button" href="/account" title="До акаунта">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До акаунта</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="dashboard" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>Керування магазином</p>
              <h1>Огляд роботи</h1>
            </div>
          </header>

          <dl className="admin-dashboard-metrics">
            {metrics.map((metric) => {
              const content = (
                <>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </>
              );

              return metric.href ? (
                <Link href={metric.href} key={metric.label}>
                  {content}
                </Link>
              ) : (
                <div key={metric.label}>{content}</div>
              );
            })}
          </dl>

          <div className="admin-dashboard-grid">
            <section aria-labelledby="recent-orders-title">
              <header className="admin-dashboard-section-heading">
                <div>
                  <ShoppingBag aria-hidden size={20} strokeWidth={1.7} />
                  <h2 id="recent-orders-title">Останні замовлення</h2>
                </div>
                <Link href="/admin/orders">
                  Усі замовлення
                  <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
                </Link>
              </header>

              <div className="admin-dashboard-orders">
                {recentOrders.length ? (
                  recentOrders.map((order) => (
                    <article
                      className="admin-dashboard-order-row"
                      key={order.id}
                    >
                      <div>
                        <strong>№{order.order_number}</strong>
                        <span>
                          {dateFormatter.format(new Date(order.created_at))}
                        </span>
                      </div>
                      <div>
                        <strong>
                          {order.customer_first_name} {order.customer_last_name}
                        </strong>
                        <span>{order.delivery_city}</span>
                      </div>
                      <div>
                        <strong>{priceFormatter.format(order.total)}</strong>
                        <span
                          className={`admin-order-status admin-order-status-${order.status}`}
                        >
                          {orderStatusLabels[order.status]}
                        </span>
                      </div>
                      <Link
                        className="admin-row-button"
                        href={`/admin/orders/${order.id}`}
                        title={`Відкрити замовлення №${order.order_number}`}
                      >
                        <ArrowUpRight
                          aria-hidden
                          size={17}
                          strokeWidth={1.8}
                        />
                        <span className="sr-only">
                          Відкрити замовлення №{order.order_number}
                        </span>
                      </Link>
                    </article>
                  ))
                ) : (
                  <div className="admin-empty">
                    <ShoppingBag aria-hidden size={25} strokeWidth={1.5} />
                    <p>Замовлень поки немає</p>
                  </div>
                )}
              </div>
            </section>

            <section
              aria-labelledby="inventory-attention-title"
              id="inventory-attention"
            >
              <header className="admin-dashboard-section-heading">
                <div>
                  <AlertTriangle aria-hidden size={20} strokeWidth={1.7} />
                  <h2 id="inventory-attention-title">Контроль залишків</h2>
                </div>
                <Link href="/admin">
                  Каталог
                  <ArrowRight aria-hidden size={16} strokeWidth={1.8} />
                </Link>
              </header>

              <div className="admin-inventory-list">
                {stockProducts.length ? (
                  stockProducts.map((product) => {
                    const isOut =
                      !product.in_stock || product.stock_quantity === 0;

                    return (
                      <article className="admin-inventory-row" key={product.id}>
                        <div>
                          <strong>{product.name}</strong>
                          <span>{product.category?.name ?? "Без категорії"}</span>
                        </div>
                        <span
                          className={
                            isOut
                              ? "admin-stock-state is-out"
                              : "admin-stock-state"
                          }
                        >
                          {isOut
                            ? "Немає"
                            : `${product.stock_quantity ?? 0} шт.`}
                        </span>
                        <Link
                          className="admin-row-button"
                          href={`/admin/products/${product.id}`}
                          title={`Редагувати ${product.name}`}
                        >
                          <ArrowUpRight
                            aria-hidden
                            size={16}
                            strokeWidth={1.8}
                          />
                          <span className="sr-only">
                            Редагувати {product.name}
                          </span>
                        </Link>
                      </article>
                    );
                  })
                ) : (
                  <div className="admin-empty">
                    <PackageSearch aria-hidden size={25} strokeWidth={1.5} />
                    <p>Критичних залишків немає</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
