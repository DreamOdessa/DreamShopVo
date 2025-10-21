# DreamShop - Магазин фруктовых чипсов и украшений

Современный интернет-магазин органических фруктовых чипсов и украшений для коктейлей и блюд.

## 🚀 Технологии

- **Frontend**: React 18 + TypeScript
- **Стилизация**: Styled Components
- **Роутинг**: React Router DOM
- **Анимации**: GSAP + Framer Motion
- **База данных**: Firebase Firestore
- **Аутентификация**: Firebase Auth (Google Sign-in)
- **Хостинг**: Vercel
- **Иконки**: React Icons

## 📱 Функциональность

### Для пользователей:
- 🛒 Корзина покупок с выдвижным меню
- ❤️ Список желаний
- 👤 Профиль пользователя
- 📦 История заказов
- 🔍 Фильтрация и поиск товаров
- 📱 Адаптивный дизайн
- 🎨 Современный UI с эффектами

### Для администраторов:
- 📊 Панель управления
- ➕ Добавление/редактирование товаров
- 🖼️ Загрузка изображений
- 👥 Управление пользователями
- 📈 Статистика заказов

## 🛠️ Установка и запуск

### Локальная разработка:
```bash
# Клонирование репозитория
git clone <repository-url>
cd DreamShop

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm start
```

### Сборка для продакшена:
```bash
npm run build
```

## 🔧 Конфигурация Firebase

Создайте файл `.env.local` с переменными окружения:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📦 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Header.tsx      # Шапка сайта
│   ├── LoadingSpinner.tsx # Анимация загрузки
│   └── ...
├── pages/              # Страницы приложения
│   ├── Home.tsx        # Главная страница
│   ├── Products.tsx    # Каталог товаров
│   ├── Cart.tsx        # Корзина
│   └── ...
├── contexts/           # React контексты
│   ├── AuthContext.tsx # Аутентификация
│   ├── CartContext.tsx # Корзина
│   └── ...
├── firebase/           # Firebase конфигурация
│   ├── config.ts       # Настройки Firebase
│   ├── auth.ts         # Аутентификация
│   └── services.ts     # Сервисы базы данных
└── types/              # TypeScript типы
    └── index.ts        # Основные интерфейсы
```

## 🎨 Особенности дизайна

- **Градиентные фоны** с эффектом параллакса
- **Стеклянные эффекты** (glassmorphism)
- **Плавные анимации** переходов
- **Адаптивная верстка** для всех устройств
- **Современная типографика** Inter + Oswald

## 🚀 Деплой на Vercel

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения в панели Vercel
3. Деплой произойдет автоматически

## 📄 Лицензия

MIT License

## 👥 Авторы

DreamShop Team