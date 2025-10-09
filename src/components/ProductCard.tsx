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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 250px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
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
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #00acc1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: #00acc1;
    color: white;
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const Category = styled.div`
  color: #00acc1;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ProductDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Price = styled.span<{ isDiscounted?: boolean }>`
  font-size: 1.3rem;
  font-weight: 700;
  color: #27ae60;
  text-decoration: ${props => props.isDiscounted ? 'line-through' : 'none'};
  opacity: ${props => props.isDiscounted ? 0.6 : 1};
`;

const OriginalPrice = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: #e74c3c;
`;

const AddToCartButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
  }

  &:active {
    transform: translateY(0);
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Товар додано до кошика!');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <Card
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <ImageContainer>
          <ProductImage src={product.image} alt={product.name} />
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

            <AddToCartButton onClick={handleAddToCart}>
              <FiShoppingCart />
              В кошик
            </AddToCartButton>
          </ProductFooter>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
