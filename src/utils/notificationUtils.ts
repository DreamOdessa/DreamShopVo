import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

// Интерфейс для отправки уведомления
export interface SendNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  clickAction?: string;
  data?: Record<string, any>;
}

// Получить всех админов с FCM токенами
export const getAdminFCMTokens = async (): Promise<string[]> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('isAdmin', '==', true));
    const querySnapshot = await getDocs(q);
    
    const tokens: string[] = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.fcmTokens && Array.isArray(userData.fcmTokens)) {
        tokens.push(...userData.fcmTokens);
      }
    });
    
    return tokens;
  } catch (error) {
    console.error('Ошибка при получении FCM токенов админов:', error);
    return [];
  }
};

// Отправить уведомление админам через Firebase Cloud Functions
// ПРИМЕЧАНИЕ: Для работы требуется Cloud Function на бэкенде
export const sendNotificationToAdmins = async (payload: SendNotificationPayload): Promise<void> => {
  try {
    const tokens = await getAdminFCMTokens();
    
    if (tokens.length === 0) {
      console.warn('Нет FCM токенов для админов');
      return;
    }

    // В реальном проекте здесь должен быть вызов Cloud Function
    // Пример:
    // const sendNotificationFunction = httpsCallable(functions, 'sendNotification');
    // await sendNotificationFunction({ tokens, ...payload });
    
    console.log('📤 Уведомление для отправки админам:', {
      tokens,
      payload
    });
    
    // Временное решение: показываем локальное уведомление для тестирования
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo192.png',
        badge: '/favicon.ico'
      });
    }
  } catch (error) {
    console.error('Ошибка при отправке уведомления админам:', error);
  }
};

// Отправить уведомление конкретному пользователю
export const sendNotificationToUser = async (userId: string, payload: SendNotificationPayload): Promise<void> => {
  try {
    // Получаем токены пользователя из Firestore
    const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
    
    if (userDoc.empty) {
      console.warn('Пользователь не найден:', userId);
      return;
    }

    const userData = userDoc.docs[0].data();
    const tokens = userData.fcmTokens || [];
    
    if (tokens.length === 0) {
      console.warn('У пользователя нет FCM токенов:', userId);
      return;
    }

    // В реальном проекте здесь должен быть вызов Cloud Function
    console.log('📤 Уведомление для отправки пользователю:', {
      userId,
      tokens,
      payload
    });
    
    // Временное решение: показываем локальное уведомление для тестирования
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/logo192.png',
        badge: '/favicon.ico'
      });
    }
  } catch (error) {
    console.error('Ошибка при отправке уведомления пользователю:', error);
  }
};

const notificationHelpers = {
  getAdminFCMTokens,
  sendNotificationToAdmins,
  sendNotificationToUser
};

export default notificationHelpers;
