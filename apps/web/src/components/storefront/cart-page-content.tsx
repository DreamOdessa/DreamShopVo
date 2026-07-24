"use client";

import {
  Minus,
  PackageOpen,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cartSubtotal } from "../../lib/cart";
import { publicMediaUrl } from "../../lib/media-url";
import { useCart } from "./cart-provider";
import { useCartInventorySync } from "./use-cart-inventory-sync";

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export function CartPageContent() {
  const {
    hydrated,
    items,
    removeItem,
    updateQuantity,
  } = useCart();
  const inventory = useCartInventorySync();

  if (
    !hydrated ||
    inventory.status === "idle" ||
    inventory.status === "loading"
  ) {
    return <div className="cart-loading" aria-label="Завантаження кошика" />;
  }

  if (inventory.status === "error") {
    return (
      <section className="cart-empty" aria-labelledby="cart-sync-title">
        <RefreshCw aria-hidden size={38} strokeWidth={1.4} />
        <h1 id="cart-sync-title">Не вдалося оновити кошик</h1>
        <p>Перевірте з’єднання та спробуйте ще раз.</p>
        <button
          className="store-primary-action"
          onClick={inventory.retry}
          type="button"
        >
          <RefreshCw aria-hidden size={18} strokeWidth={1.8} />
          Спробувати ще раз
        </button>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="cart-empty" aria-labelledby="cart-title">
        <PackageOpen aria-hidden size={38} strokeWidth={1.4} />
        <h1 id="cart-title">Кошик порожній</h1>
        <p>Оберіть товари в каталозі, і вони з’являться тут.</p>
        <Link className="store-primary-action" href="/catalog">
          Перейти до каталогу
        </Link>
      </section>
    );
  }

  const subtotal = cartSubtotal(items);
  const hasUnavailableItems = items.some((item) => !item.inStock);

  return (
    <>
      <div className="catalog-heading">
        <p>Ваше замовлення</p>
        <h1>Кошик</h1>
        <span>{items.length} товарних позицій</span>
      </div>

      {inventory.changed ? (
        <p className="cart-sync-notice" role="status">
          Ціни або наявність товарів у кошику оновлено.
        </p>
      ) : null}

      <div className="cart-layout">
        <section className="cart-items" aria-label="Товари у кошику">
          {items.map((item) => (
            <article
              className={`cart-item${item.inStock ? "" : " is-unavailable"}`}
              key={item.id}
            >
              <Link
                className="cart-item-media"
                href={`/product/${item.slug}`}
                tabIndex={-1}
              >
                {item.imageObjectKey ? (
                  <Image
                    alt=""
                    fill
                    sizes="92px"
                    src={publicMediaUrl(item.imageObjectKey)}
                  />
                ) : (
                  <PackageOpen aria-hidden size={26} strokeWidth={1.4} />
                )}
              </Link>

              <div className="cart-item-copy">
                <Link href={`/product/${item.slug}`}>{item.name}</Link>
                <span>
                  {item.inStock
                    ? `${priceFormatter.format(item.price)} за одиницю`
                    : "Товар більше недоступний"}
                </span>
              </div>

              <div
                className="cart-quantity"
                aria-label={`Кількість товару ${item.name}`}
              >
                <button
                  aria-label="Зменшити кількість"
                  disabled={!item.inStock || item.quantity <= 1}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  type="button"
                >
                  <Minus aria-hidden size={16} />
                </button>
                <input
                  aria-label="Кількість"
                  inputMode="numeric"
                  max={item.stockQuantity ?? 99}
                  min={1}
                  disabled={!item.inStock}
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value))
                  }
                  type="number"
                  value={item.quantity}
                />
                <button
                  aria-label="Збільшити кількість"
                  disabled={
                    !item.inStock ||
                    item.quantity >= (item.stockQuantity ?? 99)
                  }
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  type="button"
                >
                  <Plus aria-hidden size={16} />
                </button>
              </div>

              <strong className="cart-item-total">
                {item.inStock
                  ? priceFormatter.format(item.price * item.quantity)
                  : "Недоступний"}
              </strong>

              <button
                className="cart-remove"
                onClick={() => removeItem(item.id)}
                title={`Видалити ${item.name}`}
                type="button"
              >
                <Trash2 aria-hidden size={18} strokeWidth={1.8} />
                <span className="sr-only">Видалити {item.name}</span>
              </button>
            </article>
          ))}
        </section>

        <aside className="cart-summary" aria-label="Підсумок">
          <h2>Разом</h2>
          <dl>
            <div>
              <dt>Товари</dt>
              <dd>{priceFormatter.format(subtotal)}</dd>
            </div>
            <div>
              <dt>Доставка</dt>
              <dd>За тарифами перевізника</dd>
            </div>
          </dl>
          <div className="cart-summary-total">
            <span>До сплати</span>
            <strong>{priceFormatter.format(subtotal)}</strong>
          </div>
          {hasUnavailableItems ? (
            <button className="store-primary-action" disabled type="button">
              Приберіть недоступні товари
            </button>
          ) : (
            <Link className="store-primary-action" href="/checkout">
              Оформити замовлення
            </Link>
          )}
          <Link className="cart-continue" href="/catalog">
            Продовжити покупки
          </Link>
        </aside>
      </div>
    </>
  );
}
