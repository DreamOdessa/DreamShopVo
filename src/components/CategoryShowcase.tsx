import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components'; // Библиотека для стилей
import { motion, AnimatePresence } from 'framer-motion'; // Библиотека для анимаций
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'; // Иконки стрелок
import { Link } from 'react-router-dom'; // Для навигации

// --- ИМПОРТЫ ИЗ ВАШЕГО ПРОЕКТА ---
// Убедитесь, что пути к 'types', 'ProductCard' и 'AdminContext' верны
import { Product, Category } from '../types'; 
import ProductCard from './ProductCard'; 
import { useAdmin } from '../contexts/AdminContext';

// --- ИНТЕРФЕЙСЫ ---

// ИСПРАВЛЕНИЕ ОШИБКИ TS2339 (которую вы видели на скриншоте):
// Cоздаем 'ShowcaseCategory', который "расширяет" (extends) ваш тип 'Category'
// и добавляет в него обязательное поле 'products'.
interface ShowcaseCategory extends Category {
  products: Product[];
}

// 'CategoryItemProps' - описывает "пропсы" для компонента 'CategoryItem'
interface CategoryItemProps {
  category: ShowcaseCategory; // Используем наш новый, расширенный тип
  layout: 'left' | 'right'; // Указывает, где будет альбом (слева или справа)
}

// --- СТИЛИ (Styled Components) ---

// 'ShowcaseContainer' - самый внешний контейнер
const ShowcaseContainer = styled.section`
  // Вертикальный отступ для всей секции
  padding: 4rem 0;
  background: white;
  overflow: hidden; // Предотвращаем горизонтальный скролл из-за анимаций
`;

// 'CategoryContainer' - контейнер для ОДНОГО ряда (Альбом + Карусель)
const CategoryContainer = styled.div<{ layout: 'left' | 'right' }>`
  display: flex; // Включаем Flexbox
  // 'props.layout === 'right' ? 'row' : 'row-reverse'
  // Если layout='right' (альбом справа), то 'row' (Карусель | Альбом)
  // Если layout='left' (альбом слева), то 'row-reverse' (Альбом | Карусель)
  flex-direction: ${props => props.layout === 'right' ? 'row' : 'row-reverse'};
  gap: 0; // Убираем зазор, чтобы альбом прилегал к краю
  width: 100%; // Занимает всю ширину
  max-width: 100%; // Не даём выйти за пределы
  margin: 0;
  padding: 0; // Убираем внутренние отступы
  box-sizing: border-box;
  position: relative; // Для позиционирования альбома
  overflow: visible; // Разрешаем альбому вылезать за края

  // Адаптация для мобильных:
  @media (max-width: 992px) {
    flex-direction: column; // Ставим блоки друг под друга (Альбом сверху, Карусель снизу)
  }
`;

// 'CarouselContainer' - контейнер для колонки с каруселью (45%)
const CarouselContainer = styled.div<{ layout: 'left' | 'right' }>`
  flex: 0 0 60%; // Карусель занимает 60% ширины
  padding: 0rem; // Уменьшили padding, чтобы карточки были ближе к альбому
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center; // Центрируем контент по вертикали
  min-width: 0; // Важно для flex-элементов, чтобы они могли сжиматься
  position: relative; /* для градиентной маски */
  /* Негативный отступ на стороне ПРОТИВОЛОЖНОЙ альбому, чтобы карточки "выглядывали" */
  ${props => props.layout === 'right' ? 'margin-left:-42px;' : 'margin-right:-42px;'}
  overflow: visible; /* позволяем треку выходить чуть наружу */

  @media (max-width: 992px) {
    flex: auto; // На мобильных занимает авто-ширину
    width: 100%;
    padding: 1.5rem;
    margin-left:0;
    margin-right:0;
  }
`;

// 'CarouselContentWrapper' - Внутренняя обертка
// Выравниваем контент к стороне альбома (не по центру)
const CarouselContentWrapper = styled.div<{ layout: 'left' | 'right' }>`
  width: 100%;
  max-width: 700px; // Ограничиваем контент карусели
  /* Прижимаем контент к стороне альбома */
  margin: ${props => props.layout === 'right' ? '0 0 0 auto' : '0 auto 0 0'};
  position: relative; /* для линии растягивающейся влево */
`;

// Полноширинная линия - выходит за пределы всех контейнеров
const FullWidthLine = styled.hr`
  position: relative;
  border: none;
  height: 2px;
  background: #3f3f3f;
  width: 200vw;
  margin: 1.25rem 0;
  left: 50%;
  transform: translateX(-50%);
`;

// 'CategoryHeader' - контейнер для Заголовка и Линии
const CategoryHeader = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center; // Центрируем линии и текст
`;

// 'CategoryTitle' - Заголовок (ФРУКТОВЫЕ ЧИПСЫ) - кликабельный
const CategoryTitle = styled(Link)`
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50ff;
  margin: 0;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none; // Убираем подчеркивание ссылки
  transition: color 0.3s ease;
  
  &:hover {
    color: #00acc1; // Цвет при наведении
    cursor: pointer;
  }
`;

// 'CategoryDescription' - Описание (КРАТКОЕ ОПИСАНИЕ...)
const CategoryDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757dff;
  line-height: 1.6;
  text-transform: uppercase;
  text-align: center;
  margin-top: 1.5rem; // Отступ от заголовка
`;

// 'SliderContainer' - Контейнер, который "обрезает" карусель
const SliderContainer = styled.div<{ layout: 'left' | 'right' }>`
  position: relative;
  overflow: visible; /* даем треку возможность выходить за край */
  padding: 0;
  box-sizing: border-box;
  /* Градиентная маска на стороне, соприкасающейся с альбомом */
  &::after {
    content: '';
    pointer-events: none;
    position: absolute;
    top: 0;
    ${props => props.layout === 'right' ? 'right: 0;' : 'left: 0;'}
    width: 160px;
    height: 100%;
    background: ${props => props.layout === 'right'
      ? 'linear-gradient(to left, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)'
      : 'linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)'};
    /* лёгкая дымка */
  }
`;

// 'SliderTrack' - Сама "лента" (track) с карточками, которая едет
const SliderTrack = styled(motion.div)`
  display: flex;
  gap: 1rem; // УБРАЛИ GAP (как вы просили, убираем рамки)
  align-items: stretch; // Карточки выравниваются по высоте
`;

// 'ItemWrapper' - Обертка для каждой карточки (задает ширину)
const ItemWrapper = styled.div<{ itemsPerView: number }>`
  // 'flex: 0 0 calc(100% / ${props => props.itemsPerView})'
  // (100% / 2.5) = 40% ширины.
  flex: 0 0 calc(100% / ${props => props.itemsPerView});
  box-sizing: border-box;
  padding: 0; // УБРАЛИ PADDING (как вы просили, убираем рамки)
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0; // Предотвращаем "сжатие" карточек

  // Гарантируем, что сам ProductCard (обычно <a>) растягивается
  & > * {
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

// 'ArrowButton' - Стили для стрелок карусели
const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 8px' : 'right: 8px'};
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  color: #00acc1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: 4;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    background: #00acc1;
    color: white;
    transform: translateY(-50%) scale(1.05);
  }
  
  // Стиль для отключенной кнопки
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    background: #f0f0f0;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

// 'AlbumContainer' - Контейнер для колонки с Альбомом (40%)
// Прижимается вплотную к краю экрана используя отрицательный margin
const AlbumContainer = styled(motion.div)`
  flex: 0 0 40%; // Альбом занимает 40%
  min-height: 300px;
  height: auto;
  aspect-ratio: 13 / 9; // Соотношение сторон для альбома
  position: relative;
  overflow: hidden;
  border-radius: 0; // Без скругления углов - полностью flush
  margin: 0; // Без отступов
  padding: 0; // Без внутренних отступов

  @media (max-width: 992px) {
    flex: auto;
    width: 100%;
    min-height: 220px;
    aspect-ratio: 13 / 7.5;
  }
`;

// 'AlbumImage' - Сама картинка в Альбоме
const AlbumImage = styled(motion.img)`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover; // Фото адаптируется под контейнер (не искажается)
  object-position: center;
  left: 0;
  top: 0;
`;

// 'SectionDivider' - НОВЫЙ КОМПОНЕНТ
// (Линия на 100% ширины, *между* блоками категорий)
const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid #f1f1f1ff; // Еле заметная линия
  margin: 0 auto;
  width: 90%; // 90% от ширины экрана
`;
// --- КОМПОНЕНТЫ ---

// ==========================================================
// Компонент "Альбом" (Авто-смена фото)
// ==========================================================
const Album: React.FC<{ images: string[]; layout: 'left' | 'right' }> = ({ images, layout }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Смена каждые 4 секунды

    return () => clearInterval(timer);
  }, [images]);

  if (!images || images.length === 0) {
    // Возвращаем заглушку, если у категории нет фото для альбома
    return (
      <AlbumContainer 
        style={{ background: '#eee', minHeight: '400px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    ); 
  }

  return (
    <AlbumContainer
      // Анимация появления альбома
      initial={{ 
        opacity: 0, 
        x: layout === 'right' ? 100 : -100, // Появляется со стороны края (право/лево)
        scale: 0.9
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        scale: 1
      }}
      transition={{ 
        duration: 0.9,
        delay: 0.4, // Задержка относительно контейнера - разрыв перед появлением
        ease: [0.25, 0.1, 0.25, 1]
      }}
      viewport={{ 
        once: true,
        amount: 0.3
      }}
    >
      <AnimatePresence mode="wait">
        <AlbumImage
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt={`Album image ${currentImageIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
    </AlbumContainer>
  );
};


// ==========================================================
// НОВАЯ, УПРОЩЕННАЯ ЛОГИКА ProductSlider
// (Эта логика исправляет баг с "Сиропами" и 1-2 товарами)
// ==========================================================
const ProductSlider: React.FC<{
  products: Product[];
  categoryName: string;
  categoryDescription: string;
  layout: 'left' | 'right';
  categorySlug: string; // Добавляем slug для ссылки
}> = ({ products, categoryName, categoryDescription, layout, categorySlug }) => {
  const [itemsPerView, setItemsPerView] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 992 ? 1.5 : 2.5
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const totalItems = products.length;

  // Обновляем itemsPerView при ресайзе
  useEffect(() => {
    const onResize = () => {
      const newVal = window.innerWidth <= 992 ? 1.5 : 2.5;
      setItemsPerView(newVal);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Вычисляем максимальный *индекс* для прокрутки
  // Math.ceil() гарантирует, что мы можем прокрутить до последнего элемента
  const maxIndex = Math.max(0, Math.ceil(totalItems - itemsPerView));
  
  // При изменении maxIndex (например, ресайз), убеждаемся, что currentIndex не выходит за пределы
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex, totalItems]); // Добавил totalItems


  const handleNext = () => {
    // Двигаемся на 1, но не дальше maxIndex
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    // Двигаемся на 1, но не меньше 0
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Рассчитываем сдвиг для SliderTrack
  // Умножаем currentIndex на ширину ОДНОГО элемента (100% / itemsPerView)
  const translateX = totalItems > 0 ? `calc(-${currentIndex * (100 / itemsPerView)}%)` : '0%';
  
  // Не показываем стрелки, если все товары и так влезают
  const showArrows = totalItems > itemsPerView;

  return (
    <CarouselContentWrapper layout={layout}> {/* Обертка для центрирования */}
      <FullWidthLine /> {/* Линия на всю ширину над заголовком */}
      <CategoryHeader>
        <CategoryTitle to={`/products?category=${categorySlug}`}>
          {categoryName}
        </CategoryTitle>
      </CategoryHeader>

      <SliderContainer layout={layout}>
        <SliderTrack
          ref={trackRef}
          animate={{ x: translateX }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {products.map((product, idx) => (
            <ItemWrapper key={`${product.id}-${idx}`} itemsPerView={itemsPerView}>
              <ProductCard product={product} />
            </ItemWrapper>
          ))}
        </SliderTrack>

        {showArrows && (
          <>
            <ArrowButton
              direction="left"
              onClick={handlePrev}
              aria-label="Previous slide"
              disabled={currentIndex === 0}
            >
              <FiChevronLeft size={24} />
            </ArrowButton>

            <ArrowButton
              direction="right"
              onClick={handleNext}
              aria-label="Next slide"
              // Сравниваем с maxIndex. Если товаров мало, maxIndex будет 0, и кнопка будет disabled
              disabled={currentIndex >= maxIndex}
            >
              <FiChevronRight size={24} />
            </ArrowButton>
          </>
        )}
      </SliderContainer>
      
      <CategoryDescription>{categoryDescription}</CategoryDescription>
      <FullWidthLine /> {/* Линия на всю ширину под описанием */}
      
    </CarouselContentWrapper>
  );
};
// ==========================================================
// Компонент "CategoryItem" (Собирает Карусель и Альбом в 1 ряд)
// ==========================================================
// 'CategoryItem' - это React.FC, который принимает 'category' (наши обогащенные данные)
// и 'layout' ('left' или 'right')
const CategoryItem: React.FC<CategoryItemProps> = ({ category, layout }) => {
  // 'return' - рендерим JSX
  return (
    // 'CategoryContainer' - <div> (flex-контейнер на 100% ширины)
    // 'layout={layout}' - передаем 'left' или 'right', чтобы он знал, как (row или row-reverse)
    <CategoryContainer layout={layout}>
      
      {/* 'CarouselContainer' - <div> (колонка 45%) */}
      <CarouselContainer layout={layout}>
        {/* 'ProductSlider' - наш компонент карусели */}
        <ProductSlider
          // 'products={category.products}' - передаем *только* товары этой категории
          products={category.products}
          // 'categoryName={category.name}' - передаем название
          categoryName={category.name}
          // 'categoryDescription={category.description}' - передаем описание
          categoryDescription={category.description}
          layout={layout}
          // 'categorySlug' - id категории для ссылки на страницу категории (Products.tsx фильтрует по id)
          categorySlug={category.id}
        />
      </CarouselContainer>
      
      {/* 'Album' - наш компонент альбома (колонка 55%) */}
      {/* 'category.albumImages || []' - передаем массив картинок. Если его нет (undefined),
          передаем пустой массив [], чтобы компонент 'Album' не сломался. */}
      <Album images={category.albumImages || []} layout={layout} />
      
    </CategoryContainer>
  );
};

// ==========================================================
// ГЛАВНЫЙ КОМПОНЕНТ "CategoryShowcase" (Экспортируется по умолчанию)
// ==========================================================
// 'CategoryShowcase' - это главный компонент, который мы будем вставлять в Home.tsx
const CategoryShowcase: React.FC = () => {
  
  // --- Получение данных ---
  
  // 'useAdmin()' - получаем *все* продукты и *все* категории из админки (из вашего Context)
  const { products, categories: adminCategories } = useAdmin();
  
  // --- Состояние (State) ---
  
  // 'categories' - здесь будут лежать *только* те категории,
  // которые мы хотим показать, *вместе* с их отфильтрованными товарами.
  // Используем наш 'ShowcaseCategory[]' (расширенный тип).
  const [categories, setCategories] = useState<ShowcaseCategory[]>([]);

  // --- Эффект (Effect) ---
  
  // 'useEffect' - этот код сработает 1 раз при "рождении" компонента
  // и *каждый раз*, когда 'adminCategories' или 'products' изменятся (придут из Firebase).
  useEffect(() => {
    // Приводим 'products' к типу 'Product[]' (на случай, если они 'undefined')
    const allProducts: Product[] = products || [];
    // Приводим 'adminCategories' к типу 'Category[]' (из /types)
    const allCategories: Category[] = adminCategories || [];
    
    // Убеждаемся, что у нас есть и категории, и продукты для работы
    if (allCategories.length > 0 && allProducts.length > 0) {
      
      // 'showcase' - это *новый* массив, который мы "собираем".
      const showcase: ShowcaseCategory[] = allCategories // Явно указываем тип
        
        // --- Шаг 1: Фильтруем Категории ---
        
        // .filter(c => c.showInShowcase === true)
        // Оставляем *только* те категории, у которых в админке стоит галочка 'showInShowcase'
        .filter(c => c.showInShowcase === true)
        
        // .filter(c => (c.albumImages && ...) || c.image)
        // Оставляем *только* те, у которых есть картинки для альбома
        .filter(c => (c.albumImages && c.albumImages.length > 0) || c.image)
        
        // --- Шаг 2: "Обогащаем" Категории ---
        
        // .map((c) => ({ ... }))
        // "Проходим" по каждой отфильтрованной категории 'c'
        // и возвращаем *новый* объект (типа 'ShowcaseCategory')
        .map((c) => ({
          ...c, // '...c' - копируем *все* старые поля (id, name, slug, ...)
          
          // Перестраховка: 'id' или 'slug'
          id: c.id || c.slug,
          // 'name.toUpperCase()' - приводим к ВЕРХНЕМУ РЕГИСТРУ
          name: (c.name || '').toUpperCase(),
          // 'description.toUpperCase()' - приводим к ВЕРХНЕМУ РЕГИСТРУ
          description: (c.description || '').toUpperCase(),
          
          // 'albumImages: ...' - логика для картинок альбома
          // Если есть 'albumImages' (массив) - используем его.
          // Если нет - используем 'c.image' (одиночную картинку) как массив.
          // Если нет ни того, ни другого - пустой массив [].
          albumImages: c.albumImages && c.albumImages.length > 0 ? c.albumImages : (c.image ? [c.image] : []),
          
          // 'products: ...' - *главное*: добавляем отфильтрованные товары
          // 'allProducts.filter(...)' - ищем в *общем* списке продуктов
          products: allProducts
            // .filter((p: Product) => p.category === (c.slug || c.id) && ...)
            // Оставляем *только* те 'p' (продукты), у которых 'p.category'
            // совпадает с 'c.slug' (или 'c.id') *и* которые 'isActive'
            .filter((p: Product) => p.category === (c.slug || c.id) && p.isActive !== false)
            // .slice(0, 8) - берем только первые 8 найденных товаров
            .slice(0, 8)
        }));
      
      // --- Шаг 3: Сохраняем в состояние ---
      
      // 'setCategories(...)' - обновляем состояние
      // 'showcase.filter(c => c.products.length > 0)'
      // (Доп. фильтр: не показываем блок, если у категории не нашлось *ни одного* активного товара)
      setCategories(showcase.filter(c => c.products.length > 0));
    }
  }, [adminCategories, products]); // Массив зависимостей 'useEffect'
  
  // --- Рендер (JSX) ---
  
  // Если после всех фильтров 'categories' пустой,
  // не рендерим *ничего* (пустой 'null').
  if (categories.length === 0) {
    return null;
  }

  // Если категории есть, рендерим 'ShowcaseContainer'
  return (
    <ShowcaseContainer id="category-showcase">
      
      {/* 'categories.map(...)' - "перебираем" готовые к показу категории */}
      {categories.map((category, index) => (
        
        // 'React.Fragment' - "невидимая" обертка для 'motion.div' и 'SectionDivider'
        // (Мы используем Fragment, чтобы 'key' был на верхнем уровне)
        <React.Fragment key={category.id}>
          
          {/* '<motion.div>' - анимируем появление *всего* блока */}
          <motion.div
            // 'initial' - начальное состояние (до появления в viewport)
            initial={{ opacity: 0, y: 60, scale: 0.95 }} 
            // 'whileInView' - целевое состояние (когда элемент виден на экране)
            whileInView={{ opacity: 1, y: 0, scale: 1 }} 
            // 'transition' - параметры анимации
            transition={{ 
              duration: 0.8, // Длительность анимации 0.8 секунды
              delay: index * 0.15, // Задержка для каждого следующего элемента
              ease: [0.25, 0.1, 0.25, 1], // Кривая easing (плавное замедление)
            }} 
            // 'viewport' - настройки IntersectionObserver
            viewport={{ 
              once: true, // Анимация сработает только 1 раз (не повторяется при обратном скролле)
              amount: 0.2 // Запустить анимацию когда 20% элемента видно на экране
            }} 
            style={{ 
              overflow: 'hidden' // Прячем "вылезание" контента за границы
            }}
          >
            {/* 'CategoryItem' - наш компонент ряда (Альбом + Карусель) */}
            <CategoryItem
              category={category} // Передаем данные категории
              // 'layout={...}' - чередуем 'right' / 'left'
              // index 0: 0%2=0 -> 'right' (альбом справа)
              // index 1: 1%2=1 -> 'left' (альбом слева)
              // index 2: 2%2=0 -> 'right'
              layout={index % 2 === 0 ? 'right' : 'left'}
            />
          </motion.div>
          
          {/* 'SectionDivider' - Линия *между* блоками категорий (на 100% ширины) */}
          {/* (Не рендерим ее *после* самого последнего элемента) */}
          {index < categories.length - 1 && <SectionDivider />}
          
        </React.Fragment>
      ))}
    </ShowcaseContainer>
  );
};

// 'export default' - делаем компонент 'CategoryShowcase' доступным для импорта в других файлах (напр., в Home.tsx)
export default CategoryShowcase;