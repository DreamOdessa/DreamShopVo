import type { Metadata } from "next";

import { StoreInfoPage } from "../../../components/storefront/store-info-page";

export const metadata: Metadata = { description: "Контакти магазину DreamShop в Одесі.", title: "Контакти" };

export default function ContactsPage() {
  return (
    <StoreInfoPage eyebrow="Звʼязок" intro="Допоможемо з вибором товарів, замовленням та співпрацею." title="Контакти">
      <section><h2>Телефон</h2><p><a href="tel:+380939097484">+380 (93) 909-74-84</a></p></section>
      <section><h2>Електронна пошта</h2><p><a href="mailto:dream.shop.odessa.dl@gmail.com">dream.shop.odessa.dl@gmail.com</a></p></section>
      <section><h2>Місто</h2><p>Одеса, Україна. Відправлення замовлень по всій країні.</p></section>
    </StoreInfoPage>
  );
}
