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
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { createClient } from "../../lib/supabase/client";
import { CartLink } from "./cart-link";

type StoreHeaderShellProps = {
  wishlistCount: number;
};

export function StoreHeaderShell({ wishlistCount }: StoreHeaderShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentWishlistCount, setCurrentWishlistCount] =
    useState(wishlistCount);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const menuOverlayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const refreshWishlistCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { count } = await supabase
        .from("wishlist_items")
        .select("product_id", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (mounted) setCurrentWishlistCount(count ?? 0);
    };
    const onWishlistUpdated = () => {
      void refreshWishlistCount();
    };

    void refreshWishlistCount();
    window.addEventListener("dreamshop:wishlist-updated", onWishlistUpdated);

    return () => {
      mounted = false;
      window.removeEventListener("dreamshop:wishlist-updated", onWishlistUpdated);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const page = mobileNavigationRef.current?.parentElement;
    const backgroundElements = page
      ? Array.from(page.children).filter(
          (element) =>
            element !== mobileNavigationRef.current &&
            element !== menuOverlayRef.current,
        )
      : [];
    const existingInertState = backgroundElements.map((element) => ({
      element,
      wasInert: element.hasAttribute("inert"),
    }));

    document.body.style.overflow = "hidden";
    backgroundElements.forEach((element) => element.setAttribute("inert", ""));

    const focusableMenuElements = () =>
      Array.from(
        mobileNavigationRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuToggleRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = focusableMenuElements();
      const firstElement = focusableElements.at(0);
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    const focusFrame = window.requestAnimationFrame(() => {
      focusableMenuElements().at(0)?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      existingInertState.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute("inert");
      });
      window.removeEventListener("keydown", closeOnEscape);
      window.cancelAnimationFrame(focusFrame);
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuToggleRef.current?.focus());
  }, []);

  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
      return;
    }

    setMenuOpen(true);
  }, [closeMenu, menuOpen]);

  return (
    <>
      <header className="store-header">
        <div className="store-header-inner">
          <button
            aria-controls="store-mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
            className="store-menu-toggle"
            onClick={toggleMenu}
            ref={menuToggleRef}
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
              className="store-logo-icon"
              src="/small-icon.png"
              alt=""
              aria-hidden
              width={70}
              height={40}
              priority
            />
            <span>DreamShop</span>
          </Link>

          <nav className="store-primary-nav" aria-label="Основна навігація">
            <Link aria-current={pathname === "/" ? "page" : undefined} href="/">
              Головна
            </Link>
            <Link
              aria-current={pathname.startsWith("/catalog") ? "page" : undefined}
              href="/catalog"
            >
              Каталог
            </Link>
          </nav>

          <div className="store-header-actions">
            <Link
              aria-label={
                currentWishlistCount
                  ? `Обране: ${currentWishlistCount} товарів`
                  : "Обране"
              }
              className="icon-button wishlist-link"
              href="/wishlist"
              title="Обране"
            >
              <Heart aria-hidden size={20} strokeWidth={1.8} />
              {currentWishlistCount ? (
                <span aria-hidden className="wishlist-count">
                  {currentWishlistCount > 99 ? "99+" : currentWishlistCount}
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

      <a className="skip-link" href="#main-content">
        Перейти до основного вмісту
      </a>

      <button
        aria-label="Закрити меню"
        className={`store-menu-overlay${menuOpen ? " is-open" : ""}`}
        onClick={closeMenu}
        ref={menuOverlayRef}
        tabIndex={menuOpen ? 0 : -1}
        type="button"
      />
      <aside
        aria-hidden={!menuOpen}
        aria-labelledby="store-mobile-navigation-title"
        aria-modal="true"
        className={`store-mobile-nav${menuOpen ? " is-open" : ""}`}
        id="store-mobile-navigation"
        ref={mobileNavigationRef}
        role="dialog"
      >
        <div className="store-mobile-nav-brand">
          <Image
            src="/small-icon.png"
            alt=""
            aria-hidden
            width={70}
            height={40}
            loading="eager"
          />
          <strong id="store-mobile-navigation-title">DreamShop</strong>
          <button
            aria-label="Закрити меню"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
            type="button"
          >
            <X aria-hidden size={22} />
          </button>
        </div>
        <Link
          aria-current={pathname === "/" ? "page" : undefined}
          href="/"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <Home aria-hidden size={19} />
          Головна
        </Link>
        <Link
          aria-current={pathname.startsWith("/catalog") ? "page" : undefined}
          href="/catalog"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
        >
          <LayoutGrid aria-hidden size={19} />
          Каталог
        </Link>
        <Link href="/wishlist" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <Heart aria-hidden size={19} />
          Обране
          {currentWishlistCount ? <span>{currentWishlistCount}</span> : null}
        </Link>
        <Link href="/account" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          <CircleUserRound aria-hidden size={19} />
          Мій акаунт
        </Link>
      </aside>
    </>
  );
}
