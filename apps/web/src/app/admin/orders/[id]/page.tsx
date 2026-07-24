import { ArrowLeft, Clock3, PackageOpen, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getAdminContext } from "../../../../lib/auth/admin";
import { publicMediaUrl } from "../../../../lib/media-url";
import {
  isOrderStatus,
  orderStatusLabels,
  type OrderStatus,
} from "../../../../lib/orders";

import { AdminNavigation } from "../../admin-navigation";
import { OrderStatusForm } from "../order-status-form";

export const metadata: Metadata = {
  title: "Деталі замовлення - DreamShop Admin",
  robots: {
    follow: false,
    index: false,
  },
};

type AdminOrderPageProps = {
  params: Promise<{ id: string }>;
};

type OrderItem = {
  id: string;
  product_image_object_key: string | null;
  product_name: string;
  quantity: number;
  unit_price: number;
};

type HistoryItem = {
  created_at: string;
  id: number;
  status: OrderStatus;
};

type Order = {
  contact_for_clarification: boolean;
  created_at: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_note: string | null;
  customer_phone: string;
  delivery_city: string;
  delivery_details: string;
  delivery_method: string;
  establishment_name: string | null;
  id: string;
  is_private_person: boolean;
  items: OrderItem[];
  order_number: number;
  payment_method: string;
  status: OrderStatus;
  subtotal: number;
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

const deliveryLabels: Record<string, string> = {
  address: "Адресна доставка",
  post_office: "Відділення пошти",
  schedule: "За розкладом",
  taxi: "Таксі",
};

const paymentLabels: Record<string, string> = {
  bank_transfer: "Переказ на рахунок",
  card_on_delivery: "Карткою при отриманні",
  card_online: "Онлайн карткою",
  cash_on_delivery: "Післяплата",
};

export default async function AdminOrderPage({
  params,
}: AdminOrderPageProps) {
  const { isAdmin, supabase, userId } = await getAdminContext();

  if (!userId) {
    redirect("/auth");
  }

  if (!isAdmin) {
    redirect("/account");
  }

  const { id } = await params;
  const [orderResult, historyResult] = await Promise.all([
    supabase
      .from("orders")
      .select(
        "id,order_number,status,subtotal,total,customer_first_name,customer_last_name,customer_phone,delivery_city,delivery_method,delivery_details,establishment_name,is_private_person,payment_method,contact_for_clarification,customer_note,created_at,items:order_items(id,product_name,product_image_object_key,unit_price,quantity)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("order_status_history")
      .select("id,status,created_at")
      .eq("order_id", id)
      .order("created_at"),
  ]);

  if (orderResult.error || !orderResult.data) {
    notFound();
  }

  if (historyResult.error) {
    throw new Error("Unable to load order history.");
  }

  const order = orderResult.data as unknown as Order;
  const history = (historyResult.data ?? []).filter(
    (item): item is HistoryItem => isOrderStatus(item.status),
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
          <strong>Замовлення №{order.order_number}</strong>
        </div>
        <Link className="icon-button" href="/admin/orders" title="До замовлень">
          <ArrowLeft aria-hidden size={20} strokeWidth={1.8} />
          <span className="sr-only">До замовлень</span>
        </Link>
      </header>

      <div className="admin-layout">
        <AdminNavigation active="orders" />

        <div className="admin-content">
          <header className="admin-page-heading">
            <div>
              <p>{dateFormatter.format(new Date(order.created_at))}</p>
              <h1>Замовлення №{order.order_number}</h1>
            </div>
            <span
              className={`admin-order-status admin-order-status-${order.status}`}
            >
              {orderStatusLabels[order.status]}
            </span>
          </header>

          <div className="admin-order-detail-grid">
            <div>
              <section className="admin-section" aria-labelledby="order-items">
                <div className="admin-section-title">
                  <PackageOpen aria-hidden size={21} strokeWidth={1.8} />
                  <h2 id="order-items">Товари</h2>
                </div>
                <div className="admin-order-items">
                  {order.items.map((item) => (
                    <div className="admin-order-item" key={item.id}>
                      <span className="admin-order-item-media">
                        {item.product_image_object_key ? (
                          <Image
                            alt=""
                            fill
                            sizes="58px"
                            src={publicMediaUrl(item.product_image_object_key)}
                          />
                        ) : (
                          <PackageOpen
                            aria-hidden
                            size={21}
                            strokeWidth={1.4}
                          />
                        )}
                      </span>
                      <span>
                        <strong>{item.product_name}</strong>
                        <small>
                          {item.quantity} ×{" "}
                          {priceFormatter.format(item.unit_price)}
                        </small>
                      </span>
                      <b>
                        {priceFormatter.format(
                          item.unit_price * item.quantity,
                        )}
                      </b>
                    </div>
                  ))}
                  <div className="admin-order-total">
                    <span>Разом</span>
                    <strong>{priceFormatter.format(order.total)}</strong>
                  </div>
                </div>
              </section>

              <section className="admin-section" aria-labelledby="customer-info">
                <div className="admin-section-title">
                  <UserRound aria-hidden size={21} strokeWidth={1.8} />
                  <h2 id="customer-info">Одержувач і доставка</h2>
                </div>
                <dl className="admin-order-details">
                  <div>
                    <dt>Одержувач</dt>
                    <dd>
                      {order.customer_first_name} {order.customer_last_name}
                    </dd>
                  </div>
                  <div>
                    <dt>Телефон</dt>
                    <dd>
                      <a href={`tel:${order.customer_phone}`}>
                        {order.customer_phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Доставка</dt>
                    <dd>
                      {deliveryLabels[order.delivery_method] ??
                        order.delivery_method}
                    </dd>
                  </div>
                  <div>
                    <dt>Місто та адреса</dt>
                    <dd>
                      {order.delivery_city}, {order.delivery_details}
                    </dd>
                  </div>
                  <div>
                    <dt>Оплата</dt>
                    <dd>
                      {paymentLabels[order.payment_method] ??
                        order.payment_method}
                    </dd>
                  </div>
                  {order.establishment_name ? (
                    <div>
                      <dt>Заклад</dt>
                      <dd>{order.establishment_name}</dd>
                    </div>
                  ) : null}
                  {order.customer_note ? (
                    <div className="admin-order-details-wide">
                      <dt>Коментар</dt>
                      <dd>{order.customer_note}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            </div>

            <aside className="admin-order-sidebar">
              <section>
                <h2>Змінити статус</h2>
                <OrderStatusForm orderId={order.id} status={order.status} />
              </section>
              <section>
                <h2>
                  <Clock3 aria-hidden size={18} strokeWidth={1.8} />
                  Історія
                </h2>
                <ol className="admin-order-history">
                  {history.map((item) => (
                    <li key={item.id}>
                      <strong>{orderStatusLabels[item.status]}</strong>
                      <span>
                        {dateFormatter.format(new Date(item.created_at))}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
