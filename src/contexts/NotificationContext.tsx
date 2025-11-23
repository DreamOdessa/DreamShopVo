import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import messagingHelpers from '../firebase/messaging';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

const LOCAL_KEY = 'dreamshop_notifications';

function loadLocal(): Notification[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    const parsed: Notification[] = JSON.parse(raw);
    return parsed.slice(0, 200); // safety cap
  } catch {
    return [];
  }
}

function saveLocal(list: Notification[]) {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch {}
}

interface ProviderProps { children: ReactNode }

export const NotificationProvider: React.FC<ProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(loadLocal());

  // Ensure initial sort newest first
  useEffect(() => {
    setNotifications(prev => [...prev].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, []);

  const persist = useCallback((list: Notification[]) => {
    setNotifications(list);
    saveLocal(list);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newItem: Notification = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      read: false,
      ...n
    };
    console.log('➕ Добавляем уведомление:', newItem);
    persist([newItem, ...notifications].slice(0, 200));
  }, [notifications, persist]);

  const markAsRead = (id: string) => {
    persist(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    persist(notifications.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    persist([]);
  };

  const unreadCount = notifications.reduce((acc, n) => acc + (n.read ? 0 : 1), 0);
  
  // Логирование состояния уведомлений
  useEffect(() => {
    console.log('📊 Состояние уведомлений:', { total: notifications.length, unread: unreadCount });
  }, [notifications.length, unreadCount]);

  // Firestore listeners (ОТКЛЮЧЕНЫ - теперь используем только FCM от Cloud Functions)
  // Это предотвращает дублирование уведомлений и получение собственных действий
  useEffect(() => {
    if (!user) return;
    const unsubscribes: (() => void)[] = [];

    // ❌ УБРАНО: Локальные слушатели Firestore
    // Теперь уведомления приходят ТОЛЬКО через Cloud Functions (onOrderCreated, onOrderStatusUpdated, onProductCreated)
    // Это гарантирует:
    // 1. Админы получают уведомления о новых заказах (не свои)
    // 2. Пользователи получают уведомления об изменении статуса (не когда сами меняют)
    // 3. Уведомления работают в фоне (когда вкладка закрыта)
    // 4. Нет дублирования между локальными слушателями и FCM

    return () => { unsubscribes.forEach(u => u()); };
  }, [user]);

  // FCM foreground messages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const unsubscribe = messagingHelpers.onMessageListener((payload) => {
      const title = payload.notification?.title || 'Уведомление';
      const body = payload.notification?.body || 'У вас новое уведомление';
      
      console.log('📬 Добавляем FCM уведомление в контекст:', { title, body });
      
      addNotification({
        type: (payload.data?.type as any) || 'system',
        title,
        body,
        data: payload.data || {},
        orderId: payload.data?.orderId,
        productId: payload.data?.productId
      });
    });
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
