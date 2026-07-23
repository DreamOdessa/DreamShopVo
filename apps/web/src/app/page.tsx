import Image from "next/image";

import { ResetLegacyCaches } from "./reset-legacy-caches";

export default function MaintenancePage() {
  return (
    <main className="maintenance-page">
      <ResetLegacyCaches />
      <section className="maintenance-content" aria-labelledby="maintenance-title">
        <Image
          className="brand-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={520}
          height={416}
          priority
        />
        <div className="maintenance-status">Технічні роботи</div>
        <h1 id="maintenance-title">Магазин тимчасово недоступний</h1>
        <p className="maintenance-description">
          Ми оновлюємо DreamShop, переносимо каталог і готуємо швидший та
          зручніший сайт. Повернемося зовсім скоро.
        </p>
        <p className="maintenance-note">Дякуємо за розуміння та довіру.</p>
        <footer>DreamShop, Одеса</footer>
      </section>
    </main>
  );
}
