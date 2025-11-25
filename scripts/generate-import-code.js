// Простой скрипт импорта для запуска из корневой папки проекта
const fs = require('fs');
const path = require('path');

// Читаем JSON файл
const jsonPath = path.join(__dirname, '../data/spicer-products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('📦 Товаров в файле:', products.length);
console.log('\n🔥 Скопируйте этот код в консоль Firebase (Firestore Database -> F12):');
console.log('\n---НАЧАЛО КОДА---\n');

const code = `
// Вставьте этот код в консоль браузера на странице Firebase Firestore
const products = ${JSON.stringify(products, null, 2)};

(async () => {
  const db = firebase.firestore();
  console.log('🚀 Начало импорта', products.length, 'товаров...');
  
  let success = 0;
  let errors = 0;
  
  for (const product of products) {
    try {
      let category = product.category || '';
      if (!category && product.link) {
        const match = product.link.match(/product-category\\/([^\\/]+)/);
        if (match) category = match[1];
      }
      
      await db.collection('products').add({
        name: product.title,
        title: product.title,
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
      });
      
      success++;
      if (success % 10 === 0) console.log('✅', success);
    } catch (err) {
      errors++;
      console.error('❌', product.title, err.message);
    }
  }
  
  console.log('\\n✨ Готово! Успешно:', success, 'Ошибок:', errors);
})();
`;

console.log(code);
console.log('\n---КОНЕЦ КОДА---\n');
console.log('📋 Инструкция:');
console.log('1. Откройте Firebase Console: https://console.firebase.google.com/');
console.log('2. Выберите ваш проект: dreamshop-odessa');
console.log('3. Откройте Firestore Database');
console.log('4. Нажмите F12 (откроется консоль браузера)');
console.log('5. Скопируйте код выше и вставьте в консоль');
console.log('6. Нажмите Enter');
console.log('7. Дождитесь завершения импорта\n');

// Сохраняем код в файл для удобства
const outputPath = path.join(__dirname, 'firebase-console-import.js');
fs.writeFileSync(outputPath, code);
console.log('✅ Код также сохранен в:', outputPath);
console.log('   Можете скопировать оттуда!\n');
