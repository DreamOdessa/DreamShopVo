import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiMenu, FiSearch, FiBell, FiUser, FiMoon, FiSun } from 'react-icons/fi';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  pendingCount?: number;
  pendingPreview?: Array<{ id: string; total: number; shippingAddress?: any; createdAt?: string }>;
  onNavigateToOrders?: () => void;
}

const NavContainer = styled.nav`
  height: 70px;
  background: var(--admin-sidebar-bg, #ffffff);
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid var(--admin-border, #e9ecef);

  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    bottom: -40px;
    left: 0;
    border-radius: 50%;
    box-shadow: -20px -20px 0 var(--admin-sidebar-bg, #ffffff);
    pointer-events: none;
  }
`;

const MenuIcon = styled.i`
  cursor: pointer;
  color: var(--admin-dark, #2c3e50);
  font-size: 24px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--admin-primary, #00acc1);
    transform: scale(1.1);
  }
`;

const SearchForm = styled.form`
  max-width: 400px;
  width: 100%;
  margin-right: auto;

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  background: var(--admin-grey, #f8f9fa);
  border-radius: 25px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(0, 172, 193, 0.1);
    background: #fff;
    border: 1px solid var(--admin-primary, #00acc1);
  }

  input {
    flex: 1;
    padding: 0 20px;
    height: 100%;
    border: none;
    background: transparent;
    outline: none;
    color: var(--admin-dark, #2c3e50);
    font-size: 14px;

    &::placeholder {
      color: var(--admin-dark-grey, #6c757d);
    }
  }

  button {
    width: 42px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--admin-primary, #00acc1);
    color: white;
    font-size: 18px;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--admin-primary-dark, #00838f);
    }

    svg {
      font-size: 18px;
    }
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ThemeToggle = styled.label`
  background-color: var(--admin-grey, #f8f9fa);
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  position: relative;
  height: 32px;
  width: 65px;
  transition: all 0.3s ease;

  input {
    opacity: 0;
    position: absolute;
  }

  svg {
    height: 18px;
    width: 18px;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .moon {
    color: var(--admin-yellow, #ffc107);
  }

  .sun {
    color: var(--admin-orange, #ff9800);
  }
`;

const ThemeBall = styled.div<{ checked: boolean }>`
  background-color: var(--admin-primary, #00acc1);
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
  height: 22px;
  width: 22px;
  transform: translateX(${props => props.checked ? '33px' : '0'});
  transition: transform 0.3s ease;
`;

const NotificationIcon = styled.div`
  font-size: 22px;
  position: relative;
  cursor: pointer;
  color: var(--admin-dark, #2c3e50);
  transition: all 0.3s ease;

  &:hover {
    color: var(--admin-primary, #00acc1);
    transform: scale(1.1);
  }

  &::after {
    content: '';
    display: ${props => props.theme?.hasPending ? 'block' : 'none'};
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--admin-red, #dc3545);
    border: 2px solid var(--admin-sidebar-bg, #ffffff);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--admin-sidebar-bg, #ffffff);
  background: var(--admin-red, #dc3545);
  color: white;
  font-weight: 700;
  font-size: 11px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NotificationMenu = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--admin-sidebar-bg, #ffffff);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9999;

  @media (max-width: 480px) {
    width: 280px;
  }
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
`;

const NotificationItem = styled.li`
  padding: 15px;
  border-bottom: 1px solid var(--admin-grey, #f8f9fa);
  color: var(--admin-dark, #2c3e50);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background-color: var(--admin-light-blue, #e0f7fa);
  }

  &:last-child {
    border-bottom: none;
  }

  .notification-title {
    font-weight: 600;
    margin-bottom: 5px;
  }

  .notification-text {
    font-size: 13px;
    color: var(--admin-dark-grey, #6c757d);
  }

  .notification-time {
    font-size: 12px;
    color: var(--admin-dark-grey, #6c757d);
    margin-top: 5px;
  }
`;

const ProfileIcon = styled.div`
  position: relative;
  cursor: pointer;

  img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid var(--admin-primary, #00acc1);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 172, 193, 0.3);
    }
  }

  svg {
    width: 40px;
    height: 40px;
    padding: 8px;
    background: var(--admin-grey, #f8f9fa);
    border-radius: 50%;
    color: var(--admin-primary, #00acc1);
    border: 2px solid var(--admin-primary, #00acc1);
  }
`;

const ProfileMenu = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--admin-sidebar-bg, #ffffff);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 15px;
  width: 220px;
  z-index: 9999;
`;

const ProfileMenuList = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0;
`;

const ProfileMenuItem = styled.li`
  padding: 12px 15px;
  border-bottom: 1px solid var(--admin-grey, #f8f9fa);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;

  &:hover {
    background-color: var(--admin-light-blue, #e0f7fa);
  }

  &:last-child {
    border-bottom: none;
  }

  span {
    color: var(--admin-dark, #2c3e50);
    font-size: 15px;
    display: block;
    font-weight: 500;

    &:hover {
      color: var(--admin-primary, #00acc1);
    }
  }
`;

const AdminNavbar: React.FC<AdminNavbarProps> = ({ 
  onToggleSidebar, 
  isDarkMode, 
  onToggleDarkMode, 
  pendingCount = 0, 
  pendingPreview = [],
  onNavigateToOrders
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  // const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications
  const notifications = pendingPreview.map(order => ({
    id: order.id,
    title: `⏳ Заказ #${order.id.substring(0,8)}`,
    text: `${order.shippingAddress?.name || 'Клиент'} • ${order.total} ₴`,
    time: order.createdAt ? new Date(order.createdAt).toLocaleDateString('ru-RU') : ''
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Поиск:', searchTerm);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-wrapper') && !target.closest('.profile-wrapper')) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <NavContainer>
      <MenuIcon onClick={onToggleSidebar}>
        <FiMenu />
      </MenuIcon>

      <SearchForm onSubmit={handleSearch}>
        <SearchInputWrapper>
          <input
            type="search"
            placeholder="Поиск по админ панели..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <FiSearch />
          </button>
        </SearchInputWrapper>
      </SearchForm>

      <NavActions>
        <ThemeToggle title="Переключить тему">
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={onToggleDarkMode}
          />
          <FiMoon className="moon" />
          <FiSun className="sun" />
          <ThemeBall checked={isDarkMode} />
        </ThemeToggle>

        <div className="notification-wrapper" style={{ position: 'relative' }}>
          <NotificationIcon 
            theme={{ hasPending: pendingCount > 0 }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <FiBell />
            {pendingCount > 0 && <NotificationBadge>{pendingCount}</NotificationBadge>}
          </NotificationIcon>
          <NotificationMenu show={showNotifications}>
            <NotificationList>
              {notifications.length === 0 && (
                <div style={{padding:'15px',textAlign:'center',color:'var(--admin-dark-grey,#6c757d)'}}>Нет ожидающих заказов</div>
              )}
              {notifications.map(notif => (
                <NotificationItem 
                  key={notif.id}
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigateToOrders?.();
                  }}
                >
                  <div className="notification-title">{notif.title}</div>
                  <div className="notification-text">{notif.text}</div>
                  <div className="notification-time">{notif.time}</div>
                </NotificationItem>
              ))}
            </NotificationList>
          </NotificationMenu>
        </div>

        <div className="profile-wrapper" style={{ position: 'relative' }}>
          <ProfileIcon onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false);
          }}>
            <FiUser />
          </ProfileIcon>
          <ProfileMenu show={showProfile}>
            <ProfileMenuList>
              <ProfileMenuItem onClick={() => console.log('Profile clicked')}>
                <span>Мой профиль</span>
              </ProfileMenuItem>
              <ProfileMenuItem onClick={() => console.log('Settings clicked')}>
                <span>Настройки</span>
              </ProfileMenuItem>
              <ProfileMenuItem onClick={() => console.log('Logout clicked')}>
                <span>Выйти</span>
              </ProfileMenuItem>
            </ProfileMenuList>
          </ProfileMenu>
        </div>
      </NavActions>
    </NavContainer>
  );
};

export default AdminNavbar;
