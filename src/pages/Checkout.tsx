import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCreditCard, FiUser, FiMapPin, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import toast from 'react-hot-toast';

const CheckoutContainer = styled.div`
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

const CheckoutContent = styled.div`
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

const FormSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }
`;

const OrderItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
`;

const OrderItemInfo = styled.div`
  flex: 1;
`;

const OrderItemName = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.3rem;
`;

const OrderItemQuantity = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.3rem;
`;

const OrderItemPrice = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: #27ae60;
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

const PlaceOrderButton = styled.button`
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

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #00acc1;
  border: 2px solid #00acc1;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:hover {
    background: #00acc1;
    color: white;
  }
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #27ae60;

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    color: #6c757d;
  }
`;

const Checkout: React.FC = () => {
  const { items, getTotalPrice, getTotalItems, createOrder } = useCart();
  const { user } = useAuth();
  // const { orders, updateOrderStatus } = useAdmin(); // Отключено для избежания неиспользуемых переменных
  const navigate = useNavigate();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    comments: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error('Заповніть всі обов\'язкові поля');
      return;
    }

    if (!user) {
      toast.error('Необхідно увійти в систему');
      return;
    }

    try {
      // Создаем новый заказ
      const orderData = {
        userId: user.id,
        items: items,
        total: getTotalPrice(),
        status: 'pending' as const,
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone
        }
      };

      await createOrder(orderData);
      setIsOrderPlaced(true);
    } catch (error) {
      console.error('Помилка створення замовлення:', error);
    }
  };

  if (isOrderPlaced) {
    return (
      <CheckoutContainer>
        <div className="container">
          <SuccessMessage>
            <FiCheckCircle size={80} style={{ margin: '0 auto 2rem', display: 'block' }} />
            <h2>Заказ оформлен!</h2>
            <p>Спасибо за покупку! Мы свяжемся с вами в ближайшее время для подтверждения заказа.</p>
            <motion.button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '25px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Вернуться на главную
            </motion.button>
          </SuccessMessage>
        </div>
      </CheckoutContainer>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutContainer>
      <Header>
        <div className="container">
          <Title>Оформление заказа</Title>
          <Subtitle>Заполните данные для доставки</Subtitle>
        </div>
      </Header>

      <CheckoutContent>
        <FormSection>
          <BackButton onClick={() => navigate('/cart')}>
            <FiArrowLeft />
            Вернуться в корзину
          </BackButton>

          <SectionTitle>
            <FiUser />
            Контактная информация
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="name">Имя и фамилия *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">Телефон *</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </FormGroup>

          <SectionTitle>
            <FiMapPin />
            Адрес доставки
          </SectionTitle>

          <FormGroup>
            <Label htmlFor="city">Город *</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Москва"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="address">Адрес *</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="ул. Примерная, д. 123, кв. 45"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="postalCode">Почтовый индекс</Label>
            <Input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="123456"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="comments">Комментарии к заказу</Label>
            <TextArea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              placeholder="Дополнительные пожелания по доставке..."
            />
          </FormGroup>
        </FormSection>

        <OrderSummary>
          <SectionTitle>
            <FiCreditCard />
            Ваш заказ
          </SectionTitle>

          {items.map(item => (
            <OrderItem key={item.product.id}>
              <OrderItemImage src={item.product.image} alt={item.product.name} />
              <OrderItemInfo>
                <OrderItemName>{item.product.name}</OrderItemName>
                <OrderItemQuantity>Количество: {item.quantity} шт.</OrderItemQuantity>
                <OrderItemPrice>{item.product.price * item.quantity} ₴</OrderItemPrice>
              </OrderItemInfo>
            </OrderItem>
          ))}

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

          <PlaceOrderButton onClick={handlePlaceOrder}>
            <FiCheckCircle />
            Оформить заказ
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
