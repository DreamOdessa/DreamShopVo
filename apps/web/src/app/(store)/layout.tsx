import type { ReactNode } from "react";

import { CartProvider } from "../../components/storefront/cart-provider";
import { StoreFooter } from "../../components/storefront/store-footer";
import { StoreHeader } from "../../components/storefront/store-header";
import { ScrollToTopButton } from "../../components/storefront/scroll-to-top-button";
import { MiniCart } from "../../components/storefront/mini-cart";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="store-page">
        <StoreHeader />
        <MiniCart />
        {children}
        <ScrollToTopButton />
        <StoreFooter />
      </div>
    </CartProvider>
  );
}
