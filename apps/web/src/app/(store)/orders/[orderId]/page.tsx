import { CheckCircle2, PackageOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import { publicMediaUrl } from "../../../../lib/media-url";

export const metadata: Metadata = {
  title: "Замовлення створено - DreamShop",
  robots: {
    follow: false,
    index: false,
  },
};

type OrderItem = {
  id: string;
  product_image_object_key: string | null;
  product_name: string;
  product_slug: string | null;
  quantity: number;
  unit_price: number;
};

type Order = {
  customer_first_name: string;
  customer_last_name: string;
  delivery_city: string;
  delivery_details: string;
  delivery_method: string;
  id: string;
  items: OrderItem[];
  order_number: number;
  payment_method: string;
  status: string;
  total: number;
};

type OrderPageProps = {
  params: Promise<{ orderId: string }>;
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
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

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    redirect(`/auth?next=${encodeURIComponent(`/orders/${orderId}`)}`);
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,order_number,status,total,customer_first_name,customer_last_name,delivery_city,delivery_method,delivery_details,payment_method,items:order_items(id,product_name,product_slug,product_image_object_key,unit_price,quantity)",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const order = data as unknown as Order;

  return (
    <main className="store-main order-page">
      <section className="order-confirmation" aria-labelledby="order-title">
        <CheckCircle2 aria-hidden size={42} strokeWidth={1.7} />
        <p>Замовлення №{order.order_number}</p>
        <h1 id="order-title">Дякуємо, замовлення прийнято</h1>
        <span>
          Ми зв’яжемося з вами, якщо для відправлення потрібне уточнення.
        </span>
      </section>

      <div className="order-layout">
        <section className="order-items" aria-labelledby="order-items-title">
          <h2 id="order-items-title">Склад замовлення</h2>
          {order.items.map((item) => {
            const content = (
              <>
                <span className="order-item-media">
                  {item.product_image_object_key ? (
                    <Image
                      alt=""
                      fill
                      sizes="64px"
                      src={publicMediaUrl(item.product_image_object_key)}
                    />
                  ) : (
                    <PackageOpen aria-hidden size={22} strokeWidth={1.4} />
                  )}
                </span>
                <span className="order-item-copy">
                  <strong>{item.product_name}</strong>
                  <small>
                    {item.quantity} × {priceFormatter.format(item.unit_price)}
                  </small>
                </span>
                <b>
                  {priceFormatter.format(item.unit_price * item.quantity)}
                </b>
              </>
            );

            return item.product_slug ? (
              <Link
                className="order-item"
                href={`/product/${item.product_slug}`}
                key={item.id}
              >
                {content}
              </Link>
            ) : (
              <div className="order-item" key={item.id}>
                {content}
              </div>
            );
          })}
        </section>

        <aside className="order-details">
          <h2>Деталі</h2>
          <dl>
            <div>
              <dt>Одержувач</dt>
              <dd>
                {order.customer_first_name} {order.customer_last_name}
              </dd>
            </div>
            <div>
              <dt>Доставка</dt>
              <dd>
                {deliveryLabels[order.delivery_method] ?? order.delivery_method}
                <br />
                {order.delivery_city}, {order.delivery_details}
              </dd>
            </div>
            <div>
              <dt>Оплата</dt>
              <dd>
                {paymentLabels[order.payment_method] ?? order.payment_method}
              </dd>
            </div>
            <div>
              <dt>Разом</dt>
              <dd>
                <strong>{priceFormatter.format(order.total)}</strong>
              </dd>
            </div>
          </dl>
          <Link className="store-primary-action" href="/catalog">
            Повернутися до каталогу
          </Link>
        </aside>
      </div>
    </main>
  );
}
