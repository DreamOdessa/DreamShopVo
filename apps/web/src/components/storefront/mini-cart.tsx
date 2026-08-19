"use client";

import { Minus, PackageOpen, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { publicMediaUrl } from "../../lib/media-url";
import { useCart } from "./cart-provider";

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export function MiniCart() {
  const { closeMiniCart, hydrated, items, miniCartOpen, removeItem, updateQuantity } = useCart();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!miniCartOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMiniCart();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeMiniCart, miniCartOpen]);

  return (
    <>
      <button
        aria-label="Закрити кошик"
        className={`mini-cart-overlay${miniCartOpen ? " is-open" : ""}`}
        onClick={closeMiniCart}
        tabIndex={miniCartOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-hidden={!miniCartOpen}
        aria-labelledby="mini-cart-title"
        aria-modal="true"
        className={`mini-cart${miniCartOpen ? " is-open" : ""}`}
        id="store-mini-cart"
        role="dialog"
      >
        <header>
          <div><ShoppingBag aria-hidden size={21} /><h2 id="mini-cart-title">Ваш кошик</h2></div>
          <button aria-label="Закрити кошик" onClick={closeMiniCart} ref={closeButtonRef} type="button"><X aria-hidden size={21} /></button>
        </header>

        {!hydrated ? <p className="mini-cart-empty">Завантажуємо кошик…</p> : null}
        {hydrated && !items.length ? (
          <div className="mini-cart-empty"><PackageOpen aria-hidden size={36} /><strong>Кошик порожній</strong><span>Додайте товари з каталогу — вони зʼявляться тут.</span><Link href="/catalog" onClick={closeMiniCart}>Перейти до каталогу</Link></div>
        ) : null}
        {hydrated && items.length ? (
          <>
            <div className="mini-cart-items">
              {items.map((item) => (
                <article className="mini-cart-item" key={item.id}>
                  <Link className="mini-cart-media" href={`/product/${item.slug}`} onClick={closeMiniCart}>
                    {item.imageObjectKey ? <Image alt={item.name} fill sizes="72px" src={publicMediaUrl(item.imageObjectKey)} /> : <PackageOpen aria-hidden size={25} />}
                  </Link>
                  <div className="mini-cart-copy">
                    <Link href={`/product/${item.slug}`} onClick={closeMiniCart}>{item.name}</Link>
                    <strong>{priceFormatter.format(item.price * item.quantity)}</strong>
                    <div className="mini-cart-quantity" aria-label={`Кількість ${item.name}`}>
                      <button aria-label="Зменшити кількість" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.id, item.quantity - 1)} type="button"><Minus aria-hidden size={15} /></button>
                      <output aria-label={`Кількість: ${item.quantity}`}>{item.quantity}</output>
                      <button aria-label="Збільшити кількість" disabled={!item.inStock || item.quantity >= (item.stockQuantity ?? 99)} onClick={() => updateQuantity(item.id, item.quantity + 1)} type="button"><Plus aria-hidden size={15} /></button>
                    </div>
                  </div>
                  <button aria-label={`Видалити ${item.name} з кошика`} className="mini-cart-remove" onClick={() => removeItem(item.id)} type="button"><Trash2 aria-hidden size={17} /></button>
                </article>
              ))}
            </div>
            <footer>
              <div><span>Разом</span><strong>{priceFormatter.format(total)}</strong></div>
              <Link className="store-primary-action" href="/checkout" onClick={closeMiniCart}>Оформити замовлення</Link>
              <Link href="/cart" onClick={closeMiniCart}>Переглянути кошик</Link>
            </footer>
          </>
        ) : null}
      </aside>
    </>
  );
}
