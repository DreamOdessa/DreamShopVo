# Push Notifications Backend (Firebase Cloud Functions)

## ✅ Статус деплоя
**Проект:** `dreamshop-odessa`  
**Runtime:** Node.js 20  
**Регион:** us-central1  
**Задеплоенные функции:**
- ✅ `onOrderCreated` — уведомление админов о новом заказе
- ✅ `onOrderStatusUpdated` — уведомление пользователя об изменении статуса заказа
- ✅ `onProductCreated` — уведомление админов о новом товаре
- ✅ `sendNotification` — callable функция для ручной отправки (только админ)

**Последний деплой:** 2025-11-23

---

## Возможности
- Автоматическое уведомление админов при создании нового заказа (`onOrderCreated`).
- Автоматическое уведомление пользователя при изменении статуса его заказа (`onOrderStatusUpdated`).
- Автоматическое уведомление админов о новом товаре (`onProductCreated`).
- Ручная отправка произвольного уведомления через callable функцию `sendNotification` (только для админов).

## Структура
```
functions/
  package.json
  tsconfig.json
  src/index.ts
```

## Подготовка
1. Установите Firebase CLI (если нет):
```bash
npm install -g firebase-tools
```
2. Авторизация:
```bash
firebase login
```
3. Выбор проекта (если не настроен):
```bash
firebase use dreamshop-odessa
```

## Локальная разработка (эмулятор)
```bash
cd functions
npm install
npm run build
firebase emulators:start --only functions,firestore
```

## Деплой функций
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```
ИЛИ одним шагом без build (Firebase сам соберёт TypeScript):
```bash
firebase deploy --only functions
```

**Важно:** Используйте Node 18+ локально для CLI. Функции работают на Node 20 в облаке.

## Фоновые уведомления
Для работы фоновых push-уведомлений (когда вкладка закрыта) необходим **Service Worker**.

### Что уже настроено:
1. ✅ **Service Worker** зарегистрирован в `src/index.tsx`:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js');
}
```

2. ✅ **Firebase Messaging SW** создан в `public/firebase-messaging-sw.js`:
   - Слушает фоновые сообщения через `onBackgroundMessage`
   - Показывает браузерные уведомления с кнопками действий
   - Использует Firebase SDK 9.22.0 (compat mode)

3. ✅ **Foreground уведомления** обрабатываются в `NotificationContext.tsx`:
   - Слушает `onMessage` когда приложение открыто
   - Сохраняет в localStorage
   - Показывает в UI через `NotificationBell`

### Как работает:
- **Приложение открыто** → уведомление перехватывается через `onMessage`, добавляется в контекст
- **Приложение в фоне/закрыто** → Service Worker получает через `onBackgroundMessage` и показывает системное уведомление
- **Cloud Functions** отправляют через Firebase Admin SDK `messaging.sendMulticast()`

### Проверка работы фоновых уведомлений:
1. Откройте приложение в браузере
2. Дайте разрешение на уведомления (кнопка в профиле/админке)
3. **Закройте вкладку** или сверните браузер
4. Создайте новый заказ через другой браузер/устройство
5. Системное уведомление должно появиться даже при закрытой вкладке

### Отладка:
```bash
# В Chrome DevTools → Application → Service Workers
# Проверьте что firebase-messaging-sw.js активен
# Console покажет логи: "Received background message"
```

## Проверка успешного деплоя
После деплоя в консоли Firebase → Functions должны появиться:
- onOrderCreated
- onOrderStatusUpdated
- onProductCreated
- sendNotification (HTTPS callable)

## Использование callable функции на клиенте
Пример уже интегрирован в `src/utils/notificationUtils.ts`:
```ts
const functions = getFunctions(app);
const cf = httpsCallable(functions, 'sendNotification');
await cf({ tokens, title, body, icon, data });
```

## Требования к данным
- Документы `users` должны содержать поле `fcmTokens: string[]` (заполняется при запросе разрешения, см. `requestNotificationPermission`).
- Для админов необходимо `isAdmin: true`.

## Как работает триггер статуса заказа
- Срабатывает при `onUpdate` документа `orders/{orderId}`.
- Сравнивает поле `status` до и после.
- Если изменилось — отправляет пуш пользователю.

## Расширения (что можно добавить позже)
- Rate limiting / дедупликация.
- Группировка уведомлений (batch отправка).
- Логирование отправок в коллекцию `notifications`.
- Настройки пользователя (какие типы получать) — дополнительное поле в `users`.
- Авто-очистка неактуальных FCM токенов (обработка ошибок `NotRegistered`).

## Решение проблем
| Проблема | Причина | Решение |
|----------|---------|---------|
| Не приходят фоновые уведомления | Отсутствует сервис-воркер или неправильный ключ | Проверьте `public/firebase-messaging-sw.js` и VAPID ключ в `config.ts` |
| Cloud Function sendNotification ошибка permission-denied | Пользователь не админ | Авторизуйтесь админом / установите `isAdmin: true` |
| Ошибка UNAUTHENTICATED | Нет авторизации при callable | Убедитесь что пользователь вошёл в систему |
| Нет токенов | Пользователь не дал разрешение | Вызвать `requestNotificationPermission(user.id)` после логина |

## Безопасность
- Callable функция проверяет `context.auth` и `isAdmin`.
- Триггеры server-side, фронтенд не может их подделать.

## Быстрый чек
После добавления товара выполните:
1. Добавьте документ в `products` через UI/код.
2. Проверьте логи функций (Firebase Console) на отправку.
3. Убедитесь что админ получил уведомление (если открыт браузер). Фоновое — через сервис-воркер.

## Очистка старых уведомлений (идея)
Добавить функцию:
```ts
export const cleanupNotifications = functions.pubsub.schedule('every 24 hours').onRun(async () => {
  // Реализация: удалить записи старше 30 дней в коллекции notifications
});
```
(Потребуется хранить уведомления в Firestore.)

---
Если нужно развернуть хранение уведомлений в коллекции `notifications` — сообщите, добавлю.
