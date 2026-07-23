import { LogOut, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

import { signOut } from "../auth/actions";
import { createClient } from "../../lib/supabase/server";

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
        <form action={signOut}>
          <button aria-label="Вийти" className="icon-button" title="Вийти" type="submit">
            <LogOut aria-hidden size={20} strokeWidth={1.8} />
          </button>
        </form>
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
            Email підтверджено
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
      </section>
    </main>
  );
}
