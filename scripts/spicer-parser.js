/**
 * Парсер товаров с сайта spicer.ua
 * Извлекает все товары, фото, названия, объемы, описания
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Функция для случайного изменения описания
function randomizeDescription(text) {
  if (!text) return '';
  
  const synonyms = {
    'смак': ['смак', 'присмак', 'відтінок', 'нотки'],
    'аромат': ['аромат', 'запах', 'парфум', 'букет'],
    'ідеально': ['ідеально', 'чудово', 'прекрасно', 'відмінно'],
    'поєднується': ['поєднується', 'гармоніює', 'підходить', 'співає'],
    'унікальний': ['унікальний', 'особливий', 'неповторний', 'виняткový'],
    'натуральний': ['натуральний', 'природний', 'автентичний'],
    'виготовлений': ['виготовлений', 'створений', 'зроблений', 'приготований'],
  };

  let modified = text;
  Object.keys(synonyms).forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const replacement = synonyms[word][Math.floor(Math.random() * synonyms[word].length)];
    modified = modified.replace(regex, replacement);
  });

  return modified;
}

// Основная функция парсинга
async function parseSpicerProducts() {
  console.log('🚀 Запуск парсера spicer.ua...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Устанавливаем User-Agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  let allProducts = [];
  let currentPage = 1;
  const maxPages = 10; // Ограничение на количество страниц

  while (currentPage <= maxPages) {
    const url = currentPage === 1 
      ? 'https://spicer.ua/shop/' 
      : `https://spicer.ua/shop/page/${currentPage}/`;

    console.log(`📄 Парсинг страницы ${currentPage}: ${url}`);

    try {
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      // Ждем загрузку товаров
      await page.waitForSelector('.products .product', { timeout: 10000 });

      // Извлекаем данные о товарах
      const productsOnPage = await page.evaluate(() => {
        const products = [];
        const productElements = document.querySelectorAll('.products .product');

        productElements.forEach(productEl => {
          try {
            // Название товара
            const titleEl = productEl.querySelector('.woocommerce-loop-product__title');
            const title = titleEl ? titleEl.textContent.trim() : '';

            // Ссылка на товар
            const linkEl = productEl.querySelector('.woocommerce-LoopProduct-link');
            const link = linkEl ? linkEl.href : '';

            // Изображение
            const imgEl = productEl.querySelector('img');
            let imageUrl = '';
            if (imgEl) {
              imageUrl = imgEl.src || imgEl.getAttribute('data-src') || imgEl.getAttribute('data-lazy-src') || '';
              // Берем оригинальное изображение (не миниатюру)
              if (imageUrl) {
                imageUrl = imageUrl.replace(/-\d+x\d+\.jpg/, '.jpg').replace(/-\d+x\d+\.png/, '.png');
              }
            }

            // Цена
            const priceEl = productEl.querySelector('.price .woocommerce-Price-amount');
            let price = '';
            if (priceEl) {
              const priceText = priceEl.textContent.trim();
              price = priceText.replace(/[^\d]/g, ''); // Только цифры
            }

            // Атрибут объема
            const volumeEl = productEl.querySelector('.default-attribute');
            const volume = volumeEl ? volumeEl.textContent.trim() : '';

            // Категория (можно извлечь из класса или других атрибутов)
            const classes = productEl.className;
            let category = '';
            const categoryMatch = classes.match(/product_cat-([^\s]+)/);
            if (categoryMatch) {
              category = categoryMatch[1].replace(/-/g, ' ');
            }

            if (title && imageUrl) {
              products.push({
                title,
                link,
                imageUrl,
                price,
                volume,
                category,
                description: '', // Будет заполнено позже
                fullDescription: '',
                ingredients: '',
                alcoholContent: ''
              });
            }
          } catch (err) {
            console.error('Ошибка при парсинге товара:', err);
          }
        });

        return products;
      });

      console.log(`  ✅ Найдено ${productsOnPage.length} товаров на странице ${currentPage}`);
      allProducts = allProducts.concat(productsOnPage);

      // Проверяем, есть ли кнопка "Следующая страница"
      const hasNextPage = await page.evaluate(() => {
        const nextLink = document.querySelector('.woocommerce-pagination .next');
        return nextLink !== null;
      });

      if (!hasNextPage) {
        console.log('  ℹ️ Достигнута последняя страница\n');
        break;
      }

      currentPage++;
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (err) {
      console.error(`❌ Ошибка на странице ${currentPage}:`, err.message);
      break;
    }
  }

  console.log(`\n📊 Всего найдено товаров: ${allProducts.length}`);

  // Теперь заходим на каждую страницу товара для получения подробного описания
  console.log('\n🔍 Получение детальной информации о товарах...\n');

  for (let i = 0; i < allProducts.length; i++) {
    const product = allProducts[i];
    console.log(`  ${i + 1}/${allProducts.length} - ${product.title}`);

    try {
      await page.goto(product.link, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      const details = await page.evaluate(() => {
        let description = '';
        let fullDescription = '';
        let ingredients = '';
        let alcoholContent = '';

        // Краткое описание
        const shortDescEl = document.querySelector('.woocommerce-product-details__short-description');
        if (shortDescEl) {
          description = shortDescEl.textContent.trim();
        }

        // Полное описание (из вкладок)
        const fullDescEl = document.querySelector('#tab-description');
        if (fullDescEl) {
          fullDescription = fullDescEl.textContent.trim();
        }

        // Таблица характеристик
        const additionalInfoTable = document.querySelector('.woocommerce-product-attributes');
        if (additionalInfoTable) {
          const rows = additionalInfoTable.querySelectorAll('tr');
          rows.forEach(row => {
            const label = row.querySelector('th');
            const value = row.querySelector('td');
            if (label && value) {
              const labelText = label.textContent.trim().toLowerCase();
              const valueText = value.textContent.trim();
              
              if (labelText.includes('склад') || labelText.includes('інгредієнти')) {
                ingredients = valueText;
              }
              if (labelText.includes('міцність') || labelText.includes('алкоголь')) {
                alcoholContent = valueText;
              }
            }
          });
        }

        return { description, fullDescription, ingredients, alcoholContent };
      });

      // Рандомизируем описание
      product.description = randomizeDescription(details.description);
      product.fullDescription = randomizeDescription(details.fullDescription);
      product.ingredients = details.ingredients;
      product.alcoholContent = details.alcoholContent;

      // Задержка между запросами к страницам товаров
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (err) {
      console.error(`    ⚠️ Ошибка при получении деталей: ${err.message}`);
    }
  }

  await browser.close();

  // Сохраняем результаты
  const outputDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'spicer-products.json');
  fs.writeFileSync(outputFile, JSON.stringify(allProducts, null, 2), 'utf8');

  console.log(`\n✅ Парсинг завершен!`);
  console.log(`📁 Данные сохранены в: ${outputFile}`);
  console.log(`📦 Всего товаров: ${allProducts.length}`);

  // Статистика
  const stats = {
    total: allProducts.length,
    withImages: allProducts.filter(p => p.imageUrl).length,
    withPrices: allProducts.filter(p => p.price).length,
    withDescriptions: allProducts.filter(p => p.description).length,
    categories: [...new Set(allProducts.map(p => p.category).filter(c => c))],
    volumes: [...new Set(allProducts.map(p => p.volume).filter(v => v))]
  };

  console.log('\n📈 Статистика:');
  console.log(`   С изображениями: ${stats.withImages}`);
  console.log(`   С ценами: ${stats.withPrices}`);
  console.log(`   С описаниями: ${stats.withDescriptions}`);
  console.log(`   Категорий: ${stats.categories.length}`);
  console.log(`   Объемов: ${stats.volumes.length}`);

  return allProducts;
}

// Запуск парсера
parseSpicerProducts().catch(console.error);
