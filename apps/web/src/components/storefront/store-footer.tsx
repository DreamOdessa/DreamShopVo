import Image from "next/image";
import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <Image
          className="store-footer-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={180}
          height={144}
        />
        <p>Фруктові чипси та натуральні смаколики. Одеса.</p>
        <nav aria-label="Навігація у підвалі" className="store-footer-nav">
          <Link href="/">Головна</Link>
          <Link href="/catalog">Каталог</Link>
          <Link href="/wishlist">Обране</Link>
          <Link href="/account">Акаунт</Link>
        </nav>
        <span className="store-footer-copyright">© {new Date().getFullYear()} DreamShop</span>
      </div>
    </footer>
  );
}
