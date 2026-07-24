import {
  ArrowUpRight,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  LayoutDashboard,
  LogOut,
  MapPin,
  PackageOpen,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "../auth/actions";
import {
  isOrderStatus,
  orderStatusLabels,
  type OrderStatus,
} from "../../lib/orders";
import { createClient } from "../../lib/supabase/server";

import {
  markAllNotificationsRead,
  markNotificationRead,
  openAdmin,
} from "./actions";
import { DeleteAddressButton } from "./delete-address-button";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Мій акаунт - DreamShop",
  robots: {
    index: false,
    follow: false,
  },
};

type Profile = {
  contact_phone: string | null;
  email: string | null;
  first_name: string;
  last_name: string | null;
  phone: string | null;
  role: "admin" | "customer" | "tester";
};

type AccountOrder = {
  created_at: string;
  id: string;
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
  }> | null;
  order_number: number;
  status: OrderStatus;
  total: number;
};

type AccountNotification = {
  body: string;
  created_at: string;
  id: string;
  order_id: string | null;
  read_at: string | null;
  title: string;
};

type SavedAddress = {
  city: string;
  delivery_details: string;
  delivery_method: "address" | "post_office" | "schedule" | "taxi";
  first_name: string;
  id: string;
  label: string;
  last_name: string;
  phone: string;
};

const deliveryMethodLabels: Record<SavedAddress["delivery_method"], string> = {
  address: "Адресна доставка",
  post_office: "Нова пошта",
  schedule: "За розкладом",
  taxi: "Таксі",
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

const notificationDateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Kyiv",
});

function isTelegramAuthEmail(email: string | null | undefined) {
  return email?.endsWith("@auth.dreamshop.invalid") ?? false;
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth");
  }

  const [
    profileResult,
    ordersResult,
    notificationsResult,
    addressResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,last_name,email,phone,contact_phone,role")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("orders")
      .select(
        "id,order_number,status,total,created_at,items:order_items(id,product_name,quantity)",
      )
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("notifications")
      .select("id,title,body,order_id,read_at,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("customer_addresses")
      .select(
        "id,label,first_name,last_name,phone,city,delivery_method,delivery_details",
      )
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle(),
  ]);

  if (
    profileResult.error ||
    ordersResult.error ||
    notificationsResult.error ||
    addressResult.error
  ) {
    throw new Error("Unable to load the authenticated account.");
  }

  const profile = profileResult.data as Profile | null;
  const orders = (ordersResult.data ?? [])
    .filter((order) => isOrderStatus(order.status))
    .map((order) => order as unknown as AccountOrder);
  const notifications = (notificationsResult.data ??
    []) as AccountNotification[];
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read_at,
  ).length;
  const savedAddress = addressResult.data as SavedAddress | null;
  const telegramVerified =
    Boolean(profile?.phone) &&
    (!profile?.email || isTelegramAuthEmail(profile.email));
  const visibleEmail = isTelegramAuthEmail(profile?.email)
    ? null
    : profile?.email;
  const contactPhone = profile?.contact_phone ?? profile?.phone ?? "";

  return (
    <main className="account-page">
      <header className="account-header">
        <Image
          className="account-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={180}
          height={144}
          priority
        />
        <div className="account-header-actions">
          <Link
            aria-label={
              unreadNotifications
                ? `Сповіщення: ${unreadNotifications} непрочитаних`
                : "Сповіщення"
            }
            className="icon-button account-notification-link"
            href="#notifications"
            title="Сповіщення"
          >
            <Bell aria-hidden size={20} strokeWidth={1.8} />
            {unreadNotifications ? (
              <span aria-hidden className="account-notification-count">
                {unreadNotifications > 99 ? "99+" : unreadNotifications}
              </span>
            ) : null}
          </Link>
          {profile?.role === "admin" ? (
            <form action={openAdmin}>
              <button
                aria-label="Адмін-панель"
                className="icon-button"
                title="Адмін-панель"
                type="submit"
              >
                <LayoutDashboard aria-hidden size={20} strokeWidth={1.8} />
              </button>
            </form>
          ) : null}
          <form action={signOut}>
            <button
              aria-label="Вийти"
              className="icon-button"
              title="Вийти"
              type="submit"
            >
              <LogOut aria-hidden size={20} strokeWidth={1.8} />
            </button>
          </form>
        </div>
      </header>

      <section className="account-content" aria-labelledby="account-title">
        <div className="account-title-row">
          <div>
            <p className="account-eyebrow">Мій акаунт</p>
            <h1 id="account-title">
              {profile?.first_name ? `Вітаємо, ${profile.first_name}` : "Вітаємо"}
            </h1>
          </div>
          <span className="account-status">
            <ShieldCheck aria-hidden size={18} strokeWidth={1.8} />
            {telegramVerified
              ? "Telegram підтверджено"
              : visibleEmail
                ? "Email підтверджено"
                : "Акаунт підтверджено"}
          </span>
        </div>

        <dl className="account-details">
          <div>
            <dt>Email</dt>
            <dd>{visibleEmail ?? "Не вказано"}</dd>
          </div>
          <div>
            <dt>Контактний телефон</dt>
            <dd>{contactPhone || "Не додано"}</dd>
          </div>
          <div>
            <dt>Роль</dt>
            <dd>{profile?.role ?? "customer"}</dd>
          </div>
        </dl>

        <section
          className="account-profile-section"
          aria-labelledby="profile-title"
        >
          <div className="account-section-heading">
            <h2 id="profile-title">Особисті дані</h2>
            <p>Вони будуть використані для оформлення замовлень.</p>
          </div>
          <ProfileForm
            contactPhone={contactPhone}
            firstName={profile?.first_name ?? ""}
            lastName={profile?.last_name ?? ""}
          />
        </section>

        <section
          className="account-address-section"
          aria-labelledby="address-title"
        >
          <div className="account-section-heading">
            <h2 id="address-title">Збережена доставка</h2>
            <p>Основні дані для швидкого повторного замовлення.</p>
          </div>
          {savedAddress ? (
            <div className="account-address-details">
              <span className="account-address-icon">
                <MapPin aria-hidden size={20} strokeWidth={1.7} />
              </span>
              <div>
                <strong>{savedAddress.label}</strong>
                <p>
                  {savedAddress.first_name} {savedAddress.last_name} ·{" "}
                  {savedAddress.phone}
                </p>
                <p>
                  {deliveryMethodLabels[savedAddress.delivery_method]} ·{" "}
                  {savedAddress.city}, {savedAddress.delivery_details}
                </p>
              </div>
              <DeleteAddressButton addressId={savedAddress.id} />
            </div>
          ) : (
            <div className="account-address-empty">
              <MapPin aria-hidden size={25} strokeWidth={1.5} />
              <p>Дані доставки збережуться після оформлення замовлення.</p>
            </div>
          )}
        </section>

        <section
          className="account-notifications-section"
          id="notifications"
          aria-labelledby="notifications-title"
        >
          <div className="account-section-heading">
            <h2 id="notifications-title">Сповіщення</h2>
            <p>Оновлення щодо ваших замовлень.</p>
            {unreadNotifications ? (
              <form action={markAllNotificationsRead}>
                <button className="account-mark-all-button" type="submit">
                  <CheckCheck aria-hidden size={16} strokeWidth={1.8} />
                  Позначити всі прочитаними
                </button>
              </form>
            ) : null}
          </div>
          <div className="account-notifications-list">
            {notifications.length ? (
              notifications.map((notification) => (
                <article
                  className={`account-notification-row${
                    notification.read_at ? "" : " is-unread"
                  }`}
                  key={notification.id}
                >
                  <span className="account-notification-icon">
                    <Bell aria-hidden size={17} strokeWidth={1.8} />
                  </span>
                  <div className="account-notification-copy">
                    <strong>{notification.title}</strong>
                    <p>{notification.body}</p>
                    <time dateTime={notification.created_at}>
                      {notificationDateFormatter.format(
                        new Date(notification.created_at),
                      )}
                    </time>
                  </div>
                  <div className="account-notification-actions">
                    {notification.order_id ? (
                      <Link
                        className="admin-row-button"
                        href={`/orders/${notification.order_id}`}
                        title="Відкрити замовлення"
                      >
                        <ArrowUpRight
                          aria-hidden
                          size={17}
                          strokeWidth={1.8}
                        />
                        <span className="sr-only">Відкрити замовлення</span>
                      </Link>
                    ) : null}
                    {!notification.read_at ? (
                      <form action={markNotificationRead}>
                        <input
                          name="notificationId"
                          type="hidden"
                          value={notification.id}
                        />
                        <button
                          aria-label="Позначити сповіщення прочитаним"
                          className="admin-row-button"
                          title="Позначити прочитаним"
                          type="submit"
                        >
                          <Check aria-hidden size={17} strokeWidth={1.8} />
                        </button>
                      </form>
                    ) : null}
                  </div>
                </article>
              ))
            ) : (
              <div className="account-notifications-empty">
                <BellOff aria-hidden size={25} strokeWidth={1.5} />
                <p>Нових сповіщень поки немає.</p>
              </div>
            )}
          </div>
        </section>

        <section className="account-orders-section" aria-labelledby="orders-title">
          <div className="account-section-heading">
            <h2 id="orders-title">Мої замовлення</h2>
            <p>Останні замовлення та їх поточний статус.</p>
          </div>
          <div className="account-orders-list">
            {orders.length ? (
              orders.map((order) => (
                <article className="account-order-row" key={order.id}>
                  <div>
                    <strong>Замовлення №{order.order_number}</strong>
                    <span>
                      {dateFormatter.format(new Date(order.created_at))} ·{" "}
                      {order.items?.length ?? 0} позицій
                    </span>
                  </div>
                  <strong>{priceFormatter.format(order.total)}</strong>
                  <span
                    className={`account-order-status account-order-status-${order.status}`}
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                  <Link
                    className="admin-row-button"
                    href={`/orders/${order.id}`}
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
              <div className="account-orders-empty">
                <PackageOpen aria-hidden size={26} strokeWidth={1.5} />
                <p>Ви ще не робили замовлень.</p>
                <Link href="/catalog">Перейти до каталогу</Link>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
