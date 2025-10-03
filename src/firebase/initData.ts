import { productService, categoryService } from './services';

// Инициализация категорий
export const initializeCategories = async () => {
  const categories = [
    {
      name: 'Фруктові чіпси',
      slug: 'chips',
      description: 'Хрусткі органічні фруктові чіпси для перекусу та прикраси страв',
      icon: '🍎',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
      isActive: true,
      sortOrder: 1
    },
    {
      name: 'Прикраси для коктейлів',
      slug: 'decorations',
      description: 'Съедобні квіти та декоративні елементи для прикраси напоїв',
      icon: '🌸',
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      isActive: true,
      sortOrder: 2
    },
    {
      name: 'Сиропи',
      slug: 'syrups',
      description: 'Натуральні сиропи для коктейлів та десертів',
      icon: '🍯',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
      isActive: true,
      sortOrder: 3
    },
    {
      name: 'Пюре',
      slug: 'purees',
      description: 'Густі пюре з фруктів для смузі та десертів',
      icon: '🥭',
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
      isActive: true,
      sortOrder: 4
    },
    {
      name: 'Сухоцвіти',
      slug: 'dried_flowers',
      description: 'Сушені квіти та трави для декоративного прикраси страв',
      icon: '🌿',
      image: 'https://images.unsplash.com/photo-1506905925346-04b1e0b2f8d3?w=400',
      isActive: true,
      sortOrder: 5
    }
  ];

  for (const category of categories) {
    try {
      const categoryId = await categoryService.create(category);
      console.log(`✅ Категорія "${category.name}" створена з ID: ${categoryId}`);
    } catch (error) {
      console.error(`❌ Помилка створення категорії "${category.name}":`, error);
      throw error; // Прерываем выполнение при ошибке
    }
  }
};

// Инициализация товаров
export const initializeProducts = async () => {
  const products = [
    {
      name: 'Яблучні чіпси з корицею',
      description: 'Хрусткі органічні яблучні чіпси з додаванням кориці. Ідеальні для перекусу або прикраси десертів.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
      category: 'chips' as const,
      organic: true,
      inStock: true,
      weight: '100г',
      ingredients: ['Яблука', 'Кориця', 'Лимонний сік']
    },
    {
      name: 'Бананові чіпси',
      description: 'Натуральні бананові чіпси без додавання цукру. Багаті калієм та вітамінами.',
      price: 380,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      category: 'chips' as const,
      organic: true,
      inStock: true,
      weight: '100г',
      ingredients: ['Банани', 'Лимонний сік']
    },
    {
      name: 'Съедобні квіти для коктейлів',
      description: 'Набір сушених съедобних квітів для прикраси коктейлів та десертів.',
      price: 320,
      image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
      category: 'decorations' as const,
      organic: true,
      inStock: true,
      weight: '50г',
      ingredients: ['Троянда', 'Лаванда', 'Фіалка', 'Настурція']
    },
    {
      name: 'Полуничний сироп',
      description: 'Натуральний полуничний сироп на основі органічних ягід. Ідеальний для коктейлів та десертів.',
      price: 280,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
      category: 'syrups' as const,
      organic: true,
      inStock: true,
      weight: '250мл',
      ingredients: ['Полуниця', 'Цукор', 'Вода', 'Лимонна кислота']
    },
    {
      name: 'Мангове пюре',
      description: 'Густе пюре зі стиглих манго. Відмінно підходить для смузі та десертів.',
      price: 350,
      image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400',
      category: 'purees' as const,
      organic: true,
      inStock: true,
      weight: '200г',
      ingredients: ['Манго', 'Лимонний сік']
    },
    {
      name: 'Сухоцвіти для прикраси',
      description: 'Набір сушених квітів та трав для декоративного прикраси страв.',
      price: 180,
      image: 'https://images.unsplash.com/photo-1506905925346-04b1e0b2f8d3?w=400',
      category: 'dried_flowers' as const,
      organic: true,
      inStock: true,
      weight: '30г',
      ingredients: ['Ромашка', 'М\'ята', 'Лаванда', 'Розмарин']
    }
  ];

  for (const product of products) {
    try {
      const productId = await productService.create(product);
      console.log(`✅ Товар "${product.name}" створений з ID: ${productId}`);
    } catch (error) {
      console.error(`❌ Помилка створення товару "${product.name}":`, error);
      throw error; // Прерываем выполнение при ошибке
    }
  }
};

// Инициализация всех данных
export const initializeAllData = async () => {
  console.log('🚀 Початок ініціалізації даних...');
  
  try {
    console.log('📁 Ініціалізація категорій...');
    await initializeCategories();
    console.log('✅ Категорії створені');
    
    console.log('📦 Ініціалізація товарів...');
    await initializeProducts();
    console.log('✅ Товари створені');
    
    console.log('🎉 Ініціалізація даних завершена успішно!');
    return { success: true, message: 'Дані успішно ініціалізовані!' };
  } catch (error) {
    console.error('❌ Помилка ініціалізації даних:', error);
    throw error;
  }
};
