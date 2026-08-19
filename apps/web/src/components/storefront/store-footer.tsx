import Image from "next/image";
import Link from "next/link";

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <div className="store-footer-brand">
          <Image className="store-footer-logo" src="/logo-name.PNG" alt="DreamShop" width={180} height={144} />
          <p>Фруктові чипси, сиропи та натуральні прикраси для професійної й домашньої подачі.</p>
        </div>
        <nav aria-label="Каталог у підвалі">
          <strong>Каталог</strong>
          <Link href="/catalog">Усі товари</Link>
          <Link href="/catalog/chips">Фруктові чипси</Link>
          <Link href="/catalog/syropy">Сиропи</Link>
          <Link href="/catalog/dried-flowers">Сухоцвіти</Link>
        </nav>
        <nav aria-label="Інформація у підвалі">
          <strong>Інформація</strong>
          <Link href="/about">Про нас</Link>
          <Link href="/delivery">Доставка та оплата</Link>
          <Link href="/returns">Повернення та обмін</Link>
          <Link href="/privacy">Політика конфіденційності</Link>
          <Link href="/terms">Умови використання</Link>
        </nav>
        <div className="store-footer-contacts">
          <strong>Контакти</strong>
          <span>Одеса, Україна</span>
          <a href="tel:+380939097484">+380 (93) 909-74-84</a>
          <a href="mailto:dream.shop.odessa.dl@gmail.com">dream.shop.odessa.dl@gmail.com</a>
          <Link href="/contacts">Усі контакти</Link>
        </div>
      </div>
      <div className="store-footer-bottom">© {new Date().getFullYear()} DreamShop. Всі права захищені.</div>
    </footer>
  );
}
