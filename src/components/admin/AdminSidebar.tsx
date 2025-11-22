import React from 'react';
import styled from 'styled-components';
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiUsers, FiSettings, FiLogOut, FiTag } from 'react-icons/fi';

interface AdminSidebarProps {
  isHidden: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const SidebarContainer = styled.section<{ isHidden: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: ${props => props.isHidden ? '60px' : '280px'};
  height: 100vh;
  background: var(--admin-sidebar-bg, #ffffff);
  z-index: 2000;
  transition: all 0.3s ease;
  overflow-x: hidden;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.05);
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  scrollbar-width: none;

  @media (max-width: 768px) {
    width: ${props => props.isHidden ? '0' : '250px'};
  }
`;

const Brand = styled.div`
  font-size: 24px;
  font-weight: 700;
  height: 70px;
  display: flex;
  align-items: center;
  color: var(--admin-primary, #00acc1);
  position: sticky;
  top: 0;
  left: 0;
  background: var(--admin-sidebar-bg, #ffffff);
  z-index: 500;
  padding: 0 20px;
  gap: 15px;
  border-bottom: 1px solid var(--admin-border, #e9ecef);

  i {
    min-width: 35px;
    display: flex;
    justify-content: center;
    font-size: 28px;
  }

  span {
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  ${SidebarContainer}.hide & span {
    opacity: 0;
  }
`;

const SideMenu = styled.ul`
  width: 100%;
  margin-top: 20px;
  padding: 0 10px;
  list-style: none;

  &.bottom {
    position: absolute;
    bottom: 20px;
    width: calc(100% - 20px);
  }
`;

const MenuItem = styled.li<{ isActive?: boolean }>`
  height: 52px;
  background: ${props => props.isActive ? 'var(--admin-grey, #f8f9fa)' : 'transparent'};
  margin: 8px 0;
  border-radius: 12px;
  padding: 4px;
  position: relative;
  transition: all 0.3s ease;

  ${props => props.isActive && `
    &::before {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      top: -40px;
      right: 0;
      box-shadow: 20px 20px 0 var(--admin-grey, #f8f9fa);
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      bottom: -40px;
      right: 0;
      box-shadow: 20px -20px 0 var(--admin-grey, #f8f9fa);
      z-index: -1;
    }
  `}

  a {
    width: 100%;
    height: 100%;
    background: var(--admin-sidebar-bg, #ffffff);
    display: flex;
    align-items: center;
    border-radius: 12px;
    font-size: 16px;
    color: ${props => props.isActive ? 'var(--admin-primary, #00acc1)' : 'var(--admin-dark, #2c3e50)'};
    white-space: nowrap;
    overflow: hidden;
    text-decoration: none;
    padding: 0 15px;
    gap: 15px;
    transition: all 0.3s ease;
    font-weight: ${props => props.isActive ? '600' : '500'};

    &:hover {
      color: var(--admin-primary, #00acc1);
      transform: translateX(5px);
    }

    &.logout {
      color: var(--admin-red, #dc3545);

      &:hover {
        color: var(--admin-red, #dc3545);
        background: #ffe5e8;
      }
    }

    svg {
      min-width: 24px;
      font-size: 20px;
    }

    .text {
      opacity: 1;
      transition: opacity 0.3s ease;
    }
  }

  ${SidebarContainer}.hide & a {
    justify-content: center;

    .text {
      opacity: 0;
      width: 0;
    }
  }
`;

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isHidden, activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { id: 'products', label: 'Продукты', icon: <FiPackage /> },
    { id: 'orders', label: 'Заказы', icon: <FiShoppingBag /> },
    { id: 'categories', label: 'Категории', icon: <FiTag /> },
    { id: 'showcase', label: 'Витрина', icon: <FiBarChart2 /> },
    { id: 'users', label: 'Пользователи', icon: <FiUsers /> },
    { id: 'settings', label: 'Настройки', icon: <FiSettings /> },
  ];

  return (
    <SidebarContainer isHidden={isHidden}>
      <Brand>
        <FiShoppingBag />
        <span>DreamShop Admin</span>
      </Brand>
      
      <SideMenu>
        {menuItems.map(item => (
          <MenuItem key={item.id} isActive={activeTab === item.id}>
            <a href={`#${item.id}`} onClick={(e) => {
              e.preventDefault();
              onTabChange(item.id);
            }}>
              {item.icon}
              <span className="text">{item.label}</span>
            </a>
          </MenuItem>
        ))}
      </SideMenu>

      <SideMenu className="bottom">
        <MenuItem>
          <a href="#logout" className="logout" onClick={(e) => { e.preventDefault(); console.log('Logout'); }}>
            <FiLogOut />
            <span className="text">Выход</span>
          </a>
        </MenuItem>
      </SideMenu>
    </SidebarContainer>
  );
};

export default AdminSidebar;
