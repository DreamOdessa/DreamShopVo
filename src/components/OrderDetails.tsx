import React from 'react';
import styled from 'styled-components';
import { FiUser, FiTruck, FiCreditCard, FiPackage, FiCalendar } from 'react-icons/fi';
import { Order } from '../types';

interface OrderDetailsProps {
  order: Order;
  onClose: () => void;
  onPrint?: () => void;
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e1e8ed;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const CloseButton = styled.button`
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

const PrintButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-right: 1rem;

  &:hover {
    background: #2980b9;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 500;
`;

const ItemsList = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e1e8ed;
`;

const ItemHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 1px solid #e1e8ed;
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f2f6;

  &:last-child {
    border-bottom: none;
  }

  &:nth-child(even) {
    background: #fafbfc;
  }
`;

const TotalSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  text-align: right;
`;

const TotalText = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
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

const DeliveryMethodText = styled.span`
  padding: 0.25rem 0.75rem;
  background: #ecf0f1;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
`;

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onPrint }) => {
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

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Замовлення #{order.id}</Title>
          <div>
            <PrintButton onClick={handlePrint}>
              📄 Друк накладної
            </PrintButton>
            <CloseButton onClick={onClose}>
              ✕ Закрити
            </CloseButton>
          </div>
        </Header>

        {/* Статус заказа */}
        <Section>
          <SectionTitle>
            <FiCalendar />
            Статус замовлення
          </SectionTitle>
          <StatusBadge status={order.status}>
            {order.status === 'pending' && 'Очікує'}
            {order.status === 'processing' && 'Обробляється'}
            {order.status === 'shipped' && 'Відправлено'}
            {order.status === 'delivered' && 'Доставлено'}
            {order.status === 'cancelled' && 'Скасовано'}
          </StatusBadge>
          <div style={{ marginTop: '0.5rem', color: '#7f8c8d' }}>
            Дата створення: {new Date(order.createdAt).toLocaleString('uk-UA')}
          </div>
        </Section>

        {/* Контактная информация */}
        <Section>
          <SectionTitle>
            <FiUser />
            Контактна інформація
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Ім'я</Label>
              <Value>{order.customerInfo?.firstName || order.shippingAddress.name.split(' ')[0]}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Прізвище</Label>
              <Value>{order.customerInfo?.lastName || order.shippingAddress.name.split(' ')[1] || ''}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Телефон</Label>
              <Value>{order.customerInfo?.phone || order.shippingAddress.phone}</Value>
            </InfoItem>
          </InfoGrid>
        </Section>

        {/* Информация о доставке */}
        <Section>
          <SectionTitle>
            <FiTruck />
            Інформація про доставку
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Місто</Label>
              <Value>{order.deliveryInfo?.city || order.shippingAddress.city}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Спосіб доставки</Label>
              <DeliveryMethodText>
                {getDeliveryMethodText(order.deliveryInfo?.deliveryMethod || 'address')}
              </DeliveryMethodText>
            </InfoItem>
            <InfoItem style={{ gridColumn: '1 / -1' }}>
              <Label>Адреса / Відділення</Label>
              <Value>{order.deliveryInfo?.deliveryDetails || order.shippingAddress.address}</Value>
            </InfoItem>
          </InfoGrid>
        </Section>

        {/* Информация о получателе */}
        {order.recipientInfo && (
          <Section>
            <SectionTitle>
              <FiPackage />
              Інформація про отримувача
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <Label>Тип отримувача</Label>
                <Value>
                  {order.recipientInfo.isPrivatePerson ? 'Приватна особа' : 'Юридична особа'}
                </Value>
              </InfoItem>
              {!order.recipientInfo.isPrivatePerson && order.recipientInfo.establishmentName && (
                <InfoItem>
                  <Label>Назва закладу</Label>
                  <Value>{order.recipientInfo.establishmentName}</Value>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>
        )}

        {/* Информация об оплате */}
        <Section>
          <SectionTitle>
            <FiCreditCard />
            Інформація про оплату
          </SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Спосіб оплати</Label>
              <Value>{getPaymentMethodText(order.paymentInfo?.paymentMethod || 'cash_on_delivery')}</Value>
            </InfoItem>
            {order.paymentInfo?.contactForClarification && (
              <InfoItem>
                <Label>Додаткова інформація</Label>
                <Value>Потрібно зв'язатися для уточнення</Value>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        {/* Список товаров */}
        <Section>
          <SectionTitle>
            <FiPackage />
            Товари в замовленні
          </SectionTitle>
          <ItemsList>
            <ItemHeader>
              <div>Товар</div>
              <div>Кількість</div>
              <div>Ціна</div>
              <div>Сума</div>
            </ItemHeader>
            {order.items.map((item, index) => (
              <ItemRow key={index}>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.product.name}</div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                    {item.product.description}
                  </div>
                </div>
                <div>{item.quantity}</div>
                <div>{item.product.price} ₴</div>
                <div>{item.product.price * item.quantity} ₴</div>
              </ItemRow>
            ))}
          </ItemsList>
          <TotalSection>
            <TotalText>Загальна сума: {order.total} ₴</TotalText>
          </TotalSection>
        </Section>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetails;
