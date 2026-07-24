import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "../../../components/storefront/checkout-form";
import { createClient } from "../../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Оформлення замовлення - DreamShop",
  robots: {
    follow: false,
    index: false,
  },
};

type Profile = {
  first_name: string;
  last_name: string | null;
  phone: string | null;
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth?next=/checkout");
  }

  const { data } = await supabase
    .from("profiles")
    .select("first_name,last_name,phone")
    .eq("id", userId)
    .maybeSingle();
  const profile = data as Profile | null;

  return (
    <main className="store-main checkout-page">
      <div className="catalog-heading">
        <p>Останній крок</p>
        <h1>Оформлення замовлення</h1>
        <span>Вкажіть одержувача та зручний спосіб доставки.</span>
      </div>

      <CheckoutForm
        initialProfile={{
          firstName: profile?.first_name ?? "",
          lastName: profile?.last_name ?? "",
          phone: profile?.phone ?? "",
        }}
      />
    </main>
  );
}
