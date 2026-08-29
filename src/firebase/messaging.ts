import { getMessaging, getToken, onMessage, MessagePayload } from 'firebase/messaging';
import app, { FIREBASE_VAPID_KEY } from './config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';
import { isLegacyLocalPreview } from '../legacy-local-preview';

// Ключ для FCM (импортируется из config.ts)
const VAPID_KEY = FIREBASE_VAPID_KEY;

let messaging: ReturnType<typeof getMessaging> | null = null;

// Инициализация Firebase Cloud Messaging
try {
  if (!isLegacyLocalPreview && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging инициализирован');
  } else {
    console.warn('⚠️ Service Worker не поддерживается в этом браузере');
  }
} catch (error) {
  console.error('❌ Ошибка инициализации FCM:', error);
}

// Запрос разрешения на уведомления и получение FCM токена
export const requestNotificationPermission = async (userId: string): Promise<string | null> => {
  if (!messaging) {
    console.warn('FCM не инициализирован');
    throw new Error('FCM не поддерживается в этом браузере');
  }

  // Проверяем наличие VAPID ключа
  if (!VAPID_KEY || VAPID_KEY.startsWith('BPxxxx')) {
    console.error('❌ VAPID ключ не настроен!');
    console.info('📝 Получите VAPID ключ: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair');
    throw new Error('VAPID ключ не настроен. Добавьте реальный ключ в src/firebase/config.ts');
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Разрешение на уведомления получено');
      
      // Получаем FCM токен
      const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      
      if (token) {
        console.log('🔑 FCM Token получен:', token.substring(0, 20) + '...');
        
        // Сохраняем токен в Firestore для пользователя
        await saveFCMToken(userId, token);
        
        return token;
      } else {
        console.error('❌ Не удалось получить FCM токен');
        throw new Error('Не удалось получить FCM токен');
      }
    } else {
      console.warn('⚠️ Разрешение на уведомления отклонено');
      throw new Error('Разрешение на уведомления отклонено пользователем');
    }
  } catch (error) {
    console.error('❌ Ошибка при запросе разрешения на уведомления:', error);
    throw error;
  }
};

// Сохранение FCM токена пользователя в Firestore
export const saveFCMToken = async (userId: string, token: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    const existingTokens = userDoc.exists() ? (userDoc.data().fcmTokens || []) : [];
    
    // Добавляем токен только если его еще нет
    if (!existingTokens.includes(token)) {
      await setDoc(userRef, {
        fcmTokens: [...existingTokens, token],
        lastTokenUpdate: new Date().toISOString()
      }, { merge: true });
      
      console.log('✅ FCM токен сохранен для пользователя:', userId);
    }
  } catch (error) {
    console.error('Ошибка при сохранении FCM токена:', error);
  }
};

// Получение FCM токенов пользователя из Firestore
export const getUserFCMTokens = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data().fcmTokens || [];
    }
    
    return [];
  } catch (error) {
    console.error('Ошибка при получении FCM токенов:', error);
    return [];
  }
};

// Слушатель входящих уведомлений (когда приложение открыто)
export const onMessageListener = (callback: (payload: MessagePayload) => void): (() => void) => {
  if (!messaging) {
    return () => {};
  }
  
  // onMessage возвращает функцию отписки
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log('📩 Получено FCM уведомление (foreground):', payload);
    callback(payload);
  });
  
  return unsubscribe;
};

// Типы уведомлений
export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  data?: Record<string, any>;
}

// Показать локальное уведомление (когда приложение открыто)
export const showLocalNotification = (data: NotificationData): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(data.title, {
      body: data.body,
      icon: data.icon || '/logo192.png',
      badge: '/favicon.ico',
      data: data.data
    });

    notification.onclick = () => {
      if (data.clickAction) {
        window.location.href = data.clickAction;
      }
      notification.close();
    };
  }
};

const messagingHelpers = {
  requestNotificationPermission,
  saveFCMToken,
  getUserFCMTokens,
  onMessageListener,
  showLocalNotification
};

export default messagingHelpers;
