# Настройка Firebase для DreamShop

## 1. Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект"
3. Введите название проекта: `dreamshop-odessa`
4. Включите Google Analytics (опционально)
5. Создайте проект

## 2. Настройка Authentication

1. В левом меню выберите "Authentication"
2. Перейдите на вкладку "Sign-in method"
3. Включите "Google" провайдер
4. Добавьте домен вашего сайта в список авторизованных доменов

## 3. Настройка Firestore Database

1. В левом меню выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите "Начать в тестовом режиме" (для разработки)
4. Выберите регион (рекомендуется europe-west1 для Украины)

## 4. Настройка Storage (опционально)

1. В левом меню выберите "Storage"
2. Нажмите "Начать"
3. Выберите "Начать в тестовом режиме"
4. Выберите регион

## 5. Получение конфигурации

1. В настройках проекта (шестеренка) выберите "Настройки проекта"
2. Прокрутите вниз до "Ваши приложения"
3. Нажмите на иконку веб-приложения (</>)
4. Введите название приложения: `DreamShop Web`
5. Скопируйте конфигурацию Firebase

## 6. Обновление конфигурации в коде

Замените содержимое файла `src/firebase/config.ts` на вашу конфигурацию:

```typescript
const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-проект.firebaseapp.com",
  projectId: "ваш-проект-id",
  storageBucket: "ваш-проект.appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id"
};
```

## 7. Настройка правил безопасности Firestore

В консоли Firebase перейдите в Firestore Database > Правила и замените на:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Товары - читать всем, писать только админам
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Категории - читать всем, писать только админам
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Пользователи - читать/писать только свои данные или админам
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
    
    // Заказы - читать свои заказы или админам, писать только аутентифицированным
    match /orders/{document} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow write: if request.auth != null;
    }
  }
}
```

## 8. Инициализация данных

После настройки Firebase запустите приложение и в консоли браузера выполните:

```javascript
import { initializeAllData } from './src/firebase/initData';
initializeAllData();
```

Это создаст начальные категории и товары в базе данных.

## 9. Настройка админа

Для создания первого админа выполните в консоли браузера:

```javascript
// После входа через Google
import { userService } from './src/firebase/services';
import { useAuth } from './src/contexts/AuthContext';

// Получите текущего пользователя и сделайте его админом
const currentUser = useAuth().user;
if (currentUser) {
  userService.createOrUpdate({
    ...currentUser,
    isAdmin: true
  });
}
```

## 10. Проверка работы

1. Запустите приложение: `npm start`
2. Войдите через Google
3. Проверьте, что товары загружаются из базы данных
4. Проверьте админ панель (если вы админ)
5. Попробуйте создать заказ

## Возможные проблемы

1. **Ошибка CORS** - убедитесь, что домен добавлен в авторизованные домены в настройках Authentication
2. **Ошибка прав доступа** - проверьте правила Firestore
3. **Товары не загружаются** - убедитесь, что данные инициализированы
4. **Google Auth не работает** - проверьте настройки OAuth в консоли Google Cloud
