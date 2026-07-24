import type { Metadata } from "next";

import { CartPageContent } from "../../../components/storefront/cart-page-content";

export const metadata: Metadata = {
  title: "Кошик - DreamShop",
  robots: {
    follow: false,
    index: false,
  },
};

export default function CartPage() {
  return (
    <main className="store-main cart-page">
      <CartPageContent />
    </main>
  );
}
