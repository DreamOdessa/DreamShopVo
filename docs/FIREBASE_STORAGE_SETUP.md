# Настройка Firebase Storage для загрузки медиа

## Что было сделано

✅ Создан сервис для загрузки файлов в Firebase Storage (`src/firebase/storageService.ts`)
✅ Интегрирована загрузка изображений в админ панели
✅ Добавлен прогресс-бар для отслеживания загрузки
✅ Реализовано удаление файлов из Firebase Storage

## Настройка Firebase Storage

### Шаг 1: Настройка правил безопасности

Перейдите в консоль Firebase → Storage → Rules и установите следующие правила:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Разрешаем чтение всем
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Разрешаем запись только аутентифицированным пользователям
    match /products/{imageId} {
      allow write: if request.auth != null;
    }
    
    match /categories/{imageId} {
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{imageId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Для загрузки изображений продуктов (более строгие правила)
    match /products/main/{imageId} {
      allow write: if request.auth != null 
                    && request.resource.size < 5 * 1024 * 1024  // Максимум 5MB
                    && request.resource.contentType.matches('image/.*');
    }
    
    match /products/hover/{imageId} {
      allow write: if request.auth != null 
                    && request.resource.size < 5 * 1024 * 1024
                    && request.resource.contentType.matches('image/.*');
    }
    
    match /products/gallery/{imageId} {
      allow write: if request.auth != null 
                    && request.resource.size < 5 * 1024 * 1024
                    && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Шаг 2: Настройка CORS (если необходимо)

Если вы получаете ошибки CORS, добавьте в консоль Firebase → Storage → Settings → CORS:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

## Использование

### В админ панели

1. **Загрузка главного изображения:**
   - Нажмите "Загрузить главное фото"
   - Выберите изображение (максимум 5MB)
   - Дождитесь завершения загрузки
   - URL автоматически заполнится

2. **Загрузка дополнительного изображения (при наведении):**
   - Нажмите "Загрузить доп фото"
   - Выберите изображение
   - URL автоматически заполнится

3. **Загрузка галереи:**
   - Нажмите "Загрузить изображения в галерею"
   - Выберите до 3 изображений
   - Все изображения загрузятся в Firebase Storage

### Программное использование

```typescript
import { storageService, STORAGE_PATHS } from './firebase/storageService';

// Загрузка одного файла
const url = await storageService.uploadFile(
  file, 
  STORAGE_PATHS.PRODUCT_MAIN_IMAGES,
  (progress) => {
    console.log(`Прогресс: ${progress}%`);
  }
);

// Загрузка нескольких файлов
const urls = await storageService.uploadMultipleFiles(
  files,
  STORAGE_PATHS.PRODUCT_GALLERY,
  (fileIndex, progress) => {
    console.log(`Файл ${fileIndex}: ${progress}%`);
  }
);

// Удаление файла
await storageService.deleteFile(url);

// Удаление нескольких файлов
await storageService.deleteMultipleFiles([url1, url2, url3]);
```

## Структура хранения

```
Firebase Storage
├── products/
│   ├── main/              # Главные изображения товаров
│   │   └── {timestamp}_{filename}
│   ├── hover/             # Дополнительные изображения (при наведении)
│   │   └── {timestamp}_{filename}
│   └── gallery/           # Галерея товаров
│       └── {timestamp}_{filename}
├── categories/            # Изображения категорий
│   └── {timestamp}_{filename}
└── users/                 # Аватары пользователей
    └── {userId}/
        └── {timestamp}_{filename}
```

## Ограничения

- **Размер файла:** максимум 5MB
- **Типы файлов:** только изображения (image/*)
- **Количество в галерее:** максимум 3 изображения
- **Аутентификация:** требуется вход в систему

## Проверка работы

1. Запустите приложение: `npm start`
2. Войдите как администратор
3. Перейдите в админ панель → Товары
4. Нажмите "Добавить товар"
5. Попробуйте загрузить изображение
6. Проверьте консоль Firebase Storage

## Устранение проблем

### Ошибка: "Permission denied"
- Убедитесь, что вы вошли в систему
- Проверьте правила безопасности в Firebase Console

### Ошибка: "File too large"
- Уменьшите размер изображения (максимум 5MB)
- Используйте сжатие изображений

### Ошибка: "Network error"
- Проверьте подключение к интернету
- Проверьте настройки CORS в Firebase Console

### Изображения не загружаются
- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что Firebase Storage включен в проекте
- Проверьте, что у пользователя есть права администратора

## Дополнительные возможности

### Сжатие изображений перед загрузкой

Можно добавить сжатие изображений на клиенте для уменьшения размера файлов:

```typescript
// Пример функции сжатия
const compressImage = async (file: File, maxWidth: number = 1920): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (img.width > maxWidth) {
          canvas.width = maxWidth;
          canvas.height = (img.height * maxWidth) / img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }
        }, 'image/jpeg', 0.8);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
```

### Автоматическое удаление старых изображений

При обновлении товара старые изображения можно удалить автоматически:

```typescript
// В функции handleSaveProduct
if (editingProduct) {
  // Удаляем старые изображения
  const oldImages = editingProduct.images || [];
  const newImages = allImages;
  
  const imagesToDelete = oldImages.filter(
    oldUrl => !newImages.includes(oldUrl)
  );
  
  if (imagesToDelete.length > 0) {
    await storageService.deleteMultipleFiles(imagesToDelete);
  }
  
  updateProduct(editingProduct.id, productData);
}
```

## Безопасность

⚠️ **Важно:**
- Не храните чувствительные данные в Firebase Storage
- Используйте правила безопасности для ограничения доступа
- Регулярно проверяйте загруженные файлы
- Установите лимиты на размер и количество файлов

## Стоимость

Firebase Storage имеет бесплатный тарифный план:
- 5GB хранилища
- 1GB/день скачивания
- 20,000 операций/день

Для больших проектов рассмотрите платные тарифы.

## Полезные ссылки

- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Firebase Storage Rules](https://firebase.google.com/docs/storage/security)
- [Firebase Pricing](https://firebase.google.com/pricing)

