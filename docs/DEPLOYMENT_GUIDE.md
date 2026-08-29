# 🚀 Инструкция по деплою DreamShop на Vercel

> **Legacy-only guide.** This document describes the preserved CRA/Firebase rollback deployment and must not be used to cut over the Next/Supabase/Worker application. Use [`CUTOVER_RUNBOOK.md`](CUTOVER_RUNBOOK.md) for RB-010.

## ✅ Статус проекта

**Проект полностью готов к деплою!**

- ✅ Сборка проходит без ошибок
- ✅ Все зависимости установлены
- ✅ TypeScript ошибок нет
- ✅ ESLint предупреждений нет
- ✅ Конфигурация Vercel создана
- ✅ Firebase настроен

## 📋 Пошаговая инструкция

### 1. Сохранить изменения в Git
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Подключить к Vercel

1. **Зайти на [vercel.com](https://vercel.com)**
2. **Войти через GitHub**
3. **Нажать "New Project"**
4. **Выбрать репозиторий DreamShop**
5. **Vercel автоматически определит настройки**

### 3. Настроить переменные окружения

В панели Vercel добавить переменные:

```
REACT_APP_FIREBASE_API_KEY = AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE
REACT_APP_FIREBASE_AUTH_DOMAIN = dreamshop-odessa.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = dreamshop-odessa
REACT_APP_FIREBASE_STORAGE_BUCKET = dreamshop-odessa.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 941215601569
REACT_APP_FIREBASE_APP_ID = 1:941215601569:web:a4e5c1bb2892892bbc31e0
REACT_APP_FIREBASE_MEASUREMENT_ID = G-KZHPZJXTS1
```

### 4. Настройки деплоя

- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 5. Деплой

Нажать **"Deploy"** - Vercel автоматически:
- Установит зависимости
- Соберет проект
- Задеплоит на CDN
- Предоставит URL

## 🔧 Технические детали

### Конфигурация проекта:
- **React 18** + **TypeScript**
- **Styled Components** для стилей
- **Firebase** для backend
- **GSAP** для анимаций
- **React Router** для навигации

### Особенности:
- **SPA приложение** с клиентским роутингом
- **Адаптивный дизайн** для всех устройств
- **PWA готовность** (можно добавить манифест)
- **Оптимизированная сборка** (272KB gzipped)

### Безопасность:
- Firebase ключи в переменных окружения
- CORS настроен для домена Vercel
- Аутентификация через Google OAuth

## 🌐 После деплоя

1. **Проверить работу сайта**
2. **Протестировать все функции**
3. **Настроить домен** (если нужно)
4. **Добавить аналитику** (Google Analytics)

## 📞 Поддержка

При возникновении проблем:
- Проверить логи в панели Vercel
- Убедиться в корректности переменных окружения
- Проверить Firebase правила безопасности

---

**🎉 Проект готов к запуску!**
