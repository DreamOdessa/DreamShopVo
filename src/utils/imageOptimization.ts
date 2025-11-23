/**
 * Утилита для работы с оптимизированными изображениями из Firebase Storage
 * 
 * После установки расширения "Resize Images" Firebase автоматически создаёт
 * уменьшенные версии загруженных изображений с суффиксами размеров.
 * 
 * Эта утилита помогает получить правильный URL для нужного размера изображения.
 */

export type ImageSize = 'thumb' | 'small' | 'medium' | 'large' | 'original';

interface ImageSizeConfig {
  suffix: string;
  maxWidth: number;
  description: string;
}

// Конфигурация размеров (настраивается в Firebase Extension)
const IMAGE_SIZES: Record<ImageSize, ImageSizeConfig> = {
  thumb: {
    suffix: '_200x200',
    maxWidth: 200,
    description: 'Миниатюра для превью'
  },
  small: {
    suffix: '_400x400',
    maxWidth: 400,
    description: 'Для карточек товаров в каталоге'
  },
  medium: {
    suffix: '_800x800',
    maxWidth: 800,
    description: 'Для страницы товара на мобильных'
  },
  large: {
    suffix: '_1200x1200',
    maxWidth: 1200,
    description: 'Для страницы товара на десктопе'
  },
  original: {
    suffix: '',
    maxWidth: Infinity,
    description: 'Оригинальное изображение'
  }
};

/**
 * Получить оптимизированный URL изображения
 * 
 * @param originalUrl - Оригинальный URL из Firebase Storage
 * @param size - Требуемый размер изображения
 * @returns URL оптимизированного изображения
 * 
 * @example
 * // Для карточки товара в каталоге
 * const cardImage = getOptimizedImageUrl(product.image, 'small');
 * 
 * // Для детальной страницы
 * const detailImage = getOptimizedImageUrl(product.image, 'large');
 */
export function getOptimizedImageUrl(originalUrl: string, size: ImageSize = 'small'): string {
  // Если URL пустой или не из Firebase Storage, возвращаем как есть
  if (!originalUrl || !originalUrl.includes('firebasestorage.googleapis.com')) {
    return originalUrl;
  }

  // Если запрашивается оригинал, возвращаем как есть
  if (size === 'original') {
    return originalUrl;
  }

  const config = IMAGE_SIZES[size];
  
  // Извлекаем путь к файлу и расширение
  // URL вида: https://firebasestorage.googleapis.com/.../products%2Fimage.jpg?alt=media&token=...
  const pathMatch = originalUrl.match(/\/([^/]+\.(jpg|jpeg|png|webp|gif))/i);
  if (!pathMatch) {
    console.warn('Could not parse image path from URL:', originalUrl);
    return originalUrl;
  }

  const [fullFileName, fileName, extension] = pathMatch;
  const baseFileName = fileName.replace(`.${extension}`, '');

  // Формируем имя файла с суффиксом размера
  const resizedFileName = `${baseFileName}${config.suffix}.${extension}`;
  
  // Заменяем имя файла в URL
  const optimizedUrl = originalUrl.replace(fullFileName, `/${resizedFileName}`);
  
  return optimizedUrl;
}

/**
 * Получить srcSet для responsive изображений
 * 
 * @param originalUrl - Оригинальный URL из Firebase Storage
 * @returns Строка srcSet для HTML img
 * 
 * @example
 * <img 
 *   src={getOptimizedImageUrl(product.image, 'small')}
 *   srcSet={getImageSrcSet(product.image)}
 *   sizes="(max-width: 768px) 100vw, 400px"
 *   alt={product.name}
 * />
 */
export function getImageSrcSet(originalUrl: string): string {
  if (!originalUrl || !originalUrl.includes('firebasestorage.googleapis.com')) {
    return '';
  }

  const srcSet = [
    `${getOptimizedImageUrl(originalUrl, 'thumb')} 200w`,
    `${getOptimizedImageUrl(originalUrl, 'small')} 400w`,
    `${getOptimizedImageUrl(originalUrl, 'medium')} 800w`,
    `${getOptimizedImageUrl(originalUrl, 'large')} 1200w`
  ];

  return srcSet.join(', ');
}

/**
 * Проверить, доступно ли оптимизированное изображение
 * (полезно при миграции, когда старые изображения ещё не обработаны)
 */
export async function isOptimizedImageAvailable(
  originalUrl: string, 
  size: ImageSize = 'small'
): Promise<boolean> {
  const optimizedUrl = getOptimizedImageUrl(originalUrl, size);
  
  try {
    const response = await fetch(optimizedUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Получить URL с fallback на оригинал, если оптимизированная версия недоступна
 */
export function getOptimizedImageUrlWithFallback(
  originalUrl: string, 
  size: ImageSize = 'small'
): string {
  // В продакшене используем оптимизированные версии
  // Если расширение не установлено, Firebase вернёт 404, браузер подтянет onerror
  return getOptimizedImageUrl(originalUrl, size);
}
