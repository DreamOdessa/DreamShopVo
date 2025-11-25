/**
 * Конвертер спарсенных товаров в формат Firebase
 * Преобразует JSON из парсера в формат для загрузки в Firestore
 */

const fs = require('fs');
const path = require('path');

// Функция генерации уникального ID
function generateId() {
  return 'sp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Функция для извлечения числового значения объема
function parseVolume(volumeStr) {
  if (!volumeStr) return 0;
  const match = volumeStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Категории и их маппинг
const categoryMapping = {
  'dzhyn': 'Джин',
  'likery': 'Лікери',
  'nastoyanky': 'Настоянки',
  'distill': 'Distill',
  'podarunkovi nabory': 'Подарункові набори',
  'aktsii': 'Акції',
  'cocktail ingredients': 'Для коктейлів'
};

function convertToFirebaseFormat(spicerProducts) {
  const firebaseProducts = [];

  spicerProducts.forEach((product, index) => {
    // Пропускаем товары без изображений
    if (!product.imageUrl) return;

    const volumeNum = parseVolume(product.volume);
    const categoryName = categoryMapping[product.category] || product.category || 'Інше';

    const firebaseProduct = {
      id: generateId(),
      name: product.title,
      description: product.description || product.fullDescription || `${product.title} - преміальний алкогольний напій`,
      price: parseFloat(product.price) || 0,
      originalPrice: parseFloat(product.price) || 0, // Можно добавить старую цену
      imageUrl: product.imageUrl,
      hoverImageUrl: product.imageUrl, // Можно использовать ту же картинку
      category: categoryName,
      subcategory: '',
      volume: product.volume || '',
      volumeNumeric: volumeNum,
      alcoholContent: product.alcoholContent || '',
      ingredients: product.ingredients || '',
      inStock: true,
      stockQuantity: 100,
      featured: false,
      discount: 0,
      tags: extractTags(product),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'spicer.ua',
      sourceLink: product.link
    };

    firebaseProducts.push(firebaseProduct);
  });

  return firebaseProducts;
}

function extractTags(product) {
  const tags = [];
  
  if (product.title.toLowerCase().includes('distill')) tags.push('distill');
  if (product.category && product.category.includes('aktsii')) tags.push('акція');
  if (product.volume && product.volume.includes('50')) tags.push('міні');
  if (product.volume && product.volume.includes('700') || product.volume.includes('750')) tags.push('стандарт');
  if (product.volume && (product.volume.includes('1200') || product.volume.includes('1500'))) tags.push('великий');
  if (product.category && product.category.includes('podarunkovi')) tags.push('подарунок');
  
  return tags;
}

// Основная функция
async function convertProducts() {
  console.log('🔄 Конвертация товаров в формат Firebase...\n');

  const inputFile = path.join(__dirname, '../data/spicer-products.json');
  
  if (!fs.existsSync(inputFile)) {
    console.error('❌ Файл с товарами не найден! Сначала запустите парсер: npm run parse');
    return;
  }

  const spicerProducts = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  console.log(`📦 Загружено товаров: ${spicerProducts.length}`);

  const firebaseProducts = convertToFirebaseFormat(spicerProducts);
  console.log(`✅ Конвертировано товаров: ${firebaseProducts.length}`);

  // Сохранение в JSON
  const outputFile = path.join(__dirname, '../data/firebase-products.json');
  fs.writeFileSync(outputFile, JSON.stringify(firebaseProducts, null, 2), 'utf8');
  console.log(`\n💾 Данные сохранены в: ${outputFile}`);

  // Создание категорий
  const categories = [...new Set(firebaseProducts.map(p => p.category))].map(name => ({
    id: 'cat_' + name.toLowerCase().replace(/[^\w]/g, '_'),
    name,
    slug: name.toLowerCase().replace(/[^\w]/g, '-'),
    description: `Категорія ${name}`,
    imageUrl: '',
    productsCount: firebaseProducts.filter(p => p.category === name).length,
    order: 0,
    active: true
  }));

  const categoriesFile = path.join(__dirname, '../data/firebase-categories.json');
  fs.writeFileSync(categoriesFile, JSON.stringify(categories, null, 2), 'utf8');
  console.log(`📂 Категории сохранены в: ${categoriesFile}`);

  // Статистика
  console.log('\n📊 Статистика конвертации:');
  console.log(`   Товаров: ${firebaseProducts.length}`);
  console.log(`   Категорий: ${categories.length}`);
  console.log(`   Средняя цена: ${Math.round(firebaseProducts.reduce((sum, p) => sum + p.price, 0) / firebaseProducts.length)} грн`);
  
  const byCategory = {};
  firebaseProducts.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  
  console.log('\n   По категориям:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`     - ${cat}: ${count} шт`);
  });

  return { products: firebaseProducts, categories };
}

// Запуск конвертера
convertProducts().catch(console.error);
