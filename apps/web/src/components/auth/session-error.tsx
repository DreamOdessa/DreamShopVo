"use client";

import { LogIn, RotateCcw } from "lucide-react";

import { resetBrokenSession } from "../../app/auth/actions";

type SessionErrorProps = {
  area: "account" | "admin";
  reset: () => void;
};

export function SessionError({ area, reset }: SessionErrorProps) {
  const nextPath = area === "admin" ? "/admin/dashboard" : "/account";

  return (
    <main className="session-error-page">
      <section aria-labelledby="session-error-title" className="session-error-content">
        <p>{area === "admin" ? "Адмін-панель" : "Мій акаунт"}</p>
        <h1 id="session-error-title">Не вдалося завантажити дані</h1>
        <span>
          Сесія могла застаріти. Спочатку повторіть запит, а якщо помилка
          залишиться — увійдіть повторно.
        </span>
        <div className="session-error-actions">
          <button onClick={reset} type="button">
            <RotateCcw aria-hidden size={18} strokeWidth={1.8} />
            Повторити
          </button>
          <form action={resetBrokenSession}>
            <input name="next" type="hidden" value={nextPath} />
            <button type="submit">
              <LogIn aria-hidden size={18} strokeWidth={1.8} />
              Увійти повторно
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
