/**
 * Скрипт для повного очищення всіх сиропів та категорій сиропів
 * Запуск: npx ts-node scripts/cleanAllSyrups.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
  authDomain: "dreamshop-odessa.firebaseapp.com",
  projectId: "dreamshop-odessa",
  storageBucket: "dreamshop-odessa.firebasestorage.app",
  messagingSenderId: "941215601569",
  appId: "1:941215601569:web:a4e5c1bb2892892bbc31e0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanAllSyrups() {
  try {
    console.log('🧹 Починаємо повне очищення сиропів...');
    
    // 1. Видаляємо ВСІ товари зі словом "Сироп" або "сироп" в назві
    const productsRef = collection(db, 'products');
    const allProducts = await getDocs(productsRef);
    
    let deletedProducts = 0;
    console.log(`📦 Перевіряємо ${allProducts.size} товарів...`);
    
    for (const docSnapshot of allProducts.docs) {
      const data = docSnapshot.data();
      const name = (data.name || '').toLowerCase();
      
      // Видаляємо якщо в назві є "сироп" або категорія = "syropy"
      if (name.includes('сироп') || name.includes('syrop') || data.category === 'syropy') {
        await deleteDoc(doc(db, 'products', docSnapshot.id));
        deletedProducts++;
        
        if (deletedProducts % 10 === 0) {
          console.log(`🗑️ Видалено товарів: ${deletedProducts}`);
        }
      }
    }
    
    console.log(`✅ Видалено ${deletedProducts} товарів-сиропів`);
    
    // 2. Видаляємо ВСІ категорії зі словом "сироп" в назві або slug
    const categoriesRef = collection(db, 'categories');
    const allCategories = await getDocs(categoriesRef);
    
    let deletedCategories = 0;
    console.log(`📁 Перевіряємо ${allCategories.size} категорій...`);
    
    for (const docSnapshot of allCategories.docs) {
      const data = docSnapshot.data();
      const name = (data.name || '').toLowerCase();
      const slug = (data.slug || '').toLowerCase();
      
      // Видаляємо якщо в назві або slug є "сироп"
      if (name.includes('сироп') || name.includes('syrop') || slug.includes('syrop')) {
        await deleteDoc(doc(db, 'categories', docSnapshot.id));
        deletedCategories++;
        console.log(`🗑️ Видалено категорію: ${data.name} (${docSnapshot.id})`);
      }
    }
    
    console.log(`✅ Видалено ${deletedCategories} категорій сиропів`);
    console.log('\n🎉 Повне очищення завершено!');
    console.log('Тепер можна запустити: npx ts-node scripts/addSyrups.ts');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при очищенні:', error);
    process.exit(1);
  }
}

cleanAllSyrups();
