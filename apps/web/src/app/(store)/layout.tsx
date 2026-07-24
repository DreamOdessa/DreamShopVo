import type { ReactNode } from "react";

import { CartProvider } from "../../components/storefront/cart-provider";
import { StoreFooter } from "../../components/storefront/store-footer";
import { StoreHeader } from "../../components/storefront/store-header";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="store-page">
        <StoreHeader />
        {children}
        <StoreFooter />
      </div>
    </CartProvider>
  );
}
