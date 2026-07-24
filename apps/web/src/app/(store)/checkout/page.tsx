import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CheckoutForm } from "../../../components/storefront/checkout-form";
import { getApiUrl } from "../../../lib/env";
import { createClient } from "../../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Оформлення замовлення - DreamShop",
  robots: {
    follow: false,
    index: false,
  },
};

type Profile = {
  contact_phone: string | null;
  first_name: string;
  last_name: string | null;
  phone: string | null;
};

type SavedAddress = {
  city: string;
  delivery_details: string;
  delivery_method: "address" | "post_office" | "schedule" | "taxi";
  establishment_name: string | null;
  first_name: string;
  is_private_person: boolean;
  last_name: string;
  phone: string;
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth?next=/checkout");
  }

  const [profileResult, addressResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name,last_name,phone,contact_phone")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("customer_addresses")
      .select(
        "first_name,last_name,phone,city,delivery_method,delivery_details,establishment_name,is_private_person",
      )
      .eq("user_id", userId)
      .eq("is_default", true)
      .maybeSingle(),
  ]);

  if (profileResult.error || addressResult.error) {
    throw new Error("Unable to load checkout details.");
  }

  const profile = profileResult.data as Profile | null;
  const address = addressResult.data as SavedAddress | null;

  return (
    <main className="store-main checkout-page">
      <div className="catalog-heading">
        <p>Останній крок</p>
        <h1>Оформлення замовлення</h1>
        <span>Вкажіть одержувача та зручний спосіб доставки.</span>
      </div>

      <CheckoutForm
        apiUrl={getApiUrl()}
        initialAddress={
          address
            ? {
                city: address.city,
                deliveryDetails: address.delivery_details,
                deliveryMethod: address.delivery_method,
                establishmentName: address.establishment_name ?? "",
                isPrivatePerson: address.is_private_person,
              }
            : null
        }
        initialProfile={{
          firstName: address?.first_name ?? profile?.first_name ?? "",
          lastName: address?.last_name ?? profile?.last_name ?? "",
          phone:
            address?.phone ??
            profile?.contact_phone ??
            profile?.phone ??
            "",
        }}
      />
    </main>
  );
}
