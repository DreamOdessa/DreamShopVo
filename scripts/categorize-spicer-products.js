// Этот скрипт нужно запустить в браузерной консоли на странице с инициализированным Firebase
// Или использовать через импорт в React компоненте

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, writeBatch, doc, serverTimestamp } = require('firebase/firestore');

// Конфигурация Firebase (используем ту же, что в приложении)
const firebaseConfig = {
  apiKey: "AIzaSyDGMbXKe_w_gvfFoSCjCcVFk2rwGQ-i9w4",
  authDomain: "dreamshop-aa16d.firebaseapp.com",
  projectId: "dreamshop-aa16d",
  storageBucket: "dreamshop-aa16d.firebasestorage.app",
  messagingSenderId: "1001992730683",
  appId: "1:1001992730683:web:dbb4cd05b3cfbbc05fcc1f",
  measurementId: "G-P3QHCG0M5Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Правила категоризации на основе названия товара
function categorizeProduct(title) {
  const lowerTitle = title.toLowerCase();
  
  // ДЖИН
  if (lowerTitle.includes('gin') || lowerTitle.includes('джин')) {
    return 'джин';
  }
  
  // ЛІКЕР
  if (lowerTitle.includes('лікер') || lowerTitle.includes('liker') || 
      lowerTitle.includes('liqueur') || lowerTitle.includes('cream')) {
    return 'лікер';
  }
  
  // DISTILL
  if (lowerTitle.includes('distill') || lowerTitle.includes('бренді') || 
      lowerTitle.includes('brandy')) {
    return 'distill';
  }
  
  // НАСТОЯНКИ
  if (lowerTitle.includes('настоян') || lowerTitle.includes('настой') || 
      lowerTitle.includes('infusion') || lowerTitle.includes('тинктура')) {
    return 'настоянки';
  }
  
  // СПАЙСЕРИ (специи, пряности)
  if (lowerTitle.includes('spice') || lowerTitle.includes('спайс') || 
      lowerTitle.includes('spicer') || lowerTitle.includes('том ям') ||
      lowerTitle.includes('чілі') || lowerTitle.includes('chili') ||
      lowerTitle.includes('curry') || lowerTitle.includes('каррі')) {
    return 'спайсери';
  }
  
  // По умолчанию
  return 'спайсери'; // если не удалось определить, считаем спайсером
}

async function updateSpicerProductsCategories() {
  try {
    console.log('🔄 Начинаем обновление категорий товаров Spicer...');
    
    // Получаем все товары Spicer
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('brand', '==', 'spicer'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ Товары Spicer не найдены');
      return;
    }
    
    console.log(`📦 Найдено товаров Spicer: ${snapshot.size}`);
    
    const batch = writeBatch(db);
    let updateCount = 0;
    const categoriesStats = {
      'джин': 0,
      'лікер': 0,
      'distill': 0,
      'спайсери': 0,
      'настоянки': 0
    };
    
    snapshot.forEach((docSnap) => {
      const product = docSnap.data();
      const title = product.name || product.title || '';
      
      // Определяем категорию
      const category = categorizeProduct(title);
      
      // Обновляем только если категория изменилась
      if (product.subcategory !== category) {
        const docRef = doc(db, 'products', docSnap.id);
        batch.update(docRef, {
          subcategory: category,
          category: 'spicer', // основная категория остается spicer
          updatedAt: serverTimestamp()
        });
        
        updateCount++;
        categoriesStats[category]++;
        
        console.log(`✅ ${title} → ${category}`);
      }
    });
    
    // Сохраняем изменения
    if (updateCount > 0) {
      await batch.commit();
      console.log(`\n✨ Успешно обновлено товаров: ${updateCount}`);
      console.log('\n📊 Статистика по категориям:');
      console.log(`   🍸 Джин: ${categoriesStats['джин']}`);
      console.log(`   🥃 Лікери: ${categoriesStats['лікер']}`);
      console.log(`   🍷 Distill: ${categoriesStats['distill']}`);
      console.log(`   🌶️  Спайсери: ${categoriesStats['спайсери']}`);
      console.log(`   🍇 Настоянки: ${categoriesStats['настоянки']}`);
    } else {
      console.log('ℹ️  Все товары уже имеют правильные категории');
    }
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении категорий:', error);
    throw error;
  }
}

// Запуск скрипта
updateSpicerProductsCategories();
