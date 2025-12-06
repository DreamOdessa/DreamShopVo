const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Инициализация Firebase Admin SDK
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importSpicerProducts() {
  try {
    console.log('🚀 Начало импорта товаров Spicer...');
    
    // Загружаем данные из JSON
    const spicerData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/spicer-products.json'), 'utf8')
    );

    console.log(`📦 Найдено ${spicerData.length} товаров для импорта`);

    let successCount = 0;
    let errorCount = 0;

    // Импортируем каждый товар
    for (const product of spicerData) {
      try {
        // Извлекаем категорию из URL, если она пустая
        let category = product.category || '';
        if (!category && product.link) {
          const urlMatch = product.link.match(/product-category\/([^\/]+)/);
          if (urlMatch) {
            category = urlMatch[1];
          }
        }

        // Определяем подкатегорию на основе ссылки или названия
        let subcategory = '';
        if (product.link) {
          const urlMatch = product.link.match(/product-category\/([^\/]+)/);
          if (urlMatch) {
            subcategory = urlMatch[1]; // gin, tinctures, distill, liqueurs, spicers
          }
        }

        // Формируем объект товара с обязательным полем brand
        const productData = {
          name: product.title,
          title: product.title,
          description: product.description || '',
          fullDescription: product.fullDescription || '',
          price: parseFloat(product.price) || 0,
            // храним в двух полях для совместимости
          imageUrl: product.imageUrl,
          image: product.imageUrl,
          volume: product.volume || '',
          category: category || 'spicer',
          subcategory: subcategory || undefined, // Подкатегория для фильтрации
          ingredients: product.ingredients ? product.ingredients.split(',').map(s=>s.trim()).filter(Boolean) : [],
          alcoholContent: product.alcoholContent || '',
          brand: 'spicer', // 🔥 КРИТИЧЕСКИ ВАЖНОЕ ПОЛЕ
          isSpicer: true,   // Дополнительный флаг для удобства
          isPopular: false,
          organic: false,
          inStock: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          sourceLink: product.link || ''
        };

        // Добавляем в коллекцию products
        await db.collection('products').add(productData);
        successCount++;
        
        if (successCount % 50 === 0) {
          console.log(`✅ Импортировано ${successCount} товаров...`);
        }
      } catch (error) {
        errorCount++;
        console.error(`❌ Ошибка при импорте товара "${product.title}":`, error.message);
      }
    }

    console.log('\n✨ Импорт завершен!');
    console.log(`✅ Успешно: ${successCount}`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📊 Всего обработано: ${spicerData.length}`);

  } catch (error) {
    console.error('💥 Критическая ошибка:', error);
  } finally {
    process.exit();
  }
}

// Запуск импорта
importSpicerProducts();
