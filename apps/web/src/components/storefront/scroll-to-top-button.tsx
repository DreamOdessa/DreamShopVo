"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 700);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  return (
    <button
      aria-label="Повернутися на початок сторінки"
      className={`scroll-to-top${visible ? " is-visible" : ""}`}
      onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
      type="button"
    >
      <ArrowUp aria-hidden size={20} />
    </button>
  );
}
