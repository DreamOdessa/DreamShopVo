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
  albumVideos?: string[]; // optional silent short videos
}

// 'CategoryItemProps' - описывает "пропсы" для компонента 'CategoryItem'
interface CategoryItemProps {
  category: ShowcaseCategory; // Используем наш новый, расширенный тип
  layout: 'left' | 'right'; // Указывает, где будет альбом (слева или справа)
}

// --- СТИЛИ (Styled Components) ---

// 'ShowcaseContainer' - самый внешний контейнер
const ShowcaseContainer = styled.section`
  padding: 4rem 0;
  background: transparent;
  width: 100%;
  overflow: visible;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 1200px) {
    padding: 3rem 0;
  }
  @media (max-width: 768px) {
    padding: 2rem 0;
  }
  @media (max-width: 480px) {
    padding: 1.5rem 0;
  }
`;

// 'CategoryContainer' - контейнер для ОДНОГО ряда (Альбом + Карусель)
const CategoryContainer = styled.div<{ layout: 'left' | 'right' }>`
  display: flex;
  flex-direction: ${props => props.layout === 'right' ? 'row' : 'row-reverse'};
  gap: 0;
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(-50vw + 50%);
  padding: 0;
  box-sizing: border-box;
  position: relative;
  overflow: visible;

  @media (max-width: 1200px) {
    flex-direction: column !important; /* На планшетах всегда вертикально */
  }
  @media (max-width: 992px) {
    flex-direction: column !important;
  }
  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }
`;

// 'CarouselContainer' - контейнер для колонки с каруселью
const CarouselContainer = styled.div<{ layout: 'left' | 'right' }>`
  flex: 0 0 58%;
  padding: 0 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  position: relative;
  overflow: visible;
  z-index: 2;

  @media (max-width: 1200px) {
    flex: auto;
    width: 100%;
    padding: 2rem 1.5rem;
  }
  @media (max-width: 992px) {
    flex: auto;
    width: 100%;
    padding: 1.5rem 1rem;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

// 'CarouselContentWrapper' - Внутренняя обертка
const CarouselContentWrapper = styled.div<{ layout: 'left' | 'right' }>`
  width: 100%;
  max-width: 100%; // Используем всю доступную ширину
  margin: 0;
  position: relative;
`;

// Обёртка для линии на всю ширину экрана
const LineWrapper = styled.div`
  position: relative;
  width: 200vw;
  left: 50%;
  transform: translateX(-50%);
  height: 2px;
  margin: 1.25rem 0;
  z-index: 1;

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
  @media (max-width: 480px) {
    margin: 0.75rem 0;
  }
`;

// Полноширинная линия - на 100% ширины
const FullWidthLine = styled.hr`
  border: none;
  height: 2px;
  background: #3f3f3f;
  width: 100%;
  margin: 0;
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
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #00acc1;
    cursor: pointer;
  }

  @media (max-width: 1200px) {
    font-size: 1.8rem;
  }
  @media (max-width: 992px) {
    font-size: 1.6rem;
  }
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

// 'CategoryDescription' - Описание (КРАТКОЕ ОПИСАНИЕ...)
const CategoryDescription = styled.p`
  font-size: 1.1rem;
  color: #495d6eff;
  line-height: 1.6;
  text-transform: uppercase;
  text-align: center;
  margin-top: 1.5rem;

  @media (max-width: 1200px) {
    font-size: 1rem;
    margin-top: 1.2rem;
  }
  @media (max-width: 992px) {
    font-size: 0.95rem;
    margin-top: 1rem;
  }
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-top: 0.8rem;
    line-height: 1.5;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
    margin-top: 0.6rem;
    line-height: 1.4;
  }
`;

// 'SliderContainer' - Контейнер, который "обрезает" карусель
const SliderContainer = styled.div<{ layout: 'left' | 'right' }>`
  position: relative;
  overflow: hidden; // На десктопе скрываем overflow
  padding: 0;
  box-sizing: border-box;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome/Safari */

  /* На мобільних увімкнути свайп */
  @media (max-width: 992px) {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
`;

// 'SliderTrack' - Сама "лента" (track) с карточками, которая едет
const SliderTrack = styled(motion.div)`
  display: flex;
  gap: 1rem;
  align-items: stretch; // Карточки выравниваются по высоте
`;

// 'ItemWrapper' - Обертка для каждой карточки (задает ширину)
const ItemWrapper = styled.div<{ itemsPerView: number }>`
  flex: 0 0 calc(100% / ${props => props.itemsPerView});
  box-sizing: border-box;
  padding: 0;
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
  background: #02535eff;
  color: #d8e4e6ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  z-index: 4;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    background: #04c2dbff;
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

  /* Ховаємо кнопки на мобільних */
  @media (max-width: 992px) {
    display: none;
  }
`;

// 'AlbumContainer' - Контейнер для колонки с Альбомом (40%)
// Прижимается вплотную к краю экрана
// 'AlbumContainer' - Контейнер для колонки с Альбомом с фиксированным фоном
// Растягивается от края до края браузера
const AlbumContainer = styled(motion.div)<{ $layout: 'left' | 'right' }>`
  flex: 0 0 42%;
  min-height: 300px;
  height: auto;
  aspect-ratio: 13 / 9;
  position: relative;
  overflow: hidden;
  border-radius: 0;
  margin: 0;
  padding: 0;
  z-index: 2;
  
  /* 👇 ГРАДИЕНТНЫЙ ФОН: диагональная линия от угла до угла 👇 */
  background: ${props => props.$layout === 'left' 
    ? 'linear-gradient(215deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 48%, rgba(0, 225, 255, 0.96) 50%, rgba(0, 58, 255, 0.98) 100%)' 
    : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.05) 48%, rgba(0, 241, 254, 0.94) 50%, rgba(0, 60, 255, 0.97) 100%)'};

  @media (max-width: 1200px) {
    flex: auto;
    width: 100%;
    min-height: 280px;
    aspect-ratio: 16 / 9;
  }
  @media (max-width: 992px) {
    flex: auto;
    width: 100%;
    min-height: 250px;
    aspect-ratio: 16 / 9;
  }
  @media (max-width: 768px) {
    min-height: 220px;
    aspect-ratio: 16 / 10;
  }
  @media (max-width: 480px) {
    min-height: 180px;
    aspect-ratio: 4 / 3;
  }
`;

// 'AlbumImage' - Сама картинка в Альбоме (поверх фона)
const AlbumImage = styled(motion.img)`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  left: 0;
  top: 0;
  z-index: 1; // Поверх фона
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

// 'AlbumVideo' - Видео в альбоме (поверх фона)
const AlbumVideo = styled(motion.video)`
  position: absolute !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center !important;
  left: 0 !important;
  top: 0 !important;
  z-index: 2 !important; // Поверх фона и изображений
  will-change: transform, opacity;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
`;

// 'SectionDivider' - НОВЫЙ КОМПОНЕНТ
// (Линия на 100% ширины, *между* блоками категорий)
const SectionDivider = styled.hr`
  border: none;
  border-top: 2px solid #ffffffff; // Еле заметная линия
  margin: 0 auto;
  width: 90%; // 90% от ширины экрана
`;
// --- КОМПОНЕНТЫ ---

// ==========================================================
// Компонент "Альбом" (Авто-смена фото)
// ==========================================================
type MediaItem = { type: 'image' | 'video'; src: string };

const Album: React.FC<{ images: string[]; videos: string[]; layout: 'left' | 'right' }> = ({ images, videos, layout }) => {
  // Проверяем, может ли браузер воспроизводить данный URL (по расширению и поддержке кодеков)
  const canPlayUrl = (url: string): boolean => {
    if (typeof document === 'undefined') return false;
    const v = document.createElement('video');
    // Чистим URL от query-параметров и берём только путь
    let pathname = '';
    try {
      pathname = new URL(url).pathname.toLowerCase();
    } catch {
      pathname = url.split('?')[0].toLowerCase();
    }

    if (/\.mp4$/i.test(pathname)) {
      // Наиболее совместимый вариант: H.264/AAC
      const res = v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"') || v.canPlayType('video/mp4');
      return res === 'probably' || res === 'maybe';
    }
    if (/\.webm$/i.test(pathname)) {
      const res = v.canPlayType('video/webm; codecs="vp9, vorbis"') || v.canPlayType('video/webm');
      return res === 'probably' || res === 'maybe';
    }
    if (/\.mov$/i.test(pathname)) {
      // Большинство браузеров (Chrome/Windows, Android) .mov почти не поддерживают
      const res = v.canPlayType('video/quicktime');
      return res === 'probably' || res === 'maybe';
    }
    // Если расширение неизвестно (есть токены/прокси) — даём шанс проигрыванию
    return true;
  };

  // Merge images + videos into one rotating array (useMemo для оптимизации)
  const mediaRaw: MediaItem[] = React.useMemo(() => [
    ...(images || []).map(src => ({ type: 'image', src } as MediaItem)),
    ...(videos || []).map(src => ({ type: 'video', src } as MediaItem))
  ], [images, videos]);

  // Фильтруем неподдерживаемые видео (например, .mov в Chrome/Windows)
  const media: MediaItem[] = React.useMemo(() => {
    const filtered = mediaRaw.filter(item => {
      if (item.type === 'video') {
        const ok = canPlayUrl(item.src);
        if (!ok) {
          console.warn('Видео-формат не поддерживается этим браузером, пропускаем:', item.src);
        }
        return ok;
      }
      return true;
    });
    return filtered;
  }, [mediaRaw]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // На первом рендере пытаемся начать с видео, если оно есть
  useEffect(() => {
    const firstVideo = media.findIndex(m => m.type === 'video');
    if (firstVideo >= 0) {
      setCurrentIndex(firstVideo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Интервал показа: для видео дольше
  useEffect(() => {
    if (media.length === 0) return;
    const duration = media[currentIndex]?.type === 'video' ? 6000 : 4000;
    const timer = setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % media.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [media, currentIndex]);

  // Сброс состояния загрузки при смене медиа
  useEffect(() => {
    if (media[currentIndex]?.type === 'video') {
      setVideoLoaded(false);
      setVideoError(false);
      // Перезагружаем элемент видео с новым src
      if (videoRef.current) {
        try { videoRef.current.load(); } catch {}
      }
    }
  }, [currentIndex, media]);

  // Принудительно запускаем видео после загрузки данных
  useEffect(() => {
    if (media[currentIndex]?.type === 'video' && videoRef.current && videoLoaded) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay blocked, trying muted:', err);
          // Пробуем ещё раз с явным muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(e => console.error('Video play failed:', e));
          }
        });
      }
    }
  }, [currentIndex, media, videoLoaded]);

  if (media.length === 0) {
    // Заглушка: показываем контейнер с градиентным фоном без медиа
    return (
      <AlbumContainer 
        $layout={layout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
    ); 
  }

  return (
    <AlbumContainer
      $layout={layout}
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
        {media[currentIndex].type === 'image' ? (
          <AlbumImage
            key={media[currentIndex].src}
            src={media[currentIndex].src}
            alt="Album media"
            initial={{ opacity: 0, x: layout === 'right' ? 80 : -80, scale: 1.05 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: layout === 'right' ? -50 : 50, scale: 0.95, filter: 'blur(8px)' }}
            transition={{
              opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
              x: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
              scale: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
              filter: { duration: 0.6, ease: 'easeOut' }
            }}
          />
        ) : (
          <>
            {/* Показываем серый фон с лоадером пока видео не загрузилось */}
            {!videoLoaded && !videoError && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#e0e0e018',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#99999918',
                  zIndex: 1
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                ⏳
              </motion.div>
            )}
            {/* Если произошла ошибка загрузки */}
            {videoError && (
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: '#999',
                  textAlign: 'center',
                  padding: '2rem',
                  zIndex: 3
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                ⚠️<br />Видео не загрузилось
              </motion.div>
            )}
            <AlbumVideo
              key={media[currentIndex].src}
              ref={videoRef}
              initial={{ opacity: 0, x: layout === 'right' ? 80 : -80, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: layout === 'right' ? -50 : 50, scale: 0.95, filter: 'blur(8px)' }}
              transition={{
                opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                x: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
                scale: { duration: 0.9, ease: [0.22, 0.61, 0.36, 1] },
                filter: { duration: 0.6, ease: 'easeOut' }
              }}
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              onLoadedMetadata={() => {
                console.log('✅ Video metadata loaded:', media[currentIndex].src);
              }}
              onLoadedData={() => {
                setVideoLoaded(true);
                console.log('✅ Video data loaded, ready to play:', media[currentIndex].src);
                // Принудительный запуск после загрузки
                if (videoRef.current) {
                  videoRef.current.muted = true; // Гарантируем muted
                  // Проверяем реальные размеры видео
                  console.log('📐 Video dimensions:', {
                    videoWidth: videoRef.current.videoWidth,
                    videoHeight: videoRef.current.videoHeight,
                    duration: videoRef.current.duration
                  });
                  
                  if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
                    console.error('❌ Видео загрузилось, но размеры 0x0 — возможно, неподдерживаемый кодек');
                    setVideoError(true);
                    return;
                  }
                  
                  const promise = videoRef.current.play();
                  if (promise) {
                    promise
                      .then(() => console.log('▶️ Video playing'))
                      .catch(err => console.warn('⚠️ Play rejected:', err));
                  }
                }
              }}
              onError={(e) => {
                const target = e.currentTarget as HTMLVideoElement;
                console.error('❌ Video error:', {
                  src: media[currentIndex].src,
                  error: target.error,
                  code: target.error?.code,
                  message: target.error?.message
                });
                setVideoError(true);
              }}
              onCanPlay={() => {
                console.log('🎬 Video can play:', media[currentIndex].src);
                if (videoRef.current && videoRef.current.paused) {
                  videoRef.current.play().catch(err => console.warn('CanPlay autostart failed:', err));
                }
              }}
              onPlay={() => {
                console.log('▶️ Video started playing');
              }}
              onPause={() => {
                console.log('⏸️ Video paused');
              }}
              onStalled={() => {
                console.warn('⏱️ Video stalled (buffering)');
              }}
            >
              <source src={media[currentIndex].src} type="video/mp4" />
              Ваш браузер не поддерживает видео
            </AlbumVideo>
          </>
        )}
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
  // Функция для определения количества видимых карточек в зависимости от ширины экрана
  const getItemsPerView = () => {
    if (typeof window === 'undefined') return 5.5;
    const width = window.innerWidth;
    if (width <= 480) return 1.5;      // Маленькие телефоны
    if (width <= 768) return 2;        // Телефоны
    if (width <= 992) return 2.5;      // Планшеты вертикально
    if (width <= 1200) return 4;       // Планшеты горизонтально / маленькие ноутбуки
    return 5.5;                        // Десктопы
  };

  const [itemsPerView, setItemsPerView] = useState(getItemsPerView());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const totalItems = products.length;

  // Обновляем itemsPerView при ресайзе
  useEffect(() => {
    const onResize = () => {
      setItemsPerView(getItemsPerView());
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Вычисляем максимальный индекс для прокрутки
  const maxIndex = Math.max(0, Math.ceil(totalItems - itemsPerView));
  
  // При изменении maxIndex убеждаемся, что currentIndex не выходит за пределы
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [currentIndex, maxIndex, totalItems]);

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // Рассчитываем сдвиг для SliderTrack
  const translateX = totalItems > 0 ? `calc(-${currentIndex * (100 / itemsPerView)}%)` : '0%';
  
  // Не показываем стрелки, если все товары и так влезают
  const showArrows = totalItems > itemsPerView;

  return (
    <CarouselContentWrapper layout={layout}> {/* Обертка для центрирования */}
      <LineWrapper>
        <FullWidthLine /> {/* Линия на всю ширину над заголовком */}
      </LineWrapper>
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
              disabled={currentIndex >= maxIndex}
            >
              <FiChevronRight size={24} />
            </ArrowButton>
          </>
        )}
      </SliderContainer>
      
      <CategoryDescription>{categoryDescription}</CategoryDescription>
      <LineWrapper>
        <FullWidthLine /> {/* Линия на всю ширину под описанием */}
      </LineWrapper>
      
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
  <Album images={category.albumImages || []} videos={category.albumVideos || []} layout={layout} />
      
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
          // Не используем c.image как заглушку - только явно загруженные albumImages
          albumImages: c.albumImages && c.albumImages.length > 0 ? c.albumImages : [],
          albumVideos: c.albumVideos || [],
          
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