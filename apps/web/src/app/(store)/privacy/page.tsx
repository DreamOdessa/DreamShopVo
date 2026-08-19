import type { Metadata } from "next";

import { StoreInfoPage } from "../../../components/storefront/store-info-page";

export const metadata: Metadata = { description: "Основні принципи обробки персональних даних у DreamShop.", title: "Політика конфіденційності" };

export default function PrivacyPage() {
  return (
    <StoreInfoPage eyebrow="Правова інформація" intro="Ми використовуємо персональні дані лише для роботи магазину, виконання замовлень і підтримки покупців." title="Політика конфіденційності">
      <section><h2>Які дані потрібні</h2><p>Імʼя, контактні дані, адреса або точка доставки, склад замовлення та технічні дані, необхідні для безпечної авторизації.</p></section>
      <section><h2>Для чого ми їх використовуємо</h2><p>Для створення й доставки замовлення, звʼязку з покупцем, роботи особистого кабінету та запобігання зловживанням.</p></section>
      <section><h2>Ваші звернення</h2><p>Питання щодо даних або запит на зміну інформації можна надіслати на dream.shop.odessa.dl@gmail.com.</p></section>
    </StoreInfoPage>
  );
}
