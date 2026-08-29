import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="app-not-found">
      <section className="catalog-empty catalog-error">
        <h1>Сторінку не знайдено</h1>
        <p>Посилання застаріло або такої сторінки не існує.</p>
        <Link href="/catalog">
          <ArrowLeft aria-hidden size={18} strokeWidth={1.8} />
          Перейти до каталогу
        </Link>
      </section>
    </main>
  );
}
