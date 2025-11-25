# Инструкция по импорту товаров Spicer

## Вариант 1: Импорт через Node.js (рекомендуется)

### Шаг 1: Получить ключ Firebase Admin SDK

1. Перейдите в Firebase Console: https://console.firebase.google.com/
2. Откройте ваш проект
3. Зайдите в **Project Settings** (⚙️ → Project settings)
4. Перейдите на вкладку **Service Accounts**
5. Нажмите **Generate new private key**
6. Скачайте файл и сохраните его как `serviceAccountKey.json` в корень проекта `/workspaces/DreamShopVo/`

### Шаг 2: Запустить импорт

```bash
cd /workspaces/DreamShopVo
node scripts/import-spicer-to-firebase.js
```

---

## Вариант 2: Импорт через Firestore Console (если нет доступа к Admin SDK)

### Способ через код на стороне клиента:

1. Откройте Firebase Console: https://console.firebase.google.com/
2. Откройте **Firestore Database**
3. Откройте браузерную консоль (F12)
4. Вставьте и запустите следующий код:

```javascript
// Загружаем данные из вашего JSON
fetch('/data/spicer-products.json')
  .then(res => res.json())
  .then(async (products) => {
    console.log('Начало импорта', products.length, 'товаров...');
    
    const db = firebase.firestore();
    let count = 0;
    
    for (const product of products) {
      // Извлекаем категорию из URL
      let category = product.category || '';
      if (!category && product.link) {
        const match = product.link.match(/product-category\/([^\/]+)/);
        if (match) category = match[1];
      }
      
      const productData = {
        name: product.title,
        description: product.description || '',
        price: parseFloat(product.price) || 0,
        image: product.imageUrl,
        imageUrl: product.imageUrl,
        volume: product.volume || '',
        category: category || 'spicer',
        ingredients: product.ingredients ? product.ingredients.split(',').map(s=>s.trim()).filter(Boolean) : [],
        brand: 'spicer',
        isSpicer: true,
        isPopular: false,
        organic: false,
        inStock: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      await db.collection('products').add(productData);
      count++;
      
      if (count % 10 === 0) {
        console.log('Импортировано:', count);
      }
    }
    
    console.log('✅ Импорт завершен! Всего:', count);
  })
  .catch(err => console.error('Ошибка:', err));
```

---

## Вариант 3: Пакетный импорт через скрипт без Admin SDK

Создайте файл `import-client-side.html` и откройте его в браузере после авторизации в Firebase Console.

---

## Проверка импорта

После импорта проверьте:

1. Откройте Firestore Database в Firebase Console
2. Найдите коллекцию `products`
3. Проверьте наличие товаров с полем `brand: 'spicer'`
4. Откройте страницу `/spicer-products` на сайте
5. Проверьте фильтрацию по категориям через URL: `/spicer-products?category=dzhyn`

---

## Устранение проблем

### Ошибка: "serviceAccountKey.json not found"
- Используйте Вариант 2 (импорт через консоль)
- Или получите ключ согласно Шагу 1

### Ошибка: "Permission denied"
- Убедитесь, что Firestore правила позволяют запись
- Для теста временно установите правила:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ Только для теста!
    }
  }
}
```

### Дубликаты товаров
- Скрипт создает новые документы каждый раз
- Для избежания дубликатов удалите старые товары Spicer:
```javascript
// В Firebase Console
const db = firebase.firestore();
const batch = db.batch();
const snapshot = await db.collection('products').where('brand', '==', 'spicer').get();
snapshot.forEach(doc => batch.delete(doc.ref));
await batch.commit();
console.log('Удалено товаров:', snapshot.size);
```
