import React from 'react';
import styled from 'styled-components';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { useNotifications } from '../contexts/NotificationContext';

const Overlay = styled.div<{ open: boolean }>`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  opacity: ${p => p.open ? 1 : 0};
  pointer-events: ${p => p.open ? 'auto' : 'none'};
  transition: opacity .25s ease;
  z-index: 1100;
`;

const Drawer = styled.aside<{ open: boolean }>`
  position: fixed; top: 0; right: 0; height: 100%; width: min(360px, 90vw);
  background: linear-gradient(180deg, rgba(255,255,255,0.85), rgba(240,250,252,0.95));
  backdrop-filter: blur(14px);
  box-shadow: -8px 0 24px rgba(0,0,0,0.15);
  transform: translateX(${p => p.open ? '0' : '100%'});
  transition: transform .35s cubic-bezier(.25,.8,.25,1);
  z-index: 1200;
  display: flex; flex-direction: column;
`;

const HeaderBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem;
  font-weight: 600; font-size: 1.05rem;
  color: #0f3a53;
`;

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer; font-size: 1.3rem; color: #08414b;
  display: flex; align-items: center; justify-content: center; padding: .35rem; border-radius: 8px;
  &:hover { background: rgba(0,0,0,0.08); }
`;

const List = styled.ul`
  list-style: none; margin: 0; padding: 0 .75rem 1rem .75rem; flex: 1; overflow-y: auto;
`;

const Item = styled.li<{ read: boolean }>`
  background: ${p => p.read ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.95)'};
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: .75rem .9rem;
  margin-top: .65rem;
  display: flex; flex-direction: column; gap: .35rem;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

const Title = styled.div<{ read: boolean }>`
  font-weight: 600; font-size: .95rem; color: ${p => p.read ? '#275d6d' : '#0d4f66'};
  display: flex; align-items: center; gap: .4rem;
`;

const Body = styled.div`
  font-size: .85rem; color: #083b49; line-height: 1.2rem;
`;

const Meta = styled.div`
  font-size: .7rem; color: #4d7688; display: flex; justify-content: space-between; align-items: center;
`;

const MarkReadBtn = styled.button`
  background: none; border: none; cursor: pointer; color: #0f6c88; font-size: .75rem; font-weight: 600; padding: .25rem .4rem; border-radius: 6px;
  &:hover { background: rgba(0,0,0,0.06); }
`;

const FooterBar = styled.div`
  padding: .6rem .9rem; display: flex; gap: .5rem; border-top: 1px solid rgba(0,0,0,0.08);
`;

const ActionBtn = styled.button`
  flex: 1; background: #0f6c88; color: #fff; border: none; padding: .55rem .7rem; font-size: .75rem; font-weight: 600; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: .4rem;
  &:hover { background: #0b5870; }
`;

interface Props { open: boolean; onClose: () => void; }

const NotificationsDrawer: React.FC<Props> = ({ open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();

  return (
    <>
      <Overlay open={open} onClick={onClose} aria-hidden={!open} />
      <Drawer open={open} role="dialog" aria-label="Список уведомлений" aria-hidden={!open}>
        <HeaderBar>
          Уведомления {unreadCount > 0 && `(${unreadCount})`}
          <CloseBtn aria-label="Закрыть" onClick={onClose}><FiX /></CloseBtn>
        </HeaderBar>
        <List>
          {notifications.length === 0 && <p style={{padding:'0 .9rem', fontSize:'.85rem', color:'#275d6d'}}>Нет уведомлений</p>}
          {notifications.map(n => (
            <Item key={n.id} read={n.read}>
              <Title read={n.read}>
                {!n.read && <span style={{width:'8px',height:'8px',background:'#ff4757',borderRadius:'50%'}} />}
                {n.title}
              </Title>
              <Body>{n.body}</Body>
              <Meta>
                <span>{new Date(n.createdAt).toLocaleTimeString()}</span>
                {!n.read && <MarkReadBtn onClick={() => markAsRead(n.id)}>Прочитано</MarkReadBtn>}
              </Meta>
            </Item>
          ))}
        </List>
        <FooterBar>
          <ActionBtn disabled={notifications.length === 0} onClick={markAllAsRead}><FiCheckCircle /> Все прочитано</ActionBtn>
          <ActionBtn disabled={notifications.length === 0} onClick={clearNotifications} style={{background:'#c52f3d'}}><FiX /> Очистить</ActionBtn>
        </FooterBar>
      </Drawer>
    </>
  );
};

export default NotificationsDrawer;
