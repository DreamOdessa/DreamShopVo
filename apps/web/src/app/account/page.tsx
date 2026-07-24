import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "../auth/actions";
import { createClient } from "../../lib/supabase/server";

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

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("first_name,last_name,email,phone,role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load the authenticated profile.");
  }

  const profile = data as Profile | null;

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
            <Link
              aria-label="Адмін-панель"
              className="icon-button"
              href="/admin"
              title="Адмін-панель"
            >
              <LayoutDashboard aria-hidden size={20} strokeWidth={1.8} />
            </Link>
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
      </section>
    </main>
  );
}
