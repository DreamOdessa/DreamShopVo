import type { ReactNode } from "react";

type StoreInfoPageProps = {
  children: ReactNode;
  eyebrow: string;
  intro: string;
  title: string;
};

export function StoreInfoPage({ children, eyebrow, intro, title }: StoreInfoPageProps) {
  return (
    <main className="store-main store-info-page">
      <header>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{intro}</span>
      </header>
      <div className="store-info-content">{children}</div>
    </main>
  );
}
