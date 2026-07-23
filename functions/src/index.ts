import * as functions from 'firebase-functions';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import fetch from 'node-fetch';

// Initialize admin SDK once (ESM-safe)
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const messaging = getMessaging();

const telegramRuntime = functions.runWith({
  secrets: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_ADMIN_CHAT_IDS']
});

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}

function escapeTelegramHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getTelegramConfig(): { token: string; chatIds: string[] } | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '')
    .split(',')
    .map(chatId => chatId.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) {
    functions.logger.warn('Telegram notifications are not configured');
    return null;
  }

  return { token, chatIds };
}

async function sendTelegramNotification(message: string): Promise<void> {
  const config = getTelegramConfig();
  if (!config) return;

  for (const chatId of config.chatIds) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      if (!response.ok) {
        const responseBody = await response.text();
        throw new Error(`Telegram API ${response.status}: ${responseBody.slice(0, 200)}`);
      }

      functions.logger.info('Telegram notification sent', { chatId });
    } catch (error) {
      functions.logger.error('Telegram notification failed', { chatId, error });
    }
  }
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

export const onOrderCreated = telegramRuntime.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const numericTotal = Number(data.total);
    const total = Number.isFinite(numericTotal) ? numericTotal : 0;
    const orderId = context.params.orderId.substring(0, 8);
    const fullOrderId = context.params.orderId;
    const firstName = data.customerInfo?.firstName || '';
    const lastName = data.customerInfo?.lastName || '';
    const customerName = `${firstName} ${lastName}`.trim() || 'Не указан';
    const customerPhone = data.customerInfo?.phone || 'Не указан';
    const itemsCount = Array.isArray(data.items)
      ? data.items.reduce((sum: number, item: { quantity?: unknown }) => {
        const quantity = Number(item?.quantity);
        return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
      }, 0)
      : 0;
    
    const telegramMessage = 
      `🛒 <b>Новый заказ!</b>\n\n` +
      `📋 Заказ: <code>#${escapeTelegramHtml(orderId)}</code>\n` +
      `💰 Сумма: <b>${escapeTelegramHtml(total)} ₴</b>\n` +
      `👤 Клиент: ${escapeTelegramHtml(customerName)}\n` +
      `📞 Телефон: ${escapeTelegramHtml(customerPhone)}\n` +
      `📦 Товаров: ${escapeTelegramHtml(itemsCount)}\n\n` +
      `🔗 <a href="https://www.dream-odessa.com/admin">Открыть админку</a>`;
    
    await sendTelegramNotification(telegramMessage);
    
    // Send push notification to admins (if they have FCM tokens)
    const tokens = await getAdminTokens();
    await sendToTokens(tokens, {
      title: '🛒 Новый заказ',
      body: `Заказ #${orderId} на сумму ${total} ₴`,
      data: { type: 'new_order', orderId: fullOrderId }
    });
  });

export const onOrderStatusUpdated = telegramRuntime.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (!before || !after) return;
    if (before.status === after.status) return; // no status change
    const userId = after.userId;
    if (!userId) return;
    const status = String(after.status || '');
    const orderId = context.params.orderId.substring(0, 8);
    const firstName = after.customerInfo?.firstName || '';
    const lastName = after.customerInfo?.lastName || '';
    const customerName = `${firstName} ${lastName}`.trim() || 'Клиент';
    
    const statusMessages: Record<string, string> = {
      pending: 'Ваш заказ ожидает обработки',
      processing: 'Ваш заказ обрабатывается',
      shipped: 'Ваш заказ отправлен',
      delivered: 'Ваш заказ доставлен!',
      cancelled: 'Ваш заказ отменен'
    };
    
    const statusEmojis: Record<string, string> = {
      pending: '⏳',
      processing: '⚙️',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌'
    };
    
    const telegramMessage = 
      `${statusEmojis[status] || '📦'} <b>Статус заказа изменен</b>\n\n` +
      `📋 Заказ: <code>#${escapeTelegramHtml(orderId)}</code>\n` +
      `👤 Клиент: ${escapeTelegramHtml(customerName)}\n` +
      `📊 Новый статус: <b>${escapeTelegramHtml(statusMessages[status] || status)}</b>\n\n` +
      `🔗 <a href="https://www.dream-odessa.com/admin">Открыть админку</a>`;
    
    await sendTelegramNotification(telegramMessage);
    
    // Send push notification to user
    const tokens = await getUserTokens(userId);
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
