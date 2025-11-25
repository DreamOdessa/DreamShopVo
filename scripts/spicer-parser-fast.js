/**
 * Упрощенный парсер товаров с spicer.ua
 * Быстрая версия - только с главных страниц каталога
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Функция для случайного изменения описания
function randomizeDescription(title, category, volume) {
  const templates = [
    `${title} - преміальний алкогольний напій. Об'єм: ${volume}`,
    `Вишуканий ${title} з категорії ${category}. Відмінний вибір для цінителів якості.`,
    `${title} - ідеальний варіант для особливих випадків. Доступний об'єм: ${volume}`,
    `Унікальний ${title} від Spicer. Створений з любов'ю до деталей.`,
    `${title} - автентичний смак та якість. Категорія: ${category}`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate;
}

// Основная функция парсинга
async function parseSpicerProducts() {
  console.log('🚀 Запуск швидкого парсера spicer.ua...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

  let allProducts = [];
  let currentPage = 1;
  const maxPages = 5; // Проверим до 5 страниц

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

      await page.waitForSelector('.products .product', { timeout: 10000 });

      const productsOnPage = await page.evaluate(() => {
        const products = [];
        const productElements = document.querySelectorAll('.products .product');

        productElements.forEach(productEl => {
          try {
            const titleEl = productEl.querySelector('.woocommerce-loop-product__title');
            const title = titleEl ? titleEl.textContent.trim() : '';

            const linkEl = productEl.querySelector('.woocommerce-LoopProduct-link');
            const link = linkEl ? linkEl.href : '';

            const imgEl = productEl.querySelector('img');
            let imageUrl = '';
            if (imgEl) {
              // Получаем srcset для максимального качества
              const srcset = imgEl.getAttribute('srcset') || '';
              if (srcset) {
                const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
                // Берем самое большое изображение
                imageUrl = urls[urls.length - 1] || imgEl.src;
              } else {
                imageUrl = imgEl.src || imgEl.getAttribute('data-src') || '';
              }
              
              // Убираем размеры из URL
              imageUrl = imageUrl.replace(/-\d+x\d+\.(jpg|png|webp)/i, '.$1');
              // Убираем pagespeed оптимизацию
              imageUrl = imageUrl.replace(/x([^\/]+)\.pagespeed\.ic\.[^.]+\./, '$1.');
            }

            const priceEl = productEl.querySelector('.price .woocommerce-Price-amount');
            let price = '';
            if (priceEl) {
              const priceText = priceEl.textContent.trim();
              price = priceText.replace(/[^\d]/g, '');
            }

            const volumeEl = productEl.querySelector('.default-attribute');
            const volume = volumeEl ? volumeEl.textContent.trim() : '';

            // Категория
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
                category
              });
            }
          } catch (err) {
            console.error('Ошибка при парсинге товара:', err);
          }
        });

        return products;
      });

      console.log(`  ✅ Найдено ${productsOnPage.length} товаров\n`);
      allProducts = allProducts.concat(productsOnPage);

      const hasNextPage = await page.evaluate(() => {
        const nextLink = document.querySelector('.woocommerce-pagination .next');
        return nextLink !== null;
      });

      if (!hasNextPage) {
        console.log('  ℹ️ Достигнута последняя страница\n');
        break;
      }

      currentPage++;
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (err) {
      console.error(`❌ Ошибка на странице ${currentPage}:`, err.message);
      break;
    }
  }

  await browser.close();

  // Удаляем дубликаты по названию+объему
  const uniqueProducts = [];
  const seen = new Set();
  
  allProducts.forEach(p => {
    const key = `${p.title}_${p.volume}`;
    if (!seen.has(key)) {
      seen.add(key);
      // Добавляем описание
      p.description = randomizeDescription(p.title, p.category, p.volume);
      uniqueProducts.push(p);
    }
  });

  console.log(`📊 Всего товаров: ${uniqueProducts.length} (убрано дубликатов: ${allProducts.length - uniqueProducts.length})`);

  // Сохранение
  const outputDir = path.join(__dirname, '../data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFile = path.join(outputDir, 'spicer-products.json');
  fs.writeFileSync(outputFile, JSON.stringify(uniqueProducts, null, 2), 'utf8');

  console.log(`\n✅ Парсинг завершен!`);
  console.log(`📁 Данные сохранены в: ${outputFile}`);

  // Статистика
  const categories = [...new Set(uniqueProducts.map(p => p.category).filter(c => c))];
  const volumes = [...new Set(uniqueProducts.map(p => p.volume).filter(v => v))];

  console.log('\n📈 Статистика:');
  console.log(`   Товаров: ${uniqueProducts.length}`);
  console.log(`   Категорий: ${categories.length} - ${categories.join(', ')}`);
  console.log(`   Объемов: ${volumes.length} - ${volumes.join(', ')}`);
  
  const avgPrice = uniqueProducts
    .filter(p => p.price)
    .reduce((sum, p) => sum + parseInt(p.price), 0) / uniqueProducts.filter(p => p.price).length;
  console.log(`   Средняя цена: ${Math.round(avgPrice)} грн`);

  return uniqueProducts;
}

parseSpicerProducts().catch(console.error);
