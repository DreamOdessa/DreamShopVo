import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { Order } from '../types';
import { orderService } from '../firebase/services';
import toast from 'react-hot-toast';

const OrdersContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
  background: #f8f9fa;
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

const OrdersContent = styled.div`
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

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4dd0e1;
    box-shadow: 0 4px 12px rgba(77, 208, 225, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f2f6;
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const OrderDate = styled.p`
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
`;

const OrderTotal = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #27ae60;
  text-align: right;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
`;

const ItemsList = styled.div`
  margin-top: 1rem;
`;

const ItemsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
`;

const ItemCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid #e1e8ed;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
`;

const ItemQuantity = styled.div`
  color: #6c757d;
  font-size: 0.8rem;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4dd0e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Orders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userOrders = await orderService.getByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        toast.error('Ошибка загрузки заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує';
      case 'processing': return 'Обробляється';
      case 'shipped': return 'Відправлено';
      case 'delivered': return 'Доставлено';
      case 'cancelled': return 'Скасовано';
      default: return status;
    }
  };

  const getDeliveryMethodText = (method: string) => {
    switch (method) {
      case 'post_office': return 'Відділення Нової Пошти';
      case 'address': return 'Доставка за адресою';
      case 'schedule': return 'Доставка за графіком';
      case 'taxi': return 'Екстрена доставка (Таксі)';
      default: return method;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cash_on_delivery': return 'Накладений платіж';
      case 'card_online': return 'Картка онлайн';
      case 'card_on_delivery': return 'Картка при отриманні';
      case 'bank_transfer': return 'Банківський переказ';
      default: return method;
    }
  };

  if (!user) {
    return (
      <OrdersContainer>
        <Header>
          <Title>Замовлення</Title>
          <Subtitle>Історія ваших замовлень</Subtitle>
        </Header>
        <Content>
          <EmptyState>
            <EmptyIcon>🔒</EmptyIcon>
            <EmptyTitle>Потрібна авторизація</EmptyTitle>
            <EmptyText>Будь ласка, увійдіть в систему, щоб переглянути свої замовлення</EmptyText>
            <ShopButton onClick={() => navigate('/')}>
              Перейти на головну
            </ShopButton>
          </EmptyState>
        </Content>
      </OrdersContainer>
    );
  }

  if (loading) {
    return (
      <OrdersContainer>
        <Header>
          <Title>Замовлення</Title>
          <Subtitle>Історія ваших замовлень</Subtitle>
        </Header>
        <Content>
          <LoadingState>
            <LoadingSpinner />
            <EmptyTitle>Завантаження замовлень...</EmptyTitle>
          </LoadingState>
        </Content>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <Header>
        <Title>Замовлення</Title>
        <Subtitle>Історія ваших замовлень ({orders.length})</Subtitle>
      </Header>
      
      <Content>
        <BackButton onClick={() => navigate(-1)}>
          <FiArrowLeft />
          Назад
        </BackButton>

        <OrdersContent>
          {orders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📦</EmptyIcon>
              <EmptyTitle>У вас немає замовлень</EmptyTitle>
              <EmptyText>Створіть своє перше замовлення, додавши товари в корзину</EmptyText>
              <ShopButton onClick={() => navigate('/products')}>
                Перейти до товарів
              </ShopButton>
            </EmptyState>
          ) : (
            <OrdersList>
              {orders.map((order) => (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderInfo>
                      <OrderNumber>Замовлення #{order.id}</OrderNumber>
                      <OrderDate>
                        {new Date(order.createdAt).toLocaleString('uk-UA')}
                      </OrderDate>
                    </OrderInfo>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                      <StatusBadge status={order.status}>
                        {getStatusText(order.status)}
                      </StatusBadge>
                      <OrderTotal>{order.total} ₴</OrderTotal>
                    </div>
                  </OrderHeader>

                  <OrderDetails>
                    <DetailItem>
                      <FiMapPin />
                      <span>
                        {order.deliveryInfo?.city || order.shippingAddress.city}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <FiPackage />
                      <span>
                        {getDeliveryMethodText(order.deliveryInfo?.deliveryMethod || 'address')}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <FiCreditCard />
                      <span>
                        {getPaymentMethodText(order.paymentInfo?.paymentMethod || 'cash_on_delivery')}
                      </span>
                    </DetailItem>
                    <DetailItem>
                      <FiPackage />
                      <span>{order.items.length} товарів</span>
                    </DetailItem>
                  </OrderDetails>

                  <ItemsList>
                    <ItemsTitle>Товари в замовленні:</ItemsTitle>
                    <ItemsGrid>
                      {order.items.map((item, index) => (
                        <ItemCard key={index}>
                          <ItemName>{item.product.name}</ItemName>
                          <ItemQuantity>
                            Кількість: {item.quantity} × {item.product.price} ₴
                          </ItemQuantity>
                        </ItemCard>
                      ))}
                    </ItemsGrid>
                  </ItemsList>
                </OrderCard>
              ))}
            </OrdersList>
          )}
        </OrdersContent>
      </Content>
    </OrdersContainer>
  );
};

export default Orders;
