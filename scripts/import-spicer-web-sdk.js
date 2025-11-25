// Упрощенный импорт через Firebase Web SDK (без Admin SDK)
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Ваша Firebase конфигурация
const firebaseConfig = {
  apiKey: "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
  authDomain: "dreamshop-odessa.firebaseapp.com",
  projectId: "dreamshop-odessa",
  storageBucket: "dreamshop-odessa.firebasestorage.app",
  messagingSenderId: "941215601569",
  appId: "1:941215601569:web:a4e5c1bb2892892bbc31e0",
  measurementId: "G-KZHPZJXTS1"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

        // Формируем объект товара с обязательным полем brand
        const productData = {
          name: product.title,
          title: product.title,
          description: product.description || '',
          fullDescription: product.fullDescription || '',
          price: parseFloat(product.price) || 0,
          image: product.imageUrl,
          imageUrl: product.imageUrl,
          volume: product.volume || '',
          category: category || 'spicer',
          ingredients: product.ingredients ? product.ingredients.split(',').map(s=>s.trim()).filter(Boolean) : [],
          alcoholContent: product.alcoholContent || '',
          brand: 'spicer', // 🔥 КРИТИЧЕСКИ ВАЖНОЕ ПОЛЕ
          isSpicer: true,   // Дополнительный флаг для удобства
          isPopular: false,
          organic: false,
          inStock: true,
          createdAt: serverTimestamp(),
          sourceLink: product.link || ''
        };

        // Добавляем в коллекцию products
        await addDoc(collection(db, 'products'), productData);
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
