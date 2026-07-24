import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StoreNotFound() {
  return (
    <main className="store-main">
      <div className="catalog-empty catalog-error">
        <h1>Сторінку не знайдено</h1>
        <p>Товар або категорія більше недоступні.</p>
        <Link href="/catalog">
          <ArrowLeft aria-hidden size={18} strokeWidth={1.8} />
          До каталогу
        </Link>
      </div>
    </main>
  );
}
