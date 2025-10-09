import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiGrid, FiLogOut, FiChevronDown } from 'react-icons/fi';
import GoogleLogin from './GoogleLogin';
import CategorySidebar from './CategorySidebar';
import { useCategorySidebar } from '../contexts/CategorySidebarContext';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 150, 136, 0.2);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
    z-index: 1000;
  }
`;

const NavLink = styled(Link)<{ isActive: boolean }>`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
  display: ${props => props.isOpen ? 'block' : 'none'};
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

const CartButton = styled(Link)`
  position: relative;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
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

const MobileMenuButton = styled.button`
  display: none;
  color: white;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  color: white;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { openSidebar, closeSidebar, isOpen: isCategorySidebarOpen } = useCategorySidebar();
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { getTotalItems: getWishlistItems } = useWishlist();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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

  return (
    <>
      <HeaderContainer>
      <Nav>
        <Logo to="/">
          <LogoIcon>
            <img src="https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/small-icon.png" alt="DreamShop Logo" /> 
            DreamShop
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

          {user && (
            <NavLink 
              to="/wishlist"
              isActive={location.pathname === '/wishlist'}
              onClick={() => setIsMenuOpen(false)}
            >
              <FiHeart style={{ marginRight: '0.5rem' }} />
              Обране
              {getWishlistItems() > 0 && (
                <span style={{ 
                  background: '#e74c3c', 
                  color: 'white', 
                  borderRadius: '50%', 
                  padding: '2px 6px', 
                  fontSize: '0.7rem',
                  marginLeft: '0.5rem'
                }}>
                  {getWishlistItems()}
                </span>
              )}
            </NavLink>
          )}

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
            <CategoryButton 
              onClick={openSidebar}
              title="Категорії товарів"
            >
              <FiGrid />
            </CategoryButton>

            <CartButton to="/cart" onClick={() => setIsMenuOpen(false)}>
              <FiShoppingCart />
              {getTotalItems() > 0 && (
                <CartBadge>{getTotalItems()}</CartBadge>
              )}
            </CartButton>

            {user ? (
              <ProfileDropdown data-profile-dropdown>
                <ProfileButton 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <FiUser />
                  <span>{user.name} {user.lastName && user.lastName}</span>
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

        <MobileMenuButton onClick={toggleMenu}>
          <FiMenu />
        </MobileMenuButton>
      </Nav>
      </HeaderContainer>

      {/* Боковая панель категорий */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={closeSidebar}
        categories={[
          { id: 'all', name: 'Всі товари', icon: '🏠' },
          { id: 'chips', name: 'Фруктові чіпси', icon: '🍎' },
          { id: 'decorations', name: 'Прикраси', icon: '✨' },
          { id: 'syrups', name: 'Сиропи', icon: '🍯' },
          { id: 'purees', name: 'Пюре', icon: '🥄' },
          { id: 'dried_flowers', name: 'Сухоцвіти', icon: '🌸' }
        ]}
        selectedCategory="all"
        onCategorySelect={(categoryId) => {
          // Пока что просто закрываем панель
          // В будущем можно добавить навигацию к товарам с фильтром
          closeSidebar();
          console.log('Selected category:', categoryId);
        }}
      />
    </>
  );
};

export default Header;
