import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const WishlistContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
  background:rgb(255, 255, 255);
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
  margin-top: -4rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-bottom: 2rem;

  &:hover {
    background: #2980b9;
  }
`;

const WishlistContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 2rem;
`;

const ShopButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(77, 208, 225, 0.3);
  }
`;

const WishlistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e8ed;
`;

const WishlistTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const ClearButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background: #c0392b;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const WishlistItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #f8f9fa;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: #4dd0e1;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.4;
`;

const ProductPrice = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #27ae60;
  margin-bottom: 1rem;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(77, 208, 225, 0.3);
    }
  ` : `
    background: #e74c3c;
    color: white;

    &:hover {
      background: #c0392b;
    }
  `}
`;

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist, getTotalItems } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success('Товар добавлен в корзину');
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    if (window.confirm('Вы уверены, что хотите очистить избранное?')) {
      clearWishlist();
    }
  };

  if (!user) {
    return (
      <WishlistContainer>
        <Header>
          <Title>Обране</Title>
          <Subtitle>Ваші улюблені товари</Subtitle>
        </Header>
        <Content>
          <EmptyState>
            <EmptyIcon>🔒</EmptyIcon>
            <EmptyTitle>Потрібна авторизація</EmptyTitle>
            <EmptyText>Будь ласка, увійдіть в систему, щоб переглянути своє обране</EmptyText>
            <ShopButton onClick={() => navigate('/')}>
              Перейти на головну
            </ShopButton>
          </EmptyState>
        </Content>
      </WishlistContainer>
    );
  }

  return (
    <WishlistContainer>
      <Header>
        <Title>Обране</Title>
        <Subtitle>Ваші улюблені товари ({getTotalItems()})</Subtitle>
      </Header>
      
      <Content>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Назад
        </BackButton>

        <WishlistContent>
          {items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>💔</EmptyIcon>
              <EmptyTitle>Ваше обране порожнє</EmptyTitle>
              <EmptyText>Додайте товари в обране, натиснувши на іконку серця</EmptyText>
              <ShopButton onClick={() => navigate('/products')}>
                Перейти до товарів
              </ShopButton>
            </EmptyState>
          ) : (
            <>
              <WishlistHeader>
                <WishlistTitle>Ваше обране ({getTotalItems()} товарів)</WishlistTitle>
                <ClearButton onClick={handleClearWishlist}>
                  <FiTrash2 />
                  Очистити все
                </ClearButton>
              </WishlistHeader>

              <ProductsGrid>
                {items.map((product) => (
                  <WishlistItem key={product.id}>
                    <ProductImage 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <ProductName>{product.name}</ProductName>
                    <ProductDescription>{product.description}</ProductDescription>
                    <ProductPrice>{product.price} ₴</ProductPrice>
                    <ProductActions>
                      <ActionButton 
                        variant="primary" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <FiShoppingCart />
                        В корзину
                      </ActionButton>
                      <ActionButton 
                        variant="secondary" 
                        onClick={() => handleRemoveFromWishlist(product.id)}
                      >
                        <FiHeart />
                        Видалити
                      </ActionButton>
                    </ProductActions>
                  </WishlistItem>
                ))}
              </ProductsGrid>
            </>
          )}
        </WishlistContent>
      </Content>
    </WishlistContainer>
  );
};

export default Wishlist;
