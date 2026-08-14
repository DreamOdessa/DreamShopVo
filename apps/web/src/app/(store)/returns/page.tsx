import type { Metadata } from "next";

import { StoreInfoPage } from "../../../components/storefront/store-info-page";

export const metadata: Metadata = { description: "Умови повернення та обміну товарів DreamShop.", title: "Повернення та обмін" };

export default function ReturnsPage() {
  return (
    <StoreInfoPage eyebrow="Покупцям" intro="Якщо із замовленням щось не так, звʼяжіться з нами якомога швидше." title="Повернення та обмін">
      <section><h2>Перевірка замовлення</h2><p>Огляньте пакування та товари під час отримання. У разі пошкодження зафіксуйте його у відділенні перевізника.</p></section>
      <section><h2>Харчові товари</h2><p>Можливість повернення залежить від стану товару, цілісності пакування та вимог законодавства України щодо харчової продукції.</p></section>
      <section><h2>Звернення</h2><p>Напишіть нам на dream.shop.odessa.dl@gmail.com, додайте номер замовлення, опис ситуації та фотографії.</p></section>
    </StoreInfoPage>
  );
}
