import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiZap } from 'react-icons/fi';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import toast from 'react-hot-toast';

const Card = styled(motion.div)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(18, 73, 86, 0.1);
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  position: relative;
  /* ИЗМЕНЕНО: Добавим display: flex, чтобы контент мог растягиваться */
  display: flex;
  flex-direction: column;
  height: 100%; /* Карточка будет занимать всю высоту ячейки грида */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 36px rgba(18, 73, 86, 0.16);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: #f8f9fa;
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const MainImage = styled(ProductImage)<{ $disableHover?: boolean }>`
  opacity: 1;
  z-index: 1;

  ${Card}:hover & {
    opacity: ${props => props.$disableHover ? '1' : '0'};
  }
`;

const HoverImage = styled(ProductImage)`
  opacity: 0;
  z-index: 2;

  ${Card}:hover & {
    opacity: 1;
    transform: scale(1.05);
  }
`;

const OrganicBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 100%);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  z-index: 10;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: clamp(0.4rem, 2vw, 1rem);
  right: clamp(0.4rem, 2vw, 1rem);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;

  ${Card}:hover & {
    opacity: 1;
  }

  /* На мобільних завжди показуємо (немає hover) */
  @media (hover: none) {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: clamp(32px, 8vw, 40px);
  height: clamp(32px, 8vw, 40px);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #00acc1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 3vw, 1.2rem);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 14px rgba(18, 73, 86, 0.12);

  &:hover {
    background: #00acc1;
    color: white;
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: clamp(0.75rem, 2.2vw, 1.35rem);
  /* ИЗМЕНЕНО: Добавим flex-grow, чтобы контент занимал оставшееся место */
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const Category = styled.div`
  color: #00acc1;
  font-size: clamp(0.7rem, 1.4vw, 0.82rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: clamp(0.3rem, 1vw, 0.5rem);
`;

// --- ИЗМЕНЕНИЯ ЗДЕСЬ ---
const ProductName = styled.h3`
  /* ИЗМЕНЕНО: Размер шрифта теперь плавный */
  font-size: clamp(0.92rem, 1.7vw, 1.12rem);
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  
  /* ИЗМЕНЕНО: 
    - Убрана фиксированная высота 'height' и 'align-items: center'.
    - Добавлено ограничение по строкам (как в ProductDescription).
  */
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Показываем 3 строки */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* ИЗМЕНЕНО: 
    - Добавлена *минимальная* высота, чтобы карточки не прыгали.
    - Эта высота тоже плавная, т.к. зависит от плавного font-size.
  */
  min-height: calc(clamp(0.92rem, 1.7vw, 1.12rem) * 1.4 * 3); /* min-height = (fluid font-size * line-height * 3 строки) */

  /* ИЗМЕНЕНО: @media запросы, менявшие height и font-size, удалены */
`;
// --- КОНЕЦ ИЗМЕНЕНИЙ ---

const ProductDescription = styled.p`
  color: #6c757d;
  font-size: clamp(0.82rem, 1.25vw, 0.95rem);
  line-height: 1.5;
  margin-bottom: clamp(0.75rem, 1.8vw, 1.2rem);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* ИЗМЕНЕНО: Добавим margin-top: auto, чтобы прижать футер к низу */
  margin-top: auto;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Price = styled.span<{ isDiscounted?: boolean }>`
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 800;
  color: #1a9b5c;
  text-decoration: ${props => props.isDiscounted ? 'line-through' : 'none'};
  opacity: ${props => props.isDiscounted ? 0.6 : 1};
  letter-spacing: -0.5px;
`;

const OriginalPrice = styled.span`
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  font-weight: 600;
  color: #e74c3c;
`;

const AddToCartButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  width: clamp(36px, 9vw, 48px);
  height: clamp(36px, 9vw, 48px);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  box-shadow: 0 4px 12px rgba(0, 172, 193, 0.35);

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.08);
    box-shadow: 0 6px 16px rgba(0, 172, 193, 0.5);
  }
`;

const getCategoryName = (category: string) => {
  const categories = {
    chips: 'Чіпси',
    decorations: 'Прикраси',
    syrups: 'Сиропи',
    purees: 'Пюре',
    dried_flowers: 'Сухоцвіти'
  };
  return categories[category as keyof typeof categories] || category;
};

interface ProductCardProps {
  product: Product;
  customLink?: string;
  disableLink?: boolean; // Отключить ссылку на детальную страницу
  disableHoverImage?: boolean; // Отключить смену изображения при наведении
  priority?: boolean; // Для первых видимых карточек: грузим сразу
}

const ProductCard: React.FC<ProductCardProps> = ({ product, customLink, disableLink, disableHoverImage, priority }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // ⭐ LAZY LOAD для hover изображения
  const [hoverImageLoaded, setHoverImageLoaded] = React.useState(false);
  const [preloadLink, setPreloadLink] = React.useState<HTMLLinkElement | null>(null);

  // Получаем изображения: [главное фото, доп фото при hover, ...галерея]
  // Обработка старых товаров (без массива images) и новых товаров
  const mainImageBase = product.image || (product as any).imageUrl || '';
  const mainImage = (product.images && product.images.length > 0) ? product.images[0] : mainImageBase;
  const hoverImage = (product.images && product.images.length > 1) ? product.images[1] : null;

  const [currentMainImage, setCurrentMainImage] = React.useState(mainImage);
  const [currentHoverImage, setCurrentHoverImage] = React.useState(hoverImage);

  React.useEffect(() => {
    setCurrentMainImage(mainImage);
    setCurrentHoverImage(hoverImage);
  }, [mainImage, hoverImage]);
  
  // ⭐ Предзагрузка hover изображения при наведении с использованием preload
  const handleMouseEnter = () => {
    if (currentHoverImage && !hoverImageLoaded && !disableHoverImage && !preloadLink) {
      // Создаем link для preload только один раз
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = currentHoverImage;
      document.head.appendChild(link);
      setPreloadLink(link);
      setHoverImageLoaded(true);
    }
  };

  // Очищаем preload link при размонтировании
  React.useEffect(() => {
    return () => {
      if (preloadLink && preloadLink.parentNode) {
        preloadLink.parentNode.removeChild(preloadLink);
      }
    };
  }, [preloadLink]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Товар додано до кошика!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Не вызываем preventDefault, чтобы кнопка работала в режиме без ссылки
    if (!disableLink) {
      e.preventDefault();
    }
    if (!user) {
      toast.error('Увійдіть в систему, щоб зберігати обране');
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const hasDiscount = user?.discount && user.discount > 0;
  const discountedPrice = hasDiscount 
    ? Math.round(product.price * (1 - (user?.discount || 0) / 100))
    : product.price;

  // Определяем ссылку: если есть customLink - используем его, иначе стандартную ссылку на товар
  const linkTo = customLink || `/products/${product.id}`;

  // Сохраняем позицию скролла перед переходом
  const handleCardClick = () => {
    sessionStorage.setItem('productsScrollPosition', window.scrollY.toString());
  };

  // Контент карточки
  const cardContent = (
    <Card
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <ImageContainer>
        <ImageWrapper onMouseEnter={handleMouseEnter}>
          <MainImage 
            src={currentMainImage} 
            alt={product.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
            width={400}
            height={400}
            style={{ backgroundColor: '#f5f5f5' }}
            $disableHover={disableHoverImage}
            onError={(e) => {
              if ((product as any).imageUrl && currentMainImage !== (product as any).imageUrl) {
                setCurrentMainImage((product as any).imageUrl);
                return;
              }
              e.currentTarget.style.opacity = '0';
            }}
          />
          {!disableHoverImage && hoverImageLoaded && currentHoverImage && (
            <HoverImage 
              src={currentHoverImage} 
              alt={product.name}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width={400}
              height={400}
              style={{ backgroundColor: '#f5f5f5' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </ImageWrapper>
        {product.organic && (
          <OrganicBadge>
            <FiZap />
            Органічний
          </OrganicBadge>
        )}
        <ActionButtons>
          <ActionButton 
            onClick={handleToggleWishlist} 
            title={isInWishlist(product.id) ? "Видалити з обраного" : "Додати до обраного"}
            style={{ color: isInWishlist(product.id) ? '#e74c3c' : undefined }}
          >
            <FiHeart />
          </ActionButton>
        </ActionButtons>
      </ImageContainer>

      <CardContent>
        <Category>{getCategoryName(product.category)}</Category>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>

        <ProductFooter>
          <PriceContainer>
            {hasDiscount ? (
              <>
                <Price isDiscounted>{product.price} ₴</Price>
                <OriginalPrice>{discountedPrice} ₴</OriginalPrice>
              </>
            ) : (
              <Price>{product.price} ₴</Price>
            )}
          </PriceContainer>

          <AddToCartButton onClick={handleAddToCart} title="Додати до кошика">
            <FiShoppingCart />
          </AddToCartButton>
        </ProductFooter>
      </CardContent>
    </Card>
  );

  // Если отключена ссылка - возвращаем без обёртки Link
  if (disableLink) {
    return <div style={{ height: '100%' }}>{cardContent}</div>;
  }

  return (
    <Link to={linkTo} style={{ textDecoration: 'none', height: '100%' }} onClick={handleCardClick}>
      {cardContent}
    </Link>
  );
};

// ⭐ МЕМОИЗАЦИЯ для оптимизации - компонент не будет ре-рендериться если props не изменились
export default React.memo(ProductCard, (prevProps, nextProps) => {
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.customLink === nextProps.customLink &&
    prevProps.disableLink === nextProps.disableLink &&
    prevProps.disableHoverImage === nextProps.disableHoverImage &&
    prevProps.priority === nextProps.priority
  );
});
