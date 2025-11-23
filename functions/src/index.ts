import * as functions from 'firebase-functions';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';

// Initialize admin SDK once (ESM-safe)
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const messaging = getMessaging();

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}

async function getAdminTokens(): Promise<string[]> {
  const snap = await db.collection('users').where('isAdmin', '==', true).get();
  const tokens: string[] = [];
  snap.forEach(doc => {
    const user = doc.data();
    if (Array.isArray(user.fcmTokens)) tokens.push(...user.fcmTokens.filter(Boolean));
  });
  return Array.from(new Set(tokens));
}

async function getUserTokens(userId: string): Promise<string[]> {
  const doc = await db.collection('users').doc(userId).get();
  if (!doc.exists) return [];
  const data = doc.data() || {};
  const raw = (data as any).fcmTokens;
  const tokens: string[] = Array.isArray(raw) ? raw.filter(Boolean) : [];
  return Array.from(new Set(tokens));
}

async function sendToTokens(tokens: string[], payload: NotificationPayload) {
  if (!tokens.length) return;
  const message: MulticastMessage = {
    tokens,
    notification: {
      title: payload.title,
      body: payload.body,
    },
    data: payload.data || {},
    webpush: {
      headers: { TTL: '60' },
      notification: {
        icon: payload.icon || '/logo192.png',
        badge: '/favicon.ico',
      }
    }
  };
  try {
    const res = await messaging.sendMulticast(message);
    functions.logger.info('Sent notification', { success: res.successCount, failure: res.failureCount });
  } catch (e) {
    functions.logger.error('Failed to send notification', e);
  }
}

// Firestore trigger: new order -> notify admins
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const total = data.total || 0;
    const orderId = context.params.orderId.substring(0, 8);
    const tokens = await getAdminTokens();
    await sendToTokens(tokens, {
      title: '🛒 Новый заказ',
      body: `Заказ #${orderId} на сумму ${total} ₴`,
      data: { type: 'new_order', orderId: context.params.orderId }
    });
  });

// Firestore trigger: order status update -> notify user
export const onOrderStatusUpdated = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.status === after.status) return; // no status change
    const userId = after.userId;
    if (!userId) return;
    const status = after.status;
    const tokens = await getUserTokens(userId);
    const statusMessages: Record<string, string> = {
      pending: 'Ваш заказ ожидает обработки',
      processing: 'Ваш заказ обрабатывается',
      shipped: 'Ваш заказ отправлен',
      delivered: 'Ваш заказ доставлен!',
      cancelled: 'Ваш заказ отменен'
    };
    await sendToTokens(tokens, {
      title: '📦 Статус заказа',
      body: statusMessages[status] || `Статус: ${status}`,
      data: { type: 'order_status_update', orderId: context.params.orderId, status }
    });
  });

// Firestore trigger: new product -> notify admins
export const onProductCreated = functions.firestore
  .document('products/{productId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const name = data.name || 'Новый товар';
    const price = data.price ? String(data.price) : '';
    const tokens = await getAdminTokens();
    await sendToTokens(tokens, {
      title: '🆕 Новый товар',
      body: price ? `${name} (${price} ₴)` : name,
      data: { type: 'new_product', productId: context.params.productId }
    });
  });

// Callable generic push sender (requires auth + isAdmin)
export const sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Auth required');
  }
  const uid = context.auth.uid;
  const userDoc = await db.collection('users').doc(uid).get();
  if (!userDoc.exists || !userDoc.data()?.isAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
  const tokens: string[] = data.tokens || [];
  const payload: NotificationPayload = {
    title: data.title || 'Сообщение',
    body: data.body || '',
    icon: data.icon,
    data: data.data || {}
  };
  await sendToTokens(tokens, payload);
  return { sent: tokens.length };
});
