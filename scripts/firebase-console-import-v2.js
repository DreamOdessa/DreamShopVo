// ИНСТРУКЦИЯ:
// 1. Откройте https://console.firebase.google.com/project/dreamshop-odessa/firestore
// 2. Нажмите F12 для открытия консоли разработчика
// 3. Скопируйте и вставьте весь этот код
// 4. Нажмите Enter и дождитесь завершения импорта

(async () => {
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
  const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

  const firebaseConfig = {
    apiKey: "AIzaSyBPZW-u_JwGg3j6qY3-Pib_YfhFq5WlHf4",
    authDomain: "dreamshop-odessa.firebaseapp.com",
    projectId: "dreamshop-odessa",
    storageBucket: "dreamshop-odessa.appspot.com",
    messagingSenderId: "1094584929865",
    appId: "1:1094584929865:web:abcd1234"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  console.log('🚀 Начинаем импорт Spicer продуктов в Firebase...');
  
  // Загружаем JSON с вашего GitHub репозитория
  const response = await fetch('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/data/spicer-products.json');
  const products = await response.json();
  
  console.log(`📦 Найдено ${products.length} продуктов для импорта`);
  
  let success = 0;
  let errors = 0;
  
  for (const product of products) {
    try {
      // Определяем категорию на основе URL
      let category = 'інше';
      if (product.link.includes('/dzhyn/')) category = 'джин';
      else if (product.link.includes('/nastojanky/')) category = 'настоянки';
      else if (product.link.includes('/dystyliat/')) category = 'дистиляти';
      else if (product.link.includes('/likery/')) category = 'лікери';
      else if (product.link.includes('/spajsery/')) category = 'спайсери';
      
      const docData = {
        name: product.title,
        price: parseFloat(product.price) || 0,
        category: category,
        description: product.description || '',
        imageUrl: product.imageUrl || product.image || '',
        brand: 'spicer',
        isSpicer: true,
        volume: product.volume || '',
        fullDescription: product.fullDescription || '',
        ingredients: product.ingredients || '',
        alcoholContent: product.alcoholContent || '',
        link: product.link || '',
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'products'), docData);
      success++;
      if (success % 10 === 0) console.log(`✅ Импортировано: ${success}/${products.length}`);
    } catch (error) {
      errors++;
      console.error(`❌ Ошибка импорта "${product.title}":`, error.message);
    }
  }
  
  console.log('\n✨ Готово! Успешно:', success, 'Ошибок:', errors);
})();
