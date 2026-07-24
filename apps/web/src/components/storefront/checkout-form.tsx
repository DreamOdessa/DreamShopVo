"use client";

import { LoaderCircle, PackageOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { createOrder } from "../../app/(store)/checkout/actions";
import { initialCheckoutState } from "../../app/(store)/checkout/checkout-state";
import { cartSubtotal } from "../../lib/cart";
import { useCart } from "./cart-provider";
import { NovaPoshtaFields } from "./nova-poshta-fields";

type CheckoutFormProps = {
  apiUrl: string;
  initialAddress: {
    city: string;
    deliveryDetails: string;
    deliveryMethod: "address" | "post_office" | "schedule" | "taxi";
    establishmentName: string;
    isPrivatePerson: boolean;
  } | null;
  initialProfile: {
    firstName: string;
    lastName: string;
    phone: string;
  };
};

const priceFormatter = new Intl.NumberFormat("uk-UA", {
  currency: "UAH",
  maximumFractionDigits: 2,
  style: "currency",
});

export function CheckoutForm({
  apiUrl,
  initialAddress,
  initialProfile,
}: CheckoutFormProps) {
  const { clear, hydrated, items } = useCart();
  const [state, formAction, pending] = useActionState(
    createOrder,
    initialCheckoutState,
  );
  const router = useRouter();

  useEffect(() => {
    if (state.status === "success" && state.orderId) {
      clear();
      router.replace(`/orders/${state.orderId}`);
    }
  }, [clear, router, state.orderId, state.status]);

  if (!hydrated) {
    return <div className="cart-loading" aria-label="Завантаження кошика" />;
  }

  if (!items.length) {
    return (
      <section className="cart-empty checkout-empty">
        <PackageOpen aria-hidden size={38} strokeWidth={1.4} />
        <h2>Немає товарів для оформлення</h2>
        <p>Спочатку додайте хоча б один товар до кошика.</p>
        <Link className="store-primary-action" href="/catalog">
          Перейти до каталогу
        </Link>
      </section>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <form action={formAction} className="checkout-layout">
      <input
        name="items"
        type="hidden"
        value={JSON.stringify(
          items.map(({ id, quantity }) => ({
            productId: id,
            quantity,
          })),
        )}
      />

      <div className="checkout-fields">
        <section className="checkout-section" aria-labelledby="recipient-title">
          <div className="checkout-section-heading">
            <span>1</span>
            <h2 id="recipient-title">Одержувач</h2>
          </div>
          <div className="checkout-field-grid">
            <label className="checkout-field">
              <span>Ім’я</span>
              <input
                autoComplete="given-name"
                defaultValue={initialProfile.firstName}
                maxLength={80}
                minLength={2}
                name="firstName"
                required
              />
            </label>
            <label className="checkout-field">
              <span>Прізвище</span>
              <input
                autoComplete="family-name"
                defaultValue={initialProfile.lastName}
                maxLength={80}
                minLength={2}
                name="lastName"
                required
              />
            </label>
            <label className="checkout-field checkout-field-wide">
              <span>Телефон</span>
              <input
                autoComplete="tel"
                defaultValue={initialProfile.phone}
                inputMode="tel"
                maxLength={22}
                name="phone"
                placeholder="+380..."
                required
                type="tel"
              />
            </label>
          </div>
        </section>

        <section className="checkout-section" aria-labelledby="delivery-title">
          <div className="checkout-section-heading">
            <span>2</span>
            <h2 id="delivery-title">Доставка</h2>
          </div>
          <div className="checkout-field-grid">
            <NovaPoshtaFields
              apiUrl={apiUrl}
              initialAddress={initialAddress}
            />
            <label className="checkout-field checkout-field-wide">
              <span>Назва закладу (необов’язково)</span>
              <input
                defaultValue={initialAddress?.establishmentName ?? ""}
                maxLength={160}
                name="establishmentName"
              />
            </label>
            <label className="checkout-check">
              <input
                defaultChecked={initialAddress?.isPrivatePerson ?? true}
                name="isPrivatePerson"
                type="checkbox"
              />
              <span>Приватна особа</span>
            </label>
            <label className="checkout-check">
              <input defaultChecked name="saveAddress" type="checkbox" />
              <span>Зберегти дані доставки</span>
            </label>
          </div>
        </section>

        <section className="checkout-section" aria-labelledby="payment-title">
          <div className="checkout-section-heading">
            <span>3</span>
            <h2 id="payment-title">Оплата та коментар</h2>
          </div>
          <div className="checkout-field-grid">
            <label className="checkout-field checkout-field-wide">
              <span>Спосіб оплати</span>
              <select defaultValue="cash_on_delivery" name="paymentMethod">
                <option value="cash_on_delivery">Післяплата</option>
                <option value="card_on_delivery">Карткою при отриманні</option>
                <option value="bank_transfer">Переказ на рахунок</option>
                <option disabled value="card_online">
                  Онлайн карткою (скоро)
                </option>
              </select>
            </label>
            <label className="checkout-field checkout-field-wide">
              <span>Коментар (необов’язково)</span>
              <textarea maxLength={1000} name="note" rows={3} />
            </label>
            <label className="checkout-check">
              <input name="contactForClarification" type="checkbox" />
              <span>Зателефонувати для уточнення</span>
            </label>
          </div>
        </section>
      </div>

      <aside className="cart-summary checkout-summary">
        <h2>Ваше замовлення</h2>
        <ul className="checkout-item-list">
          {items.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>
                {priceFormatter.format(item.price * item.quantity)}
              </strong>
            </li>
          ))}
        </ul>
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

        <div
          aria-live="polite"
          className={`checkout-message checkout-message-${state.status}`}
          role={state.status === "error" ? "alert" : "status"}
        >
          {state.message}
        </div>

        <button
          className="store-primary-action"
          disabled={pending}
          type="submit"
        >
          {pending ? (
            <LoaderCircle aria-hidden className="auth-spinner" size={18} />
          ) : null}
          Підтвердити замовлення
        </button>
        <Link className="cart-continue" href="/cart">
          Повернутися до кошика
        </Link>
      </aside>
    </form>
  );
}
