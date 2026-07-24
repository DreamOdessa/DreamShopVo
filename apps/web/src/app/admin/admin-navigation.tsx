import { PackageOpen, ShoppingBag } from "lucide-react";
import Link from "next/link";

type AdminNavigationProps = {
  active: "catalog" | "orders";
};

export function AdminNavigation({ active }: AdminNavigationProps) {
  return (
    <nav aria-label="Адміністративна навігація" className="admin-nav">
      <Link aria-current={active === "catalog" ? "page" : undefined} href="/admin">
        <PackageOpen aria-hidden size={18} strokeWidth={1.8} />
        Каталог
      </Link>
      <Link
        aria-current={active === "orders" ? "page" : undefined}
        href="/admin/orders"
      >
        <ShoppingBag aria-hidden size={18} strokeWidth={1.8} />
        Замовлення
      </Link>
    </nav>
  );
}
