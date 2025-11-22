import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail, FiUser, FiShield, FiPercent, FiShoppingBag, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { User, Order } from '../../types';
import { orderService } from '../../firebase/services';

interface UserProfileModalProps {
  user: User | null;
  onClose: () => void;
  onUpdateUser: (userId: string, updates: Partial<User>) => Promise<void>;
}

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled(motion.div)`
  background: var(--admin-sidebar-bg, #ffffff);
  border-radius: 20px;
  width: min(700px, 100%);
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--admin-grey, #f8f9fa);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--admin-primary, #00acc1);
    border-radius: 10px;

    &:hover {
      background: var(--admin-primary-dark, #00838f);
    }
  }
`;

const Header = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--admin-border, #e9ecef);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: var(--admin-sidebar-bg, #ffffff);
  z-index: 1;
  border-radius: 20px 20px 0 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--admin-dark, #2c3e50);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: var(--admin-primary, #00acc1);
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  color: var(--admin-dark-grey, #6c757d);

  &:hover {
    background: var(--admin-grey, #f8f9fa);
    color: var(--admin-primary, #00acc1);
  }

  svg {
    font-size: 1.5rem;
  }
`;

const Content = styled.div`
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--admin-dark, #2c3e50);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: var(--admin-primary, #00acc1);
  }
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

const InfoLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--admin-dark-grey, #6c757d);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: var(--admin-dark, #2c3e50);
  word-break: break-word;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Control = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--admin-grey, #f8f9fa);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: var(--admin-light-blue, #e0f7fa);
  }
`;

const ControlLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--admin-dark, #2c3e50);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  svg {
    color: var(--admin-primary, #00acc1);
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  width: 50px;
  height: 26px;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    inset: 0;
    background: var(--admin-dark-grey, #6c757d);
    border-radius: 26px;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;
    }
  }

  input:checked + span {
    background: var(--admin-primary, #00acc1);
  }

  input:checked + span::before {
    transform: translateX(24px);
  }
`;

const DiscountInput = styled.input`
  width: 80px;
  padding: 0.5rem;
  border: 2px solid var(--admin-border, #e9ecef);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--admin-primary, #00acc1);
    box-shadow: 0 0 0 3px rgba(0, 172, 193, 0.1);
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #26c6da, #00acc1);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 172, 193, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--admin-grey, #f8f9fa);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--admin-primary, #00acc1);
    border-radius: 10px;
  }
`;

const OrderCard = styled.div`
  padding: 1rem;
  background: var(--admin-grey, #f8f9fa);
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background: var(--admin-light-blue, #e0f7fa);
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderId = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--admin-primary, #00acc1);
`;

const OrderDate = styled.span`
  font-size: 0.8rem;
  color: var(--admin-dark-grey, #6c757d);
`;

const OrderTotal = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: var(--admin-dark, #2c3e50);
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: var(--admin-dark-grey, #6c757d);
  font-size: 0.95rem;
`;

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, onUpdateUser }) => {
  const [isAdmin, setIsAdmin] = useState(user?.isAdmin || false);
  const [discount, setDiscount] = useState(user?.discount || 0);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const loadUserOrders = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const orders = await orderService.getByUserId(user.id);
      setUserOrders(orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
    } catch (error) {
      console.error('Error loading user orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.isAdmin || false);
      setDiscount(user.discount || 0);
      loadUserOrders();
    }
  }, [user, loadUserOrders]);

  useEffect(() => {
    if (user) {
      const adminChanged = isAdmin !== (user.isAdmin || false);
      const discountChanged = discount !== (user.discount || 0);
      setHasChanges(adminChanged || discountChanged);
    }
  }, [isAdmin, discount, user]);

  const handleSave = async () => {
    if (!user?.id || !hasChanges) return;

    try {
      await onUpdateUser(user.id, { isAdmin, discount });
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) return null;

  const totalSpent = userOrders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Header>
            <Title>
              <FiUser />
              Профиль пользователя
            </Title>
            <CloseButton onClick={onClose}>
              <FiX />
            </CloseButton>
          </Header>

          <Content>
            <Section>
              <SectionTitle>
                <FiMail />
                Основная информация
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{user.email}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Имя</InfoLabel>
                  <InfoValue>{user.name || 'Не указано'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>ID пользователя</InfoLabel>
                  <InfoValue style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {user.id?.substring(0, 12)}...
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Дата регистрации</InfoLabel>
                  <InfoValue>Неизвестно</InfoValue>
                </InfoItem>
              </InfoGrid>
            </Section>

            <Section>
              <SectionTitle>
                <FiShield />
                Управление доступом
              </SectionTitle>
              <ControlGroup>
                <Control>
                  <ControlLabel htmlFor="admin-toggle">
                    <FiShield />
                    Права администратора
                  </ControlLabel>
                  <ToggleSwitch>
                    <input
                      id="admin-toggle"
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                    />
                    <span></span>
                  </ToggleSwitch>
                </Control>

                <Control>
                  <ControlLabel htmlFor="discount-input">
                    <FiPercent />
                    Персональная скидка (%)
                  </ControlLabel>
                  <DiscountInput
                    id="discount-input"
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                  />
                </Control>
              </ControlGroup>

              {hasChanges && (
                <SaveButton onClick={handleSave}>
                  Сохранить изменения
                </SaveButton>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiShoppingBag />
                История заказов ({userOrders.length})
              </SectionTitle>
              
              {userOrders.length > 0 && (
                <InfoGrid style={{ marginBottom: '1rem' }}>
                  <InfoItem>
                    <InfoLabel>Всего заказов</InfoLabel>
                    <InfoValue>{userOrders.length}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>Общая сумма</InfoLabel>
                    <InfoValue>{totalSpent.toFixed(2)} ₴</InfoValue>
                  </InfoItem>
                </InfoGrid>
              )}

              {loading ? (
                <EmptyState>Загрузка заказов...</EmptyState>
              ) : userOrders.length === 0 ? (
                <EmptyState>Заказов пока нет</EmptyState>
              ) : (
                <OrdersList>
                  {userOrders.map(order => (
                    <OrderCard key={order.id}>
                      <OrderInfo>
                        <OrderId>#{order.id.substring(0, 8)}</OrderId>
                        <OrderDate>
                          <FiCalendar style={{ display: 'inline', marginRight: '4px' }} />
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </OrderDate>
                        <StatusBadge status={order.status}>{order.status}</StatusBadge>
                      </OrderInfo>
                      <OrderTotal>
                        <FiDollarSign style={{ display: 'inline' }} />
                        {order.total.toFixed(2)} ₴
                      </OrderTotal>
                    </OrderCard>
                  ))}
                </OrdersList>
              )}
            </Section>
          </Content>
        </ModalContainer>
      </Overlay>
    </AnimatePresence>
  );
};

export default UserProfileModal;
