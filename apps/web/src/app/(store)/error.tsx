"use client";

import { RotateCcw } from "lucide-react";

export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="store-main">
      <div className="catalog-empty catalog-error">
        <h1>Не вдалося завантажити сторінку</h1>
        <p>Повторіть запит. Якщо помилка залишиться, поверніться до каталогу.</p>
        <button onClick={reset} type="button">
          <RotateCcw aria-hidden size={18} strokeWidth={1.8} />
          Повторити
        </button>
      </div>
    </main>
  );
}
