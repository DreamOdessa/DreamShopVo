import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAdmin } from '../contexts/AdminContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiGrid, FiLogOut, FiChevronDown } from 'react-icons/fi';
import GoogleLogin from './GoogleLogin';
import CategorySidebar from './CategorySidebar';
import { useCategorySidebar } from '../contexts/CategorySidebarContext';
import SideCartDrawer from './SideCartDrawer';

const HeaderContainer = styled.header`
  background: linear-gradient(to bottom,rgb(37, 159, 175) 0%,rgba(61, 174, 194, 0.9) 50%,rgba(84, 226, 245, 0.47) 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 150, 136, 0.2);

  @media (max-width: 768px) {
    padding: 0.8rem 0;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 15px;
    justify-content: center;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }

  @media (max-width: 360px) {
    padding: 0 5px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.4rem;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    gap: 0.2rem;
  }

  @media (max-width: 360px) {
    font-size: 0.9rem;
    gap: 0.1rem;
  }

  @media (max-width: 320px) {
    font-size: 0.8rem;
    gap: 0.05rem;
  }

  @media (max-width: 280px) {
    font-size: 0.7rem;
    gap: 0.02rem;
  }
`;

const LogoIcon = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }

  @media (max-width: 360px) {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 320px) {
    width: 25px;
    height: 25px;
  }

  @media (max-width: 280px) {
    width: 22px;
    height: 22px;
  }
`;

const LogoText = styled.span`
  @media (max-width: 280px) {
    display: none;
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 2rem;

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
  gap: 1rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.3rem;
  }

  @media (max-width: 360px) {
    gap: 0.2rem;
  }
`;

const CategoryButton = styled.button`
  position: relative;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
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
  right: 20px;
  color: white;
  font-size: 1.3rem;
  padding: 0.4rem;
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
    margin-left: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.3rem;
    right: 15px;
  }

  @media (max-width: 360px) {
    font-size: 1.1rem;
    padding: 0.2rem;
    right: 10px;
  }
`;

const ProfileDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem;
    gap: 0.3rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.3rem;
    gap: 0.2rem;
  }
`;

const ProfileDropdownList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  margin-top: 0.5rem;
`;

const ProfileDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f8f9fa;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CartButton = styled.button`
  position: relative;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: none;
  border: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.3rem;
  }
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
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    padding: 0.3rem;
  }
`;

const MobileLeftActions = styled.div`
  display: none;
  align-items: center;
  gap: 0.5rem;
  position: absolute;
  left: 20px;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (max-width: 480px) {
    left: 15px;
  }

  @media (max-width: 360px) {
    left: 10px;
  }
`;

const MobileMenuButton = styled.button`
  color: white;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }

  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
`;

const MobileProfileButton = styled.button`
  color: white;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }

  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
`;

const MobileProfileDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 180px;
  max-width: 90vw;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transform: ${props => (props.isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)')};
  visibility: ${props => (props.isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 0.5rem;
  overflow: hidden;
  
  @media (max-width: 768px) {
    margin-left: calc(-100% + 60px);
  }
  
  @media (max-width: 480px) {
    margin-left: calc(-100% + 50px);
    min-width: 160px;
  }
  
  @media (max-width: 360px) {
    margin-left: calc(-100% + 40px);
    min-width: 150px;
  }
`;

const MobileProfileDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(77, 208, 225, 0.1);
    color: #00acc1;
    transform: translateX(5px);
    
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
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    gap: 1rem;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileDropdownOpen, setIsMobileProfileDropdownOpen] = useState(false);
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
              <LogoText>DreamShop</LogoText>
            </LogoIcon>
          </Logo>

        <NavLinks isOpen={isMenuOpen}>
          <CloseButton onClick={toggleMenu}>
            <FiX />
          </CloseButton>
          
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

          {user?.isAdmin && (
            <NavLink 
              to="/admin" 
              isActive={location.pathname === '/admin'}
              onClick={() => setIsMenuOpen(false)}
            >
              Адмін панель
            </NavLink>
          )}

          <UserActions>
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
    </>
  );
};

export default Header;
