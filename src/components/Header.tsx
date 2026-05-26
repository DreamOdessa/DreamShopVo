import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAdmin } from '../contexts/AdminContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiGrid, FiLogOut, FiChevronDown } from 'react-icons/fi';
import NotificationBell from './NotificationBell';
import NotificationsDrawer from './NotificationsDrawer';
import GoogleLogin from './GoogleLogin';
import CategorySidebar from './CategorySidebar';
import { useCategorySidebar } from '../contexts/CategorySidebarContext';
import SideCartDrawer from './SideCartDrawer';

const HeaderContainer = styled.header`
  background: linear-gradient(to bottom, rgba(21, 139, 157, 0.96) 0%, rgba(47, 174, 194, 0.92) 62%, rgba(91, 219, 232, 0.78) 100%);
  color: white;
  padding: clamp(0.7rem, 1.7vw, 1.1rem) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 18px rgba(18, 73, 86, 0.18);
  backdrop-filter: blur(12px);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2.5vw, 2rem);
  position: relative;
  min-height: clamp(3.5rem, 8vw, 4.4rem);
  
  /* На десктопе растягиваем элементы с равномерными промежутками */
  @media (min-width: 769px) {
    gap: clamp(1rem, 3vw, 3rem);
  }
  
  /* ИЗМЕНЕНО: Убрали justify-content: center для мобильных */
`;

const Logo = styled(Link)`
  /* ИЗМЕНЕНО: Размер шрифта стал крупнее на минимуме */
  font-size: clamp(1.1rem, 4vw, 2rem);
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  /* ИЗМЕНЕНО: Отступ стал крупнее на минимуме */
  gap: clamp(0.25rem, 1vw, 0.5rem);
  
  /* На десктопе логотип занимает фиксированное место слева */
  @media (min-width: 769px) {
    flex-shrink: 0;
    min-width: fit-content;
  }

  /* ИЗМЕНЕНО: Логотип теперь (order: 2) на мобильных, чтобы быть в центре */
  @media (max-width: 768px) {
    order: 2;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    flex-shrink: 0;
    z-index: 2;
    gap: 0.4rem;
  }
`;

const LogoIcon = styled.div`
  /* ИЗМЕНЕНО: Clamp() теперь не позволяет лого быть "масюской". Мин. ~34px. */
  width: clamp(2.8rem, 8vw, 4rem);
  height: clamp(2.8rem, 8vw, 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: clamp(3.2rem, 12vw, 4.25rem);
    height: clamp(3.2rem, 12vw, 4.25rem);
  }
`;

const LogoText = styled.span`
  /* ИЗМЕНЕНО: Удален @media (max-width: 280px) { display: none; } 
     Логотип_текст больше не прячется.
  */
  @media (max-width: 320px) {
    /* На очень маленьких экранах можно скрыть, чтобы не ломать layout */
    display: none;
  }

  @media (max-width: 420px) {
    font-size: clamp(0.95rem, 4vw, 1.15rem);
  }
`;

/* ── Десктоп-навигация (только внутри хедера, только на десктопе) ── */
const DesktopNav = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    gap: clamp(0.5rem, 2vw, 2rem);
    flex: 1;
    justify-content: center;
    max-width: 60%;
  }
`;

/* ── Десктоп-кнопки (только внутри хедера, только на десктопе) ── */
const DesktopUserActions = styled.div`
  display: none;

  @media (min-width: 769px) {
    display: flex;
    align-items: center;
    gap: clamp(0.5rem, 1.5vw, 1.5rem);
    justify-content: flex-end;
    flex-shrink: 0;
  }
`;

/* ── Мобильный дравер (ВЫНЕСЕН за пределы хедера → root stacking context) ──
   position: fixed здесь работает относительно viewport, а z-index: 1200
   действует от корня документа, а не от хедера (z-index 100) */
const NavLinks = styled.div<{ isOpen: boolean }>`
  /* На десктопе скрыт — там используется DesktopNav */
  @media (min-width: 769px) {
    display: none;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;            /* ← СЛЕВА */
    bottom: 0;
    width: 290px;
    max-width: 84vw;

    /* Адаптивная высота: 100dvh учитывает мобильные браузеры
       (скрытую адресную строку). Overflow-y позволяет скролить
       если контент не влезает на маленький экран */
    height: 100dvh;
    padding: 0;

    /* Глубокий бирюзовый градиент под цвет хедера */
    background: linear-gradient(
      175deg,
      rgba(5, 82, 102, 0.99)  0%,
      rgba(14, 115, 138, 0.98) 22%,
      rgba(24, 145, 168, 0.97) 48%,
      rgba(38, 168, 190, 0.96) 72%,
      rgba(62, 198, 218, 0.95) 100%
    );
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-right: 1px solid rgba(255, 255, 255, 0.18);

    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;

    /* Выдвижение СЛЕВА */
    transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-110%)')};
    transition: transform 0.44s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1200;
    overflow-y: auto;
    overflow-x: hidden;

    box-shadow: ${props =>
      props.isOpen
        ? '10px 0 60px rgba(0, 0, 0, 0.35), inset -1px 0 0 rgba(255,255,255,0.12)'
        : 'none'};

    /* Декоративный световой блик (верхний левый угол) */
    &::before {
      content: '';
      position: absolute;
      top: -80px;
      left: -80px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Тонкий скроллбар */
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.22) transparent;
    &::-webkit-scrollbar { width: 4px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }

    /* Отступ сверху для первого пункта меню (после DrawerHeader) */
    & > *:nth-child(2) {
      margin-top: 0.75rem;
    }

    /* Stagger-анимация: всё кроме DrawerHeader (первый дочерній).
       Элементы вылетают слева → вправо, вместе с дравером */
    & > *:not(:first-child) {
      opacity: 0;
      transform: translateX(-16px);
      transition: opacity 0.32s ease, transform 0.32s ease;
    }

    ${props =>
      props.isOpen &&
      css`
        & > *:not(:first-child) {
          opacity: 1;
          transform: translateX(0);
        }
        & > *:nth-child(2) { transition-delay: 0.07s; }
        & > *:nth-child(3) { transition-delay: 0.13s; }
        & > *:nth-child(4) { transition-delay: 0.19s; }
        & > *:nth-child(5) { transition-delay: 0.25s; }
        & > *:nth-child(6) { transition-delay: 0.31s; }
        & > *:nth-child(7) { transition-delay: 0.37s; }
      `}
  }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: ${props => (props.isActive ? '#0f3a53ff' : 'rgba(15, 50, 73, 0.9)')};
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
  padding: 1rem 2rem;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props =>
    props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};

  @media (min-width: 769px) {
    color: ${props => (props.isActive ? 'white' : 'rgba(255, 255, 255, 0.9)')};
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    position: relative;
    overflow: hidden;

    /* Отступы по бокам через margin (не width:100%) */
    margin: 0.2rem 1rem;
    padding: 0.92rem 1.1rem 0.92rem 1.25rem;

    color: ${props => (props.isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.82)')};
    background: ${props =>
      props.isActive ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.06)'};
    border: 1px solid
      ${props =>
        props.isActive ? 'rgba(255, 255, 255, 0.32)' : 'rgba(255, 255, 255, 0.1)'};
    border-radius: 14px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    box-shadow: ${props =>
      props.isActive ? '0 4px 16px rgba(0,0,0,0.12)' : 'none'};

    /* Акцентная вертикальная полоска слева */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%)
        ${props => (props.isActive ? 'scaleY(1)' : 'scaleY(0)')};
      width: 3px;
      height: 55%;
      background: rgba(255, 255, 255, 0.88);
      border-radius: 0 3px 3px 0;
      transition: transform 0.22s ease;
    }
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

    @media (min-width: 769px) {
      color: white;
    }

    @media (max-width: 768px) {
      border-color: rgba(255, 255, 255, 0.36);
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      /* Смещение вправо — «выходит» из левого края дравера */
      transform: translateX(4px);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.14);

      &::before {
        transform: translateY(-50%) scaleY(1);
      }
    }
  }
`;


/* ── Футер дравера с иконками (только мобильный дравер) ── */
const UserActions = styled.div`
  display: flex;
  align-items: center;
  /* Прижат к низу дравера через flex column + margin-top: auto */
  margin-top: auto;
  flex-shrink: 0;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.6rem;
  padding: 0.9rem 1.25rem calc(env(safe-area-inset-bottom, 0px) + 1rem);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.1);
  min-height: fit-content;
`;

const CategoryButton = styled.button`
  position: relative;
  color: white;
  /* ИЗМЕНЕНО: Размер иконки плавный */
  font-size: clamp(1.3rem, 4vw, 1.5rem);
  padding: clamp(0.3rem, 1vw, 0.5rem);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileCategoryButton = styled.button`
  display: none;
  color: white;
  /* ИЗМЕНЕНО: Размер иконки плавный */
  font-size: clamp(1.1rem, 4vw, 1.3rem);
  padding: clamp(0.2rem, 1vw, 0.4rem);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: block;
  }
  
  /* ИЗМЕНЕНО: Удалены @media запросы для font-size, padding, right */
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  /* ИЗМЕНЕНО: Отступы и шрифты плавные */
  gap: clamp(0.2rem, 1vw, 0.5rem);
  color: white;
  background: none;
  border: none;
  padding: clamp(0.3rem, 1vw, 0.5rem);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(0.8rem, 2.5vw, 1rem);
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ИЗМЕНЕНО: Удалены @media запросы */
`;

const ProfileDropdownList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  min-width: 220px;
  margin-top: 0.5rem;

  /* Frosted glass */
  background-color: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);

  /* Анимация появления */
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transform: ${props => (props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)')};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.26s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
`;

const ProfileDropdownItem = styled(Link)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 14px;
  color: ${props => (props.isActive ? '#16a374ff' : '#08414bff')};
  text-decoration: none;
  transition: background 0.18s ease, color 0.18s ease;
  border-bottom: 1px solid rgba(255,255,255,0.06);

  &:hover {
    background: rgba(255,255,255,0.06);
    color: #ffffff;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CartButton = styled.button`
  position: relative;
  color: white;
  /* ИЗМЕНЕНО: Плавный размер и отступ */
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  padding: clamp(0.3rem, 1vw, 0.5rem);
  border-radius: 8px;
  transition: all 0.3s ease;
  background: none;
  border: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ИЗМЕНЕНО: Удалены @media запросы */
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
`;

const WishlistButton = styled.button`
  position: relative;
  color: white;
  /* ИЗМЕНЕНО: Плавный размер и отступ */
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  padding: clamp(0.3rem, 1vw, 0.5rem);
  border-radius: 8px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* ИЗМЕНЕНО: Удалены @media запросы */
`;

const MobileLeftActions = styled.div`
  display: none;
  align-items: center;
  /* ИЗМЕНЕНО: Плавный отступ */
  gap: clamp(0.25rem, 1.5vw, 0.5rem);
  
  /* ИЗМЕНЕНО: Убрано 'position: absolute' и 'left' */

  @media (max-width: 768px) {
    display: flex;
    order: 1; /* Ставим слева */
  }
`;

const MobileMenuButton = styled.button`
  color: white;
  /* ИЗМЕНЕНО: Плавный размер */
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  background: none;
  border: none;
  cursor: pointer;

  /* ИЗМЕНЕНО: Удалены @media запросы */
`;

const MobileProfileButton = styled.button`
  color: white;
  /* ИЗМЕНЕНО: Плавный размер */
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  /* ИЗМЕНЕНО: Удалены @media запросы */
`;

const MobileProfileDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  /* Widened so labels fit on one line */
  min-width: 220px;
  max-width: 95vw;
  margin-top: 0.5rem;

  /* Frosted glass for mobile as well */
  background-color: rgba(255,255,255,0.12);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);

  opacity: ${props => (props.isOpen ? 1 : 0)};
  transform: ${props => (props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)')};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.26s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;

  /* Adjust the horizontal offset so the menu doesn't sit too far left; keeps it visually aligned with the profile icon */
  @media (max-width: 768px) {
    margin-left: calc(-100% + 70px);
    min-width: 200px;
  }

  @media (max-width: 480px) {
    margin-left: calc(-100% + 56px);
    min-width: 180px;
    max-width: 92vw;
  }

  @media (max-width: 360px) {
    margin-left: calc(-100% + 48px);
    min-width: 170px;
  }
`;

const MobileProfileDropdownItem = styled(Link)<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 14px;
  /* Prevent wrapping so labels stay on one line */
  white-space: nowrap;
  color: ${props => (props.isActive ? '#00acc1' : '#093a41ff')};
  text-decoration: none;
  transition: all 0.18s ease;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
    /* show left marker for active items, otherwise hidden */
    transform: ${props => (props.isActive ? 'scaleY(1)' : 'scaleY(0)')};
    transition: transform 0.18s ease;
  }

  &:hover {
    background: rgba(255,255,255,0.06);
    color: #ffffff;
    transform: translateX(4px);

    &::before {
      transform: scaleY(1);
    }
  }

  &:last-child {
    border-bottom: none;
  }
`;

/* ── Затемнение-оверлей под дравером ──
   NavLinks вынесен за пределы хедера → оба элемента теперь в
   root stacking context. z-index: 1199 безопасен: NavLinks(1200) > Overlay(1199) ✓ */
const MenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 32, ${props => (props.isOpen ? '0.48' : '0')});
  z-index: 1199;
  pointer-events: ${props => (props.isOpen ? 'all' : 'none')};
  transition: background 0.44s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

/* ── Шапка дравера (логотип + кнопка закрыть) ── */
const DrawerHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(env(safe-area-inset-top, 0px) + 1.1rem) 1.25rem 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.13);
    background: rgba(0, 0, 0, 0.12);
    flex-shrink: 0;
    /* Шапка не участвует в stagger — всегда видна */
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
`;

const DrawerBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;

  img {
    width: 34px;
    height: 34px;
    object-fit: contain;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.25));
  }
`;

const DrawerTitle = styled.span`
  font-size: 1.12rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.04em;
`;

const DrawerCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    color: white;
    border-color: rgba(255, 255, 255, 0.38);
    transform: scale(1.1) rotate(90deg);
  }
`;

const MobileActionsContainer = styled.div`
  display: none; // По умолчанию скрыт

  @media (max-width: 768px) {
    display: flex; // Показываем на экранах меньше 768px
    align-items: center;
    order: 3; /* Ставим справа */
    /* ИЗМЕНЕНО: Убрано 'position: absolute', 'right', 'top', 'transform' */
    /* ИЗМЕНЕНО: Плавный отступ */
    gap: clamp(0.25rem, 2vw, 0.75rem);
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchEndX, setTouchEndX] = useState<number>(0);
  const { openSidebar, closeSidebar, isOpen: isCategorySidebarOpen } = useCategorySidebar();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlist();
  const { categories } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  // Фильтруем активные категории и добавляем категорию "Все товары" только если её нет
  const activeCategories = React.useMemo(() => {
    const allCategory = {
      id: 'all',
      name: 'Всі товари',
      icon: '🏠',
      slug: 'all',
      description: 'Всі товари магазину',
      isActive: true,
      sortOrder: 0
    };

    if (!categories || !Array.isArray(categories)) return [allCategory];

    const filteredCategories = categories
      .filter(cat => cat && cat.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    // Проверяем, есть ли уже категория "Все товары"
    const hasAllCategory = filteredCategories.some(cat => cat.id === 'all');
    
    return hasAllCategory ? filteredCategories : [allCategory, ...filteredCategories];
  }, [categories]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    
    if (isLeftSwipe && touchStartX < 50) {
      // Swipe from left edge to open categories
      openSidebar();
    }
    
    setTouchStartX(0);
    setTouchEndX(0);
  };

  // Закрытие выпадающих списков при клике вне их
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-profile-dropdown]')) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-mobile-profile]')) {
        setIsMobileProfileDropdownOpen(false);
      }
    };

    if (isMobileProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileProfileDropdownOpen]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          МОБИЛЬНЫЙ ДРАВЕР — вне HeaderContainer!
          Причина: HeaderContainer имеет backdrop-filter + sticky + z-index:100,
          что создаёт stacking context. position:fixed внутри него привязывается
          к хедеру, а не к viewport. Вынос наружу → истинный fixed от viewport,
          z-index:1200 от корня документа, скролл страницы под дравером работает.
          ═══════════════════════════════════════════════════════════ */}
      <MenuOverlay isOpen={isMenuOpen} onClick={() => setIsMenuOpen(false)} />

      <NavLinks isOpen={isMenuOpen}>
        {/* Шапка дравера */}
        <DrawerHeader>
          <DrawerBrand>
            <img src="/small-icon.png" alt="DreamShop" width={34} height={34} decoding="async" />
            <DrawerTitle>DreamShop</DrawerTitle>
          </DrawerBrand>
          <DrawerCloseBtn onClick={toggleMenu} aria-label="Закрити меню">
            <FiX />
          </DrawerCloseBtn>
        </DrawerHeader>

        {!location.pathname.startsWith('/admin') && (
          <>
            <NavLink
              to="/"
              isActive={location.pathname === '/'}
              onClick={() => setIsMenuOpen(false)}
            >
              Головна
            </NavLink>
            <NavLink
              to="/products"
              isActive={location.pathname === '/products'}
              onClick={() => setIsMenuOpen(false)}
            >
              Товари
            </NavLink>
          </>
        )}

        {user?.isAdmin && !location.pathname.startsWith('/admin') && (
          <NavLink
            to="/admin"
            isActive={location.pathname === '/admin'}
            onClick={() => setIsMenuOpen(false)}
          >
            Адмін панель
          </NavLink>
        )}

        {/* Иконки в подвале дравера */}
        <UserActions>
          <NotificationBell onClick={() => setNotificationsOpen(true)} />
          {user && (
            <WishlistButton onClick={() => { navigate('/wishlist'); setIsMenuOpen(false); }} aria-label="Обране">
              <FiHeart />
              {getWishlistItems() > 0 && <CartBadge>{getWishlistItems()}</CartBadge>}
            </WishlistButton>
          )}
          <CartButton onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} aria-label="Кошик">
            <FiShoppingCart />
            {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
          </CartButton>
          {user ? (
            <ProfileDropdown data-profile-dropdown>
              <ProfileButton onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                <FiUser />
                <span className="desktop-only">{user.name} {user.lastName}</span>
                <FiChevronDown style={{
                  fontSize: '0.8rem',
                  transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }} />
              </ProfileButton>
              <ProfileDropdownList isOpen={isProfileDropdownOpen}>
                <ProfileDropdownItem to="/profile" isActive={location.pathname === '/profile'}
                  onClick={() => { setIsProfileDropdownOpen(false); setIsMenuOpen(false); }}>
                  <FiUser />Мій профіль
                </ProfileDropdownItem>
                <ProfileDropdownItem to="/orders" isActive={location.pathname === '/orders'}
                  onClick={() => { setIsProfileDropdownOpen(false); setIsMenuOpen(false); }}>
                  <FiShoppingCart />Мої замовлення
                </ProfileDropdownItem>
                <ProfileDropdownItem to="#"
                  onClick={(e) => { e.preventDefault(); logout(); setIsProfileDropdownOpen(false); setIsMenuOpen(false); }}>
                  <FiLogOut />Вихід
                </ProfileDropdownItem>
              </ProfileDropdownList>
            </ProfileDropdown>
          ) : (
            <GoogleLogin />
          )}
        </UserActions>
      </NavLinks>
      {/* ═══════════════════════════════════════════════════════════ */}

      <HeaderContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      <Nav>
          <Logo to="/">
            <LogoIcon>
              <img src="/small-icon.png" alt="DreamShop Logo" width={50} height={50} decoding="async" />
            </LogoIcon>
            <LogoText>DreamShop</LogoText>
          </Logo>

          {/* ── Десктопная навигация (только >= 769px) ── */}
          <DesktopNav>
            {!location.pathname.startsWith('/admin') && (
              <>
                <NavLink to="/" isActive={location.pathname === '/'}>Головна</NavLink>
                <NavLink to="/products" isActive={location.pathname === '/products'}>Товари</NavLink>
              </>
            )}
            {user?.isAdmin && !location.pathname.startsWith('/admin') && (
              <NavLink to="/admin" isActive={location.pathname === '/admin'}>Адмін панель</NavLink>
            )}
          </DesktopNav>

          {/* ── Десктопные кнопки (только >= 769px) ── */}
          <DesktopUserActions>
            <NotificationBell onClick={() => setNotificationsOpen(true)} />
            {user && (
              <WishlistButton onClick={() => navigate('/wishlist')} aria-label="Обране">
                <FiHeart />
                {getWishlistItems() > 0 && <CartBadge>{getWishlistItems()}</CartBadge>}
              </WishlistButton>
            )}
            <CartButton onClick={() => setIsCartOpen(true)} aria-label="Кошик">
              <FiShoppingCart />
              {getTotalItems() > 0 && <CartBadge>{getTotalItems()}</CartBadge>}
            </CartButton>
            <CategoryButton onClick={openSidebar} title="Категорії товарів">
              <FiGrid />
            </CategoryButton>
            {user ? (
              <ProfileDropdown data-profile-dropdown>
                <ProfileButton onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                  <FiUser />
                  <span className="desktop-only">{user.name} {user.lastName}</span>
                  <FiChevronDown style={{
                    fontSize: '0.8rem',
                    transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} />
                </ProfileButton>
                <ProfileDropdownList isOpen={isProfileDropdownOpen}>
                  <ProfileDropdownItem to="/profile" isActive={location.pathname === '/profile'}
                    onClick={() => setIsProfileDropdownOpen(false)}>
                    <FiUser />Мій профіль
                  </ProfileDropdownItem>
                  <ProfileDropdownItem to="/orders" isActive={location.pathname === '/orders'}
                    onClick={() => setIsProfileDropdownOpen(false)}>
                    <FiShoppingCart />Мої замовлення
                  </ProfileDropdownItem>
                  <ProfileDropdownItem to="#"
                    onClick={(e) => { e.preventDefault(); logout(); setIsProfileDropdownOpen(false); }}>
                    <FiLogOut />Вихід
                  </ProfileDropdownItem>
                </ProfileDropdownList>
              </ProfileDropdown>
            ) : (
              <GoogleLogin />
            )}
          </DesktopUserActions>

        <MobileLeftActions>
          <MobileMenuButton onClick={toggleMenu}>
            <FiMenu />
          </MobileMenuButton>

          {user && (
            <MobileProfileButton 
              onClick={() => setIsMobileProfileDropdownOpen(!isMobileProfileDropdownOpen)} 
              aria-label="Профіль"
              data-mobile-profile
            >
              <FiUser />
              <MobileProfileDropdown isOpen={isMobileProfileDropdownOpen}>
                <MobileProfileDropdownItem 
                  to="/profile" 
                  isActive={location.pathname === '/profile'}
                  onClick={() => {
                    setIsMobileProfileDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FiUser />
                  Мій профіль
                </MobileProfileDropdownItem>
                <MobileProfileDropdownItem 
                  to="/wishlist" 
                  isActive={location.pathname === '/wishlist'}
                  onClick={() => {
                    setIsMobileProfileDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FiHeart />
                  Обране
                  {getWishlistItems() > 0 && (
                    <span style={{ 
                      background: '#e74c3c', 
                      color: 'white', 
                      borderRadius: '50%', 
                      padding: '2px 6px', 
                      fontSize: '0.7rem',
                      marginLeft: 'auto'
                    }}>
                      {getWishlistItems()}
                    </span>
                  )}
                </MobileProfileDropdownItem>
                <MobileProfileDropdownItem 
                  to="/orders" 
                  isActive={location.pathname === '/orders'}
                  onClick={() => {
                    setIsMobileProfileDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FiShoppingCart />
                  Мої замовлення
                </MobileProfileDropdownItem>
                <MobileProfileDropdownItem 
                  to="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    setIsMobileProfileDropdownOpen(false);
                    setIsMenuOpen(false);
                  }}
                >
                  <FiLogOut />
                  Вихід
                </MobileProfileDropdownItem>
              </MobileProfileDropdown>
            </MobileProfileButton>
          )}
        </MobileLeftActions>

      <MobileActionsContainer>
          <CartButton onClick={() => setIsCartOpen(true)} aria-label="Кошик (mobile)">
            <FiShoppingCart />
            {getTotalItems() > 0 && (
              <CartBadge>{getTotalItems()}</CartBadge>
            )}
          </CartButton>

          <MobileCategoryButton 
            onClick={openSidebar}
            title="Категорії товарів"
          >
            <FiGrid />
          </MobileCategoryButton>
</MobileActionsContainer>
      </Nav>
      </HeaderContainer>

      {/* Боковая панель категорий */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={closeSidebar}
        categories={activeCategories}
        selectedCategory="all"
        onCategorySelect={(categoryId) => {
          closeSidebar();
          if (location.pathname === '/products') {
            // Если мы уже на странице товаров, просто обновляем параметры URL
            navigate(`/products?category=${categoryId}`, { replace: true });
          } else {
            // Если мы на другой странице, переходим на страницу товаров
            navigate(`/products?category=${categoryId}`);
          }
        }}
      />

      {/* Бокова корзина */}
      <SideCartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <NotificationsDrawer open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
};

export default Header;
