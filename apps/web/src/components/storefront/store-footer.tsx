import Image from "next/image";

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-footer-inner">
        <Image
          className="store-footer-logo"
          src="/logo-name.PNG"
          alt="DreamShop"
          width={180}
          height={144}
        />
        <p>Фруктові чипси та натуральні смаколики. Одеса.</p>
        <span>© {new Date().getFullYear()} DreamShop</span>
      </div>
    </footer>
  );
}
