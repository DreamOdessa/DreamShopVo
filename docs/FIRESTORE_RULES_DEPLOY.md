# Инструкция по деплою Firestore Rules

## Проблема
Ошибка сохранения текста героя и отсутствие статистики просмотров товаров.

## Причина
Firestore rules не обновлены на сервере Firebase.

## Решение

### Вариант 1: Через Firebase CLI (рекомендуется)

1. Убедитесь, что Firebase CLI установлен:
```bash
firebase --version
```

Если не установлен:
```bash
npm install -g firebase-tools
```

2. Авторизуйтесь в Firebase (если еще не авторизованы):
```bash
firebase login
```

3. Деплой правил:
```bash
firebase deploy --only firestore:rules
```

### Вариант 2: Через консоль Firebase (альтернатива)

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект `dreamshop-odessa`
3. Перейдите в **Firestore Database** → **Rules**
4. Скопируйте содержимое файла `firestore.rules` из проекта
5. Вставьте в редактор правил в консоли
6. Нажмите **Publish** (Опубликовать)

## Правила которые нужно добавить

Убедитесь, что в правилах есть следующие секции:

```plaintext
// Настройки сайта (CMS)
match /site_settings/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Просмотры товаров (статистика)
match /product_views/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}

// Уникальные посетители (для логирования анонимных заходов)
match /visitors/{docId} {
  allow read: if true;
  allow write: if true;
}
```

## Проверка после деплоя

1. Откройте админ-панель → Настройки
2. Измените текст приветствия и нажмите "Сохранить текст"
3. Должно появиться уведомление "Текст приветствия сохранен!"
4. Если ошибка - откройте консоль браузера (F12) и скопируйте детали ошибки

## Статистика просмотров

Статистика просмотров начнет накапливаться после того, как пользователи будут открывать страницы товаров. Для теста:

1. Откройте сайт (главную страницу)
2. Перейдите на несколько страниц товаров
3. Вернитесь в админ-панель → Настройки
4. Перезагрузите страницу (Ctrl+R)
5. Должен появиться список просмотренных товаров

## Дополнительная диагностика

Если ошибка сохранения продолжается:

1. Откройте консоль браузера (F12) → Console
2. Попробуйте сохранить текст
3. Найдите сообщение "Full error details:"
4. Скопируйте errorCode и errorMessage
5. Проверьте:
   - `permission-denied` = правила не задеплоены или пользователь не авторизован
   - `not-found` = коллекция не существует (нормально, создастся при первой записи)
   - `unauthenticated` = требуется войти в админ-панель

## Firebase Console Quick Links

- [Firestore Rules](https://console.firebase.google.com/project/dreamshop-odessa/firestore/rules)
- [Firestore Data](https://console.firebase.google.com/project/dreamshop-odessa/firestore/data)
- [Authentication](https://console.firebase.google.com/project/dreamshop-odessa/authentication/users)

## Структура коллекций

После успешного деплоя и работы в Firestore должны появиться коллекции:

- `site_settings` → документ `main` → поле `heroSubtitle`
- `product_views` → документы с productId → поле `viewCount`
- `visitors` → документы с датой и visitorId

Проверить наличие данных можно в Firebase Console → Firestore Database → Data.
