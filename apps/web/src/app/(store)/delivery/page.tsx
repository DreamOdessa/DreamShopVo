import type { Metadata } from "next";

import { StoreInfoPage } from "../../../components/storefront/store-info-page";

export const metadata: Metadata = { description: "Способи доставки та оплати замовлень DreamShop.", title: "Доставка та оплата" };

export default function DeliveryPage() {
  return (
    <StoreInfoPage eyebrow="Покупцям" intro="Актуальні способи отримання та оплати доступні під час оформлення замовлення." title="Доставка та оплата">
      <section><h2>Нова пошта</h2><p>Доставка у відділення, поштомат або за адресою. Місто та точку отримання можна вибрати під час оформлення.</p></section>
      <section><h2>Оплата</h2><p>Доступна післяплата або оплата карткою при отриманні. Остаточний перелік способів показується перед підтвердженням замовлення.</p></section>
      <section><h2>Підтвердження</h2><p>Після створення замовлення ви отримаєте його номер, а статус можна перевіряти в особистому кабінеті.</p></section>
    </StoreInfoPage>
  );
}
