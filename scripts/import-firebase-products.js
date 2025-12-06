#!/usr/bin/env node

/**
 * Скрипт для імпорту товарів з firebase-products.json в Firestore
 * Запуск: node scripts/import-firebase-products.js
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Ініціалізація Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : require('../firebase-service-account.json'); // Локальний файл для розробки

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    projectId: 'dreamshop-odessa'
  });
}

const db = admin.firestore();
const productsCollection = 'products';

async function importProducts() {
  try {
    console.log('🚀 Починаємо імпорт товарів...\n');

    // Читаємо JSON файл
    const jsonPath = path.join(__dirname, '../data/firebase-products.json');
    const productsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`📦 Знайдено ${productsData.length} товарів для імпорту\n`);

    // Батч для ефективного імпорту
    let batch = db.batch();
    let count = 0;
    const batchSize = 500; // Firebase має ліміт на 500 операцій на батч

    for (const product of productsData) {
      try {
        // Перетворюємо поля під формат Product типу
        const firestoreProduct = {
          name: product.name || product.title || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
          image: product.imageUrl || product.image || '',
          images: [
            product.imageUrl || product.image || '',
            product.hoverImageUrl || ''
          ].filter(Boolean),
          category: product.category || 'Інше',
          subcategory: product.subcategory || undefined,
          organic: Boolean(product.organic),
          inStock: product.inStock !== false,
          isActive: true,
          isPopular: Boolean(product.featured),
          weight: product.weight || undefined,
          volume: product.volume || undefined,
          ingredients: product.ingredients ? 
            (Array.isArray(product.ingredients) ? product.ingredients : [product.ingredients]) 
            : undefined,
          brand: 'spicer', // Визначаємо як Spicer товар
          isSpicer: true,
          createdAt: product.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Додаємо в батч
        const docRef = db.collection(productsCollection).doc(product.id);
        batch.set(docRef, firestoreProduct);
        count++;

        // Якщо батч повний - робимо commit та створюємо новий
        if (count % batchSize === 0) {
          await batch.commit();
          console.log(`✅ Завантажено ${count} товарів...`);
          batch = db.batch();
        }
      } catch (error) {
        console.error(`❌ Помилка при обробці товару "${product.name}":`, error.message);
      }
    }

    // Комітимо останній батч
    if (count % batchSize !== 0) {
      await batch.commit();
    }

    console.log(`\n✅ Успішно імпортовано ${count} товарів у Firestore!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Критична помилка при імпорті:', error);
    process.exit(1);
  }
}

importProducts();
