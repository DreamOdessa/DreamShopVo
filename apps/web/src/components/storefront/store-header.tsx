import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function StoreHeader() {
  return (
    <header className="store-header">
      <div className="store-header-inner">
        <Link className="store-logo-link" href="/catalog" aria-label="DreamShop">
          <Image
            className="store-logo"
            src="/logo-name.PNG"
            alt="DreamShop"
            width={180}
            height={144}
            priority
          />
        </Link>

        <nav className="store-primary-nav" aria-label="Основна навігація">
          <Link href="/catalog">Каталог</Link>
        </nav>

        <Link className="icon-button" href="/account" title="Мій акаунт">
          <CircleUserRound aria-hidden size={21} strokeWidth={1.8} />
          <span className="sr-only">Мій акаунт</span>
        </Link>
      </div>
    </header>
  );
}
