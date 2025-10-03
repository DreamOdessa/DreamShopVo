import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart } from 'react-icons/fi';
import GoogleLogin from './GoogleLogin';

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
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <LogoIcon>
            <img src="/маленькая иконка.png" /> 
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
              to="/profile" 
              isActive={location.pathname === '/profile'}
              onClick={() => setIsMenuOpen(false)}
            >
              <FiHeart style={{ marginRight: '0.5rem' }} />
              Обране
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
            <CartButton to="/cart" onClick={() => setIsMenuOpen(false)}>
              <FiShoppingCart />
              {getTotalItems() > 0 && (
                <CartBadge>{getTotalItems()}</CartBadge>
              )}
            </CartButton>

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser />
                <span>{user.name}</span>
              </div>
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
  );
};

export default Header;
