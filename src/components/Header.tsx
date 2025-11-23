import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
  background: linear-gradient(to bottom,rgb(37, 159, 175) 0%,rgba(61, 174, 194, 0.9) 50%,rgba(84, 226, 245, 0.47) 100%);
  color: white;
  padding: clamp(0.6rem, 1.5vw, 1rem) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 150, 136, 0.2);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 75rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2.5vw, 1.5rem);
  position: relative;
  
  /* ИЗМЕНЕНО: Убрали justify-content: center для мобильных */
`;

const Logo = styled(Link)`
  /* ИЗМЕНЕНО: Размер шрифта стал крупнее на минимуме */
  font-size: clamp(1rem, 4vw, 1.8rem);
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  /* ИЗМЕНЕНО: Отступ стал крупнее на минимуме */
  gap: clamp(0.25rem, 1vw, 0.5rem);

  /* ИЗМЕНЕНО: Логотип теперь (order: 2) на мобильных, чтобы быть в центре */
  @media (max-width: 768px) {
    order: 2;
    /* Уменьшим flex-shrink, чтобы он не сжимался так сильно */
    flex-shrink: 2; 
  }
`;

const LogoIcon = styled.div`
  /* ИЗМЕНЕНО: Clamp() теперь не позволяет лого быть "масюской". Мин. ~34px. */
  width: clamp(2.1rem, 7vw, 3.125rem);
  height: clamp(2.1rem, 7vw, 3.125rem);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* ИЗМЕНЕНО: Удалены ВСЕ @media запросы, которые делали иконку 28px, 25px, 22px */
`;

const LogoText = styled.span`
  /* ИЗМЕНЕНО: Удален @media (max-width: 280px) { display: none; } 
     Логотип_текст больше не прячется.
  */
  @media (max-width: 320px) {
    /* На очень маленьких экранах можно скрыть, чтобы не ломать layout */
    display: none;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  /* ИЗМЕНЕНО: Отступ стал плавным */
  gap: clamp(0.5rem, 2vw, 2rem);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    transform: ${props => (props.isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    z-index: 1000;
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, 
        rgba(77, 208, 225, 0.1) 0%, 
        rgba(38, 197, 218, 0.15) 50%, 
        rgba(0, 171, 193, 0.1) 100%);
      z-index: -1;
    }
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
    props.isActive
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(255, 255, 255, 0.05)'};

  @media (min-width: 769px) {
    color: ${props => (props.isActive ? 'white' : 'rgba(255, 255, 255, 0.9)')};
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    
    @media (min-width: 769px) {
      color: white;
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  /* ИЗМЕНЕНО: Отступ стал плавным */
  gap: clamp(0.5rem, 1.5vw, 1rem);

  /* ИЗМЕНЕНО: Удалены @media запросы для gap */
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

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
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
      <HeaderContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
      <Nav>
          <Logo to="/">
            <LogoIcon>
              <img src="https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/small-icon.png" alt="DreamShop Logo" /> 
            </LogoIcon>
            <LogoText>DreamShop</LogoText>
          </Logo>

        <NavLinks isOpen={isMenuOpen}>
          <CloseButton onClick={toggleMenu}>
            <FiX />
          </CloseButton>
          
          {/* Скрываем навигационные ссылки на админ-маршрутах */}
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

          <UserActions>
            <NotificationBell onClick={() => setNotificationsOpen(true)} />
            {user && (
              <WishlistButton onClick={() => navigate('/wishlist')} aria-label="Обране">
                <FiHeart />
                {getWishlistItems() > 0 && (
                  <CartBadge>{getWishlistItems()}</CartBadge>
                )}
              </WishlistButton>
            )}

            <CartButton onClick={() => setIsCartOpen(true)} aria-label="Кошик">
              <FiShoppingCart />
              {getTotalItems() > 0 && (
                <CartBadge>{getTotalItems()}</CartBadge>
              )}
            </CartButton>

            <CategoryButton 
              onClick={openSidebar}
              title="Категорії товарів"
            >
              <FiGrid />
            </CategoryButton>

            
            {user ? (
              <ProfileDropdown data-profile-dropdown>
                <ProfileButton 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <FiUser />
                  <span className="desktop-only">{user.name} {user.lastName && user.lastName}</span>
                  <FiChevronDown style={{ 
                    fontSize: '0.8rem',
                    transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }} />
                </ProfileButton>
                
                <ProfileDropdownList isOpen={isProfileDropdownOpen}>
                  <ProfileDropdownItem 
                    to="/profile" 
                    isActive={location.pathname === '/profile'}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <FiUser />
                    Мій профіль
                  </ProfileDropdownItem>
                  <ProfileDropdownItem 
                    to="/orders" 
                    isActive={location.pathname === '/orders'}
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <FiShoppingCart />
                    Мої замовлення
                  </ProfileDropdownItem>
                  <ProfileDropdownItem 
                    to="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                      setIsProfileDropdownOpen(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    <FiLogOut />
                    Вихід
                  </ProfileDropdownItem>
                </ProfileDropdownList>
              </ProfileDropdown>
            ) : (
              <GoogleLogin />
            )}
          </UserActions>
        </NavLinks>

        {/* Мобільний порядок: ліворуч меню та профіль, праворуч — кошик і категорії */}
        {/* ИЗМЕНЕНА ЛОГИКА РАСПОЛОЖЕНИЯ: 'order' во flex-контейнере 'Nav' */}
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