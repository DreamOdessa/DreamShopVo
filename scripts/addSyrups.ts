/**
 * Скрипт для массового добавления 80 сиропов в Firebase
 * Запуск: npx ts-node scripts/addSyrups.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Firebase конфигурация (те же данные что в config.ts)
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

// Список сиропов (из файла "Асортимент Сиропов.txt")
const syrupNames = [
  'Абрикос', 'Груша', 'Айва', 'Дика вишня', 'Амаретто', 'Диня жовта',
  'Ананас', 'Диня зелена', 'Апельсин', 'Ожина', 'Апероль', 'Жасмин',
  'Кавун', 'Суниця', 'Бабл Гам', 'Ізабелла (виноград)', 'Базилік', 'Імбирний пряник',
  'Банан жовтий', 'Імбир', 'Банан зелений', 'Ірландський крем', 'Барбарис',
  'Барбарис (Спайсі)', 'Кактус', 'Бейліс', 'Карамель', 'Бергамот', 'Карамель з сіллю',
  'Біттер', 'Ківі', 'Блю Курасао', 'Клен', 'Бузина квітка', 'Полуниця',
  'Ваніль', 'Журавлина', 'Вишня', 'Кокос', 'Гранат', 'Грейпфрут',
  'Копчений', 'Гренадін', 'Кориця', 'Піна Колада', 'Попкорн', 'Крем-сода',
  'Ревінь', 'Лаванда', 'Троянда', 'Лайм', 'Ром', 'Лемонграс',
  'Цукровий тростник', 'Лісова ягода', 'Слива', 'Лимон', 'Тархун', 'Лимонний пиріг',
  'Тірамісу', 'Личі', 'Фіалка', 'Макадамський горіх', 'Фісташка', 'Малина',
  'Фундук', 'Манго', 'Халва', 'Манго пряний', 'Чай зелений', 'Мандарин',
  'Чай чорний', 'Маракуйя', 'Чорна смородина', 'Мед', 'Чорниця', 'Мигдаль',
  'Чилі (пряний)', 'Моджо', 'Шоколад', 'Мохіто ментол', 'Ехінацея', 'М\'ята',
  'Яблуко зелене', 'Огірковий', 'Яблучний пиріг', 'Персик'
];

// URL картинки для всех сиропов
const COMMON_LOGO = 'https://firebasestorage.googleapis.com/v0/b/dreamshop-odessa.firebasestorage.app/o/products%2Fgallery%2F%D0%B4%D0%BB%D1%8F%20%D0%B2%D1%81%D0%B5%D1%85%20%D1%81%D0%B8%D1%80%D0%BE%D0%BF%D0%BE%D0%B2.JPG?alt=media&token=aaba12ef-17f6-42b1-9291-799bcebcdb7b';

// Функция генерации состава на основе названия (на украинском)
// Повертає масив інгредієнтів
function generateIngredients(name: string): string[] {
  return [
    'Цукор',
    'Вода',
    `Натуральний ароматизатор ${name.toLowerCase()}`,
    'Барвник: Е133'
  ];
}

// Функция генерации описания (на украинском)
function generateDescription(name: string): string {
  return `Сироп "${name}" – яскравий та насичений смак для ваших напоїв та десертів. Ідеально підходить для кави, чаю, коктейлів, млинців та морозива.`;
}

// Основная функция добавления сиропов
async function addSyrups() {
  try {
    console.log('🚀 Починаємо додавання сиропів...');
    
    // 1. Проверяем/создаем категорию "Сиропи"
    const categoriesRef = collection(db, 'categories');
    const categoryQuery = query(categoriesRef, where('slug', '==', 'syropy'));
    const categorySnapshot = await getDocs(categoryQuery);
    
    let categoryId = 'syropy';
    
    if (categorySnapshot.empty) {
      console.log('📁 Створюємо категорію "Сиропи"...');
      const categoryDoc = doc(db, 'categories', 'syropy');
      await setDoc(categoryDoc, {
        id: 'syropy',
        slug: 'syropy',
        name: 'СИРОПИ',
        description: 'Широкий асортимент натуральних сиропів для напоїв та десертів',
        image: COMMON_LOGO,
        showInShowcase: true,
        albumImages: [COMMON_LOGO],
        order: 10
      });
      console.log('✅ Категорія створена');
    } else {
      console.log('✅ Категорія "Сиропи" вже існує');
    }
    
    // 2. Добавляем сиропы
    const productsRef = collection(db, 'products');
    let addedCount = 0;
    
    for (const name of syrupNames) {
      const productId = uuidv4();
      const slug = `syrup-${name.toLowerCase().replace(/\s+/g, '-')}`;
      
      const product = {
        id: productId,
        name: `Сироп "${name}"`,
        slug: slug,
        description: generateDescription(name),
        price: 350, // Ціна за 1 літр
        oldPrice: 0, // Без старої ціни
        category: categoryId,
        images: [COMMON_LOGO],
        hoverImage: COMMON_LOGO,
        isActive: true,
        inStock: true,
        isFeatured: false,
        tags: ['сироп', name.toLowerCase(), 'натуральний'],
        ingredients: generateIngredients(name),
        volume: '1 л',
        weight: '1000 мл',
        shelfLife: '12 місяців',
        manufacturer: 'DreamShop',
        country: 'Україна',
        rating: 4.5,
        reviewsCount: 0,
        soldCount: 0,
        createdAt: serverTimestamp(), // Используем serverTimestamp вместо строки
        updatedAt: serverTimestamp()
      };
      
      // Используем setDoc вместо addDoc чтобы id был внутри документа
      const productDoc = doc(db, 'products', productId);
      await setDoc(productDoc, product);
      addedCount++;
      
      // Прогресс каждые 10 товаров
      if (addedCount % 10 === 0) {
        console.log(`✅ Додано ${addedCount}/${syrupNames.length} сиропів`);
      }
    }
    
    console.log(`🎉 Успішно додано ${addedCount} сиропів!`);
    console.log(`📦 Категорія: Сиропи`);
    console.log(`💰 Ціна: 350 грн за 1 літр`);
    console.log(`🖼️ Спільне фото: ${COMMON_LOGO}`);
    console.log('\n⚠️ Не забудь:');
    console.log('1. Перевірити відображення в адмінці');
    console.log('2. Додати фото альбома для категорії (якщо потрібно)');
    console.log('3. Можна додати індивідуальні фото для кожного сиропу пізніше');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Помилка при додаванні сиропів:', error);
    process.exit(1);
  }
}

// Запуск
addSyrups();
