import { CheckCircle2, CircleX, PackageOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "../../../../lib/supabase/server";
import { MAX_CART_QUANTITY, type CartItem } from "../../../../lib/cart";
import { publicMediaUrl } from "../../../../lib/media-url";
import {
  isOrderStatus,
  orderStatusLabels,
  type OrderStatus,
} from "../../../../lib/orders";
import { CancelOrderForm } from "./cancel-order-form";
import { RepeatOrderButton } from "../../../../components/storefront/repeat-order-button";

type CurrentProduct = {
  id: string;
  in_stock: boolean;
  is_active: boolean;
  media: Array<{
    object_key: string;
    sort_order: number;
  }> | null;
  name: string;
  price: number;
  slug: string;
  stock_quantity: number | null;
};

export const metadata: Metadata = {
  title: "Замовлення - DreamShop",
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
  product: CurrentProduct | null;
  quantity: number;
  unit_price: number;
};

type Order = {
  customer_first_name: string;
  customer_last_name: string;
  delivery_city: string;
  delivery_details: string;
  delivery_method: string;
  delivery_amount: number;
  discount_amount: number;
  id: string;
  items: OrderItem[];
  order_number: number;
  payment_method: string;
  status: OrderStatus;
  subtotal: number;
  tracking_number: string | null;
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

const orderHeadings: Record<OrderStatus, string> = {
  cancelled: "Замовлення скасовано",
  delivered: "Замовлення доставлено",
  pending: "Дякуємо, замовлення прийнято",
  processing: "Замовлення в обробці",
  shipped: "Замовлення відправлено",
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
      "id,order_number,status,subtotal,discount_amount,delivery_amount,total,customer_first_name,customer_last_name,delivery_city,delivery_method,delivery_details,payment_method,tracking_number,items:order_items(id,product_name,product_slug,product_image_object_key,unit_price,quantity,product:products!order_items_product_id_fkey(id,name,slug,price,in_stock,stock_quantity,is_active,media:product_media(object_key,sort_order)))",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const order = data as unknown as Order;

  if (!isOrderStatus(order.status)) {
    notFound();
  }

  const repeatItems = order.items.flatMap((item): CartItem[] => {
    const product = item.product;

    if (
      !product ||
      !product.is_active ||
      !product.in_stock ||
      product.stock_quantity === 0
    ) {
      return [];
    }

    const quantity = Math.min(
      item.quantity,
      product.stock_quantity ?? MAX_CART_QUANTITY,
      MAX_CART_QUANTITY,
    );

    if (quantity < 1) {
      return [];
    }

    const mainImage = product.media?.find(
      ({ sort_order }) => sort_order === 0,
    );

    return [
      {
        id: product.id,
        imageObjectKey: mainImage?.object_key ?? null,
        inStock: true,
        name: product.name,
        price: product.price,
        quantity,
        slug: product.slug,
        stockQuantity: product.stock_quantity,
      },
    ];
  });
  const unavailableItemCount = order.items.length - repeatItems.length;

  return (
    <main className="store-main order-page">
      <section
        className={`order-confirmation order-confirmation-${order.status}`}
        aria-labelledby="order-title"
      >
        {order.status === "cancelled" ? (
          <CircleX aria-hidden size={42} strokeWidth={1.7} />
        ) : (
          <CheckCircle2 aria-hidden size={42} strokeWidth={1.7} />
        )}
        <p>Замовлення №{order.order_number}</p>
        <h1 id="order-title">{orderHeadings[order.status]}</h1>
        <span
          className={`account-order-status account-order-status-${order.status}`}
        >
          {orderStatusLabels[order.status]}
        </span>
        <span className="order-confirmation-note">
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
            {order.tracking_number ? (
              <div>
                <dt>ТТН Нової пошти</dt>
                <dd className="order-tracking-number">
                  {order.tracking_number}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Товари</dt>
              <dd>{priceFormatter.format(order.subtotal)}</dd>
            </div>
            {order.discount_amount > 0 ? (
              <div className="order-discount">
                <dt>Знижка</dt>
                <dd>-{priceFormatter.format(order.discount_amount)}</dd>
              </div>
            ) : null}
            {order.delivery_amount > 0 ? (
              <div>
                <dt>Доставка</dt>
                <dd>{priceFormatter.format(order.delivery_amount)}</dd>
              </div>
            ) : null}
            <div>
              <dt>Разом</dt>
              <dd>
                <strong>{priceFormatter.format(order.total)}</strong>
              </dd>
            </div>
          </dl>
          {order.status === "pending" ? (
            <CancelOrderForm
              orderId={order.id}
              orderNumber={order.order_number}
            />
          ) : null}
          <RepeatOrderButton
            items={repeatItems}
            unavailableItemCount={unavailableItemCount}
          />
          <Link className="store-primary-action" href="/catalog">
            Повернутися до каталогу
          </Link>
        </aside>
      </div>
    </main>
  );
}
