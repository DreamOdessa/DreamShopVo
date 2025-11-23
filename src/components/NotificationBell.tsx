import React from 'react';
import styled from 'styled-components';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../contexts/NotificationContext';

const BellButton = styled.button<{ hasUnread: boolean }>`
  position: relative;
  color: white;
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  padding: clamp(0.3rem, 1vw, 0.5rem);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  &:hover { background: rgba(255,255,255,0.1); }
  &::after {
    content: '';
    position: absolute;
    top: 6px; right: 6px;
    width: ${p => p.hasUnread ? '10px' : '0'};
    height: ${p => p.hasUnread ? '10px' : '0'};
    background: #ff4757;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.6);
    transition: width .25s, height .25s;
  }
`;

interface Props { onClick: () => void; }

const NotificationBell: React.FC<Props> = ({ onClick }) => {
  const { unreadCount } = useNotifications();
  return (
    <BellButton aria-label="Уведомления" onClick={onClick} hasUnread={unreadCount > 0}>
      <FiBell />
    </BellButton>
  );
};

export default NotificationBell;
