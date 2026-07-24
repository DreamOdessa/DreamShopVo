import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  PackageOpen,
  Percent,
  UserRound,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAdminContext } from "../../../../lib/auth/admin";
import { isTelegramAuthEmail } from "../../../../lib/auth/telegram";
import {
  isOrderStatus,
  orderStatusLabels,
  type OrderStatus,
} from "../../../../lib/orders";

import { AdminNavigation } from "../../admin-navigation";
import { CustomerDiscountForm } from "../customer-discount-form";

export const metadata: Metadata = {
  title: "Клієнт - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type AdminCustomerPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
};

type Customer = {
  contact_phone: string | null;
  created_at: string;
  discount_percent: number;
  email: string | null;
  first_name: string;
  id: string;
  last_name: string | null;
  phone: string | null;
  role: "admin" | "customer" | "tester";
};

type CustomerAddress = {
  city: string;
  delivery_details: string;
  delivery_method: "address" | "post_office" | "schedule" | "taxi";
  establishment_name: string | null;
  first_name: string;
  id: string;
  is_default: boolean;
  label: string;
  last_name: string;
  phone: string;
};

type CustomerOrder = {
  created_at: string;
  delivery_city: string;
  discount_amount: number;
  id: string;
  items: Array<{ id: string }> | null;
  order_number: number;
  status: OrderStatus;
  total: number;
};

type CustomerSummary = {
  delivered_order_count: number;
  delivered_total: number;
  discount_total: number;
  last_order_at: string | null;
  order_count: number;
};

const PAGE_SIZE = 20;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeZone: "Europe/Kyiv",
});

const deliveryLabels: Record<CustomerAddress["delivery_method"], string> = {
  address: "Адресна доставка",
  post_office: "Нова пошта",
  schedule: "За розкладом",
  taxi: "Таксі",
};

function pageFrom(value?: string) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function customerHref(customerId: string, page?: number) {
  return page && page > 1
    ? `/admin/customers/${customerId}?page=${page}`
    : `/admin/customers/${customerId}`;
}

export default async function AdminCustomerPage({
  params,
  searchParams,
}: AdminCustomerPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const query = await searchParams;
  const currentPage = pageFrom(query.page);
  const rangeStart = (currentPage - 1) * PAGE_SIZE;
  const [profileResult, addressesResult, ordersResult, summaryResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(
          "id,first_name,last_name,email,phone,contact_phone,discount_percent,role,created_at",
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("customer_addresses")
        .select(
          "id,label,first_name,last_name,phone,city,delivery_method,delivery_details,establishment_name,is_default",
        )
        .eq("user_id", id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase
        .from("orders")
        .select(
          "id,order_number,status,total,discount_amount,delivery_city,created_at,items:order_items(id)",
          { count: "exact" },
        )
        .eq("user_id", id)
        .order("created_at", { ascending: false })
        .range(rangeStart, rangeStart + PAGE_SIZE - 1),
      supabase.rpc("get_admin_customer_summary", {
        p_user_id: id,
      }),
    ]);

  if (
    profileResult.error ||
    addressesResult.error ||
    ordersResult.error ||
    summaryResult.error
  ) {
    throw new Error("Unable to load customer details.");
  }

  if (!profileResult.data || profileResult.data.role === "admin") {
    notFound();
  }

  const customer = profileResult.data as unknown as Customer;
  const addresses = (addressesResult.data ?? []) as CustomerAddress[];
  const orders = (ordersResult.data ?? [])
    .filter((order) => isOrderStatus(order.status))
    .map((order) => order as unknown as CustomerOrder);
  const summary = (summaryResult.data?.[0] ?? {
    delivered_order_count: 0,
    delivered_total: 0,
    discount_total: 0,
    last_order_at: null,
    order_count: 0,
  }) as CustomerSummary;
  const orderCount = ordersResult.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(orderCount / PAGE_SIZE));

  if (!orders.length && currentPage > 1) {
    redirect(customerHref(id));
  }

  const email = isTelegramAuthEmail(customer.email) ? null : customer.email;
  const phone = customer.contact_phone ?? customer.phone;

  return (
    <main className="admin-page">
      <header className="admin-header">
        <Image
          alt="DreamShop"
          className="admin-logo"
          height={144}
          priority
          src="/logo-name.PNG"
          width={180}
        />
        <div className="admin-header-title">
          <span>Адмін-панель</span>
          <strong>Картка клієнта</strong>
        </div>
        <Link
          className="icon-button"
          href="/admin/customers"
          title="До клієнтів"
        >
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До клієнтів</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="customers" />

        <div className="admin-content">
          <header className="admin-page-heading admin-customer-heading">
            <div>
              <p>
                {customer.role === "tester" ? "Тестер" : "Клієнт"} з{" "}
                {dateFormatter.format(new Date(customer.created_at))}
              </p>
              <h1>
                {customer.first_name} {customer.last_name ?? ""}
              </h1>
            </div>
            <dl className="admin-counts admin-customer-summary">
              <div>
                <dt>Замовлень</dt>
                <dd>{summary.order_count}</dd>
              </div>
              <div>
                <dt>Доставлено</dt>
                <dd>{summary.delivered_order_count}</dd>
              </div>
              <div>
                <dt>Сплачено</dt>
                <dd>{priceFormatter.format(summary.delivered_total)}</dd>
              </div>
              <div>
                <dt>Заощаджено</dt>
                <dd>{priceFormatter.format(summary.discount_total)}</dd>
              </div>
            </dl>
          </header>

          <div className="admin-customer-detail-grid">
            <div>
              <section className="admin-section" aria-labelledby="customer-info">
                <div className="admin-section-title">
                  <UserRound aria-hidden size={21} strokeWidth={1.8} />
                  <h2 id="customer-info">Контактні дані</h2>
                </div>
                <dl className="admin-order-details">
                  <div>
                    <dt>Телефон</dt>
                    <dd>
                      {phone ? <a href={`tel:${phone}`}>{phone}</a> : "Не вказано"}
                    </dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      {email ? (
                        <a href={`mailto:${email}`}>{email}</a>
                      ) : customer.phone ? (
                        "Вхід через Telegram"
                      ) : (
                        "Не вказано"
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt>Останнє замовлення</dt>
                    <dd>
                      {summary.last_order_at
                        ? dateFormatter.format(new Date(summary.last_order_at))
                        : "Ще не замовляв"}
                    </dd>
                  </div>
                  <div>
                    <dt>Роль</dt>
                    <dd>{customer.role === "tester" ? "Тестер" : "Клієнт"}</dd>
                  </div>
                </dl>
              </section>

              <section
                className="admin-section"
                aria-labelledby="customer-addresses"
              >
                <div className="admin-section-title">
                  <MapPin aria-hidden size={21} strokeWidth={1.8} />
                  <h2 id="customer-addresses">Збережена доставка</h2>
                </div>
                <div className="admin-customer-addresses">
                  {addresses.length ? (
                    addresses.map((address) => (
                      <article key={address.id}>
                        <span className="admin-customer-icon">
                          <MapPin aria-hidden size={19} strokeWidth={1.6} />
                        </span>
                        <div>
                          <strong>
                            {address.label}
                            {address.is_default ? " · основна" : ""}
                          </strong>
                          <span>
                            {address.first_name} {address.last_name} ·{" "}
                            {address.phone}
                          </span>
                          <span>
                            {deliveryLabels[address.delivery_method]} ·{" "}
                            {address.city}, {address.delivery_details}
                          </span>
                          {address.establishment_name ? (
                            <span>{address.establishment_name}</span>
                          ) : null}
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="admin-empty">
                      <MapPin aria-hidden size={25} strokeWidth={1.5} />
                      <p>Клієнт ще не зберігав адресу доставки.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className="admin-customer-sidebar">
              <section>
                <h2>
                  <Percent aria-hidden size={18} strokeWidth={1.8} />
                  Персональна знижка
                </h2>
                <CustomerDiscountForm
                  customerId={customer.id}
                  discountPercent={Number(customer.discount_percent)}
                />
              </section>
            </aside>
          </div>

          <section className="admin-section" aria-labelledby="customer-orders">
            <div className="admin-section-title">
              <PackageOpen aria-hidden size={21} strokeWidth={1.8} />
              <h2 id="customer-orders">Історія замовлень</h2>
            </div>
            <div className="admin-orders-list">
              {orders.length ? (
                orders.map((order) => (
                  <article className="admin-order-row" key={order.id}>
                    <div className="admin-order-number">
                      <strong>№{order.order_number}</strong>
                      <span>{dateFormatter.format(new Date(order.created_at))}</span>
                    </div>
                    <div>
                      <strong>{order.delivery_city}</strong>
                      <span>Позицій: {order.items?.length ?? 0}</span>
                    </div>
                    <div>
                      <strong>{priceFormatter.format(order.total)}</strong>
                      <span>
                        {order.discount_amount > 0
                          ? `Знижка ${priceFormatter.format(order.discount_amount)}`
                          : "Без знижки"}
                      </span>
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
                  <PackageOpen aria-hidden size={26} strokeWidth={1.5} />
                  <p>Клієнт ще не робив замовлень.</p>
                </div>
              )}
            </div>

            {orderCount ? (
              <div className="admin-order-results">
                <span>Замовлень: {orderCount}</span>
                {pageCount > 1 ? (
                  <nav aria-label="Сторінки замовлень клієнта">
                    {currentPage > 1 ? (
                      <Link
                        href={customerHref(id, currentPage - 1)}
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
                        href={customerHref(id, currentPage + 1)}
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
          </section>
        </div>
      </div>
    </main>
  );
}
