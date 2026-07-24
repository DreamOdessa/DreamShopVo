import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
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

import { openAdmin } from "./actions";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Мій акаунт - DreamShop",
  robots: {
    index: false,
    follow: false,
  },
};

type Profile = {
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

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeZone: "Europe/Kyiv",
});

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth");
  }

  const [profileResult, ordersResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,last_name,email,phone,role")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("orders")
      .select(
        "id,order_number,status,total,created_at,items:order_items(id,product_name,quantity)",
      )
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  if (profileResult.error || ordersResult.error) {
    throw new Error("Unable to load the authenticated account.");
  }

  const profile = profileResult.data as Profile | null;
  const orders = (ordersResult.data ?? [])
    .filter((order) => isOrderStatus(order.status))
    .map((order) => order as unknown as AccountOrder);

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
            {profile?.phone && !profile.email
              ? "Telegram підтверджено"
              : "Email підтверджено"}
          </span>
        </div>

        <dl className="account-details">
          <div>
            <dt>Email</dt>
            <dd>{profile?.email ?? "Не вказано"}</dd>
          </div>
          <div>
            <dt>Телефон</dt>
            <dd>{profile?.phone ?? "Не додано"}</dd>
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
            firstName={profile?.first_name ?? ""}
            lastName={profile?.last_name ?? ""}
          />
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
