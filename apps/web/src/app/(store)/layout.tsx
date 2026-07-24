import type { ReactNode } from "react";

import { StoreFooter } from "../../components/storefront/store-footer";
import { StoreHeader } from "../../components/storefront/store-header";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="store-page">
      <StoreHeader />
      {children}
      <StoreFooter />
    </div>
  );
}
