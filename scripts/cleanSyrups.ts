/**
 * Скрипт для видалення старих сиропів (з неправильною структурою)
 * Запуск: npx ts-node scripts/cleanSyrups.ts
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

async function cleanSyrups() {
  try {
    console.log('🧹 Починаємо очищення старих сиропів...');
    
    // Получаем все продукты категории "syropy"
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('category', '==', 'syropy'));
    const snapshot = await getDocs(q);
    
    console.log(`📦 Знайдено ${snapshot.size} сиропів для видалення`);
    
    let deletedCount = 0;
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, 'products', docSnapshot.id));
      deletedCount++;
      
      if (deletedCount % 10 === 0) {
        console.log(`🗑️ Видалено ${deletedCount}/${snapshot.size}`);
      }
    }
    
    console.log(`✅ Видалено ${deletedCount} сиропів`);
    console.log('Тепер можна запустити: npx ts-node scripts/addSyrups.ts');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при видаленні:', error);
    process.exit(1);
  }
}

cleanSyrups();
