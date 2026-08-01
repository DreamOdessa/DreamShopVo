"use client";

import {
  CircleUserRound,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CartLink } from "./cart-link";

type StoreHeaderShellProps = {
  wishlistCount: number;
};

export function StoreHeaderShell({ wishlistCount }: StoreHeaderShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="store-header">
        <div className="store-header-inner">
          <button
            aria-controls="store-mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            className="store-menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? (
              <X aria-hidden size={23} />
            ) : (
              <Menu aria-hidden size={23} />
            )}
          </button>

          <Link
            className="store-logo-link"
            href="/"
            aria-label="DreamShop, головна"
          >
            <Image
              className="store-logo"
              src="/logo-name.PNG"
              alt="DreamShop"
              width={180}
              height={144}
              priority
            />
          </Link>

          <nav className="store-primary-nav" aria-label="Основна навігація">
            <Link href="/">Головна</Link>
            <Link href="/catalog">Каталог</Link>
          </nav>

          <div className="store-header-actions">
            <Link
              aria-label={
                wishlistCount ? `Обране: ${wishlistCount} товарів` : "Обране"
              }
              className="icon-button wishlist-link"
              href="/wishlist"
              title="Обране"
            >
              <Heart aria-hidden size={20} strokeWidth={1.8} />
              {wishlistCount ? (
                <span aria-hidden className="wishlist-count">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              ) : null}
            </Link>
            <CartLink />
            <Link
              className="icon-button store-account-link"
              href="/account"
              title="Мій акаунт"
            >
              <CircleUserRound aria-hidden size={21} strokeWidth={1.8} />
              <span className="sr-only">Мій акаунт</span>
            </Link>
          </div>
        </div>
      </header>

      <button
        aria-label="Закрити меню"
        className={`store-menu-overlay${menuOpen ? " is-open" : ""}`}
        onClick={closeMenu}
        tabIndex={menuOpen ? 0 : -1}
        type="button"
      />
      <nav
        aria-label="Мобільна навігація"
        aria-hidden={!menuOpen}
        className={`store-mobile-nav${menuOpen ? " is-open" : ""}`}
        id="store-mobile-navigation"
      >
        <div className="store-mobile-nav-brand">
          <Image
            src="/logo-name.PNG"
            alt="DreamShop"
            width={160}
            height={128}
            loading="eager"
          />
          <button aria-label="Закрити меню" onClick={closeMenu} type="button">
            <X aria-hidden size={22} />
          </button>
        </div>
        <Link href="/" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <Home aria-hidden size={19} />
          Головна
        </Link>
        <Link href="/catalog" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <LayoutGrid aria-hidden size={19} />
          Каталог
        </Link>
        <Link href="/wishlist" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <Heart aria-hidden size={19} />
          Обране
          {wishlistCount ? <span>{wishlistCount}</span> : null}
        </Link>
        <Link href="/account" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <CircleUserRound aria-hidden size={19} />
          Мій акаунт
        </Link>
      </nav>
    </>
  );
}
