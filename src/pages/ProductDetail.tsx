import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiZap, FiMinus, FiPlus } from 'react-icons/fi';
import { useAdmin } from '../contexts/AdminContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import toast from 'react-hot-toast';

const ProductDetailContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImageContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  background: #f8f9fa;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: #667eea #f8f9fa;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f8f9fa;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #667eea;
    border-radius: 10px;
  }
`;

const Thumbnail = styled.img<{ $isActive: boolean }>`
  width: 80px;
  height: 80px;
  object-fit: contain;
  border-radius: 12px;
  cursor: pointer;
  border: 3px solid ${props => props.$isActive ? '#667eea' : 'transparent'};
  background: #f8f9fa;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.05);
    border-color: #667eea;
  }
`;

const OrganicBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Category = styled.div`
  color: #667eea;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductName = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductDescription = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  line-height: 1.6;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Price = styled.span<{ isDiscounted?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: #27ae60;
  text-decoration: ${props => props.isDiscounted ? 'line-through' : 'none'};
  opacity: ${props => props.isDiscounted ? 0.6 : 1};
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #e74c3c;
`;

const DiscountBadge = styled.div`
  background: #e74c3c;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  width: fit-content;
`;

const ProductDetails = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const DetailValue = styled.span`
  color: #6c757d;
`;

const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Ingredient = styled.li`
  background: #667eea;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 25px;
  padding: 0.5rem;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  border: 2px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 50px;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const WishlistButton = styled.button`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 1rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = products.find(p => p.id === id);
  
  // Получаем изображения: [главное фото, доп фото при hover, ...галерея]
  // Для страницы товара показываем ВСЕ изображения (до 5 шт)
  const productImages = product?.images && product.images.length > 0 
    ? product.images // показываем все изображения
    : (product?.image ? [product.image] : []);

  if (!product) {
    return (
      <ProductDetailContainer>
        <div className="container">
          <h1>Товар не знайдено</h1>
          <BackButton onClick={() => navigate('/products')}>
            <FiArrowLeft />
            Повернутися до каталогу
          </BackButton>
        </div>
      </ProductDetailContainer>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Додано ${quantity} шт. до кошика!`);
  };

  const handleToggleWishlist = () => {
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

  const getCategoryName = (category: string) => {
    const categories = {
      chips: 'Фруктові чіпси',
      decorations: 'Прикраси для коктейлів',
      syrups: 'Сиропи',
      purees: 'Пюре',
      dried_flowers: 'Сухоцвіти'
    };
    return categories[category as keyof typeof categories] || category;
  };

  return (
    <ProductDetailContainer>
      <div className="container">
        <BackButton onClick={() => navigate('/products')}>
          <FiArrowLeft />
          Повернутися до каталогу
        </BackButton>

        <ProductContainer>
          <ImageSection>
            <MainImageContainer>
              <ProductImage 
                src={productImages[selectedImageIndex]} 
                alt={product.name} 
              />
              {product.organic && (
                <OrganicBadge>
                  <FiZap />
                  Органічний продукт
                </OrganicBadge>
              )}
            </MainImageContainer>
            
            {productImages.length > 1 && (
              <ThumbnailContainer>
                {productImages.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={image}
                    alt={`${product.name} - фото ${index + 1}`}
                    $isActive={selectedImageIndex === index}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                ))}
              </ThumbnailContainer>
            )}
          </ImageSection>

          <InfoSection>
            <Category>{getCategoryName(product.category)}</Category>
            <ProductName>{product.name}</ProductName>
            <ProductDescription>{product.description}</ProductDescription>

            <PriceSection>
              {hasDiscount ? (
                <>
                  <Price isDiscounted>{product.price} ₴</Price>
                  <OriginalPrice>{discountedPrice} ₴</OriginalPrice>
                  <DiscountBadge>Знижка {user?.discount}%</DiscountBadge>
                </>
              ) : (
                <Price>{product.price} ₴</Price>
              )}
            </PriceSection>

            <ProductDetails>
              <DetailRow>
                <DetailLabel>Вага:</DetailLabel>
                <DetailValue>{product.weight || 'Не вказано'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Наявність:</DetailLabel>
                <DetailValue style={{ color: product.inStock ? '#27ae60' : '#e74c3c' }}>
                  {product.inStock ? 'В наявності' : 'Немає в наявності'}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Якість:</DetailLabel>
                <DetailValue>
                  {product.organic ? 'Органічний продукт' : 'Стандартна якість'}
                </DetailValue>
              </DetailRow>
            </ProductDetails>

            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <DetailLabel style={{ marginBottom: '1rem', display: 'block' }}>
                  Склад:
                </DetailLabel>
                <IngredientsList>
                  {product.ingredients.map((ingredient, index) => (
                    <Ingredient key={index}>{ingredient}</Ingredient>
                  ))}
                </IngredientsList>
              </div>
            )}

            <QuantitySection>
              <QuantityLabel>Кількість:</QuantityLabel>
              <QuantityControls>
                <QuantityButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </QuantityButton>
                <QuantityDisplay>{quantity}</QuantityDisplay>
                <QuantityButton
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  <FiPlus />
                </QuantityButton>
              </QuantityControls>
            </QuantitySection>

            <ActionButtons>
              <AddToCartButton onClick={handleAddToCart} disabled={!product.inStock}>
                <FiShoppingCart />
                Додати до кошика
              </AddToCartButton>
              <WishlistButton 
                onClick={handleToggleWishlist}
                style={{ color: isInWishlist(product.id) ? '#e74c3c' : undefined }}
              >
                <FiHeart />
                {isInWishlist(product.id) ? 'З обраного' : 'В обране'}
              </WishlistButton>
            </ActionButtons>
          </InfoSection>
        </ProductContainer>
      </div>
    </ProductDetailContainer>
  );
};

export default ProductDetail;