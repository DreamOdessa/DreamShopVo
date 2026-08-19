import type { Metadata } from "next";

import { StoreInfoPage } from "../../../components/storefront/store-info-page";

export const metadata: Metadata = {
  description: "DreamShop — натуральні фруктові чипси, сиропи та декор для напоїв з Одеси.",
  title: "Про DreamShop",
};

export default function AboutPage() {
  return (
    <StoreInfoPage eyebrow="DreamShop" intro="Створюємо натуральні продукти для красивої подачі, барної культури та щоденних смаколиків." title="Про нас">
      <section><h2>Наша ідея</h2><p>DreamShop поєднує натуральний смак із професійною подачею. Ми добираємо продукти, які зручно використовувати вдома, у кавʼярнях, ресторанах і барах.</p></section>
      <section><h2>Для кого ми працюємо</h2><p>Для людей, які цінують склад продукту, стабільну якість і виразний вигляд страв та напоїв.</p></section>
      <section><h2>Звідки ми</h2><p>Ми працюємо в Одесі та відправляємо замовлення по Україні.</p></section>
    </StoreInfoPage>
  );
}
