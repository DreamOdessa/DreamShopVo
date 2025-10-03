import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CartContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
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

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const CartItem = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ItemDescription = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
`;

const ItemPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #27ae60;
`;

const ItemControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
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
  width: 35px;
  height: 35px;
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
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  color: #2c3e50;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #c0392b;
    transform: scale(1.1);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`;

const BackToShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
    font-weight: 700;
    font-size: 1.2rem;
    color: #2c3e50;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
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
  margin-top: 1.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast.success('Товар удален из корзины');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.success('Товар удален из корзины');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Войдите в систему для оформления заказа');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Корзина очищена');
  };

  if (items.length === 0) {
    return (
      <CartContainer>
        <Header>
          <div className="container">
            <Title>Корзина</Title>
            <Subtitle>Ваши выбранные товары</Subtitle>
          </div>
        </Header>

        <div className="container">
          <EmptyCart>
            <h3>Корзина пуста</h3>
            <p>Добавьте товары из каталога, чтобы они появились здесь</p>
            <BackToShopButton to="/products">
              <FiShoppingCart />
              Перейти к покупкам
            </BackToShopButton>
          </EmptyCart>
        </div>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <Header>
        <div className="container">
          <Title>Корзина</Title>
          <Subtitle>Проверьте выбранные товары и оформите заказ</Subtitle>
        </div>
      </Header>

      <CartContent>
        <CartItems>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#2c3e50' }}>Товары в корзине ({getTotalItems()})</h2>
            <button
              onClick={handleClearCart}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Очистить корзину
            </button>
          </div>

          {items.map((item, index) => (
            <motion.div
              key={item.product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <CartItem>
                <ItemImage src={item.product.image} alt={item.product.name} />
                <ItemInfo>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemDescription>{item.product.description}</ItemDescription>
                  <ItemPrice>{item.product.price} ₴ за шт.</ItemPrice>
                  <ItemControls>
                    <QuantityControls>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus />
                      </QuantityButton>
                      <QuantityDisplay>{item.quantity}</QuantityDisplay>
                      <QuantityButton
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >
                        <FiPlus />
                      </QuantityButton>
                    </QuantityControls>
                    <RemoveButton onClick={() => handleRemoveItem(item.product.id)}>
                      <FiTrash2 />
                    </RemoveButton>
                  </ItemControls>
                </ItemInfo>
              </CartItem>
            </motion.div>
          ))}
        </CartItems>

        <OrderSummary>
          <SummaryTitle>Итого</SummaryTitle>
          <SummaryRow>
            <span>Товары ({getTotalItems()} шт.)</span>
            <span>{getTotalPrice()} ₴</span>
          </SummaryRow>
          <SummaryRow>
            <span>Доставка</span>
            <span>Бесплатно</span>
          </SummaryRow>
          <SummaryRow>
            <span>Итого к оплате</span>
            <span>{getTotalPrice()} ₴</span>
          </SummaryRow>

          <CheckoutButton onClick={handleCheckout} disabled={!user}>
            <FiCreditCard />
            Оформить заказ
          </CheckoutButton>

          {!user && (
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#e74c3c', fontSize: '0.9rem' }}>
              Войдите в систему для оформления заказа
            </p>
          )}
        </OrderSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
