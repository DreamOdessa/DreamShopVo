import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiUser, FiHeart, FiShoppingBag, FiLogOut, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import toast from 'react-hot-toast';

const ProfileContainer = styled.div`
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

const ProfileContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProfileSidebar = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  margin: 0 auto 1rem;
`;

const UserName = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const UserEmail = styled.p`
  color: #6c757d;
  font-size: 1rem;
`;

const MenuItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MenuItem = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: none;
  background: ${props => props.isActive ? '#f8f9fa' : 'transparent'};
  color: ${props => props.isActive ? '#667eea' : '#6c757d'};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    background: #f8f9fa;
    color: #667eea;
  }
`;

const MainContent = styled.div`
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

  &:disabled {
    background: #f8f9fa;
    color: #6c757d;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 150, 136, 0.3);
          }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover {
            background: #c0392b;
          }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #e9ecef;
          &:hover {
            background: #e9ecef;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
  }
`;

const FavoritesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FavoriteItem = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FavoriteImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
`;

const FavoriteInfo = styled.div`
  flex: 1;
`;

const FavoriteName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.3rem;
`;

const FavoritePrice = styled.p`
  font-size: 0.9rem;
  color: #27ae60;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c0392b;
    transform: scale(1.1);
  }
`;

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { orders } = useAdmin();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const userOrders = orders.filter(order => order.userId === user?.id);
  const favoriteProducts: any[] = []; // В реальном приложении это было бы из контекста

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleSave = () => {
    // В реальном приложении здесь был бы API вызов для обновления профиля
    toast.success('Профиль обновлен!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из системы');
  };

  if (!user) {
    return (
      <ProfileContainer>
        <div className="container">
          <EmptyState>
            <h3>Войдите в систему</h3>
            <p>Для доступа к профилю необходимо войти в систему</p>
          </EmptyState>
        </div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <div className="container">
          <Title>Мой профиль</Title>
          <Subtitle>Управляйте своими данными и заказами</Subtitle>
        </div>
      </Header>

      <ProfileContent>
        <ProfileSidebar>
          <UserInfo>
            <Avatar>
              <FiUser />
            </Avatar>
            <UserName>{user.name}</UserName>
            <UserEmail>{user.email}</UserEmail>
          </UserInfo>

          <MenuItems>
            <MenuItem
              isActive={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            >
              <FiUser />
              Профиль
            </MenuItem>
            <MenuItem
              isActive={activeTab === 'favorites'}
              onClick={() => setActiveTab('favorites')}
            >
              <FiHeart />
              Избранное
            </MenuItem>
            <MenuItem
              isActive={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
            >
              <FiShoppingBag />
              Заказы
            </MenuItem>
          </MenuItems>
        </ProfileSidebar>

        <MainContent>
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle>
                <FiUser />
                Личная информация
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="name">Имя</Label>
                <Input
                  type="text"
                  id="name"
                  value={editData.name}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={!isEditing}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={!isEditing}
                />
              </FormGroup>

              <ButtonGroup>
                {isEditing ? (
                  <>
                    <Button variant="primary" onClick={handleSave}>
                      <FiSave />
                      Сохранить
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      <FiX />
                      Отмена
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" onClick={handleEdit}>
                    <FiEdit3 />
                    Редактировать
                  </Button>
                )}
                <Button variant="danger" onClick={handleLogout}>
                  <FiLogOut />
                  Выйти
                </Button>
              </ButtonGroup>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle>
                <FiHeart />
                Избранные товары
              </SectionTitle>

              {favoriteProducts.length === 0 ? (
                <EmptyState>
                  <h3>Нет избранных товаров</h3>
                  <p>Добавьте товары в избранное, чтобы они появились здесь</p>
                </EmptyState>
              ) : (
                <FavoritesGrid>
                  {favoriteProducts.map((product: any) => (
                    <FavoriteItem key={product.id}>
                      <FavoriteImage src={product.image} alt={product.name} />
                      <FavoriteInfo>
                        <FavoriteName>{product.name}</FavoriteName>
                        <FavoritePrice>{product.price} ₴</FavoritePrice>
                      </FavoriteInfo>
                      <RemoveButton>
                        <FiX />
                      </RemoveButton>
                    </FavoriteItem>
                  ))}
                </FavoritesGrid>
              )}
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionTitle>
                <FiShoppingBag />
                История заказов
              </SectionTitle>

              {userOrders.length === 0 ? (
                <EmptyState>
                  <h3>Нет заказов</h3>
                  <p>Ваши заказы будут отображаться здесь</p>
                </EmptyState>
              ) : (
                <div>
                  {userOrders.map(order => (
                    <div
                      key={order.id}
                      style={{
                        background: '#f8f9fa',
                        borderRadius: '15px',
                        padding: '1.5rem',
                        marginBottom: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, color: '#2c3e50' }}>Заказ #{order.id}</h4>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          background: order.status === 'delivered' ? '#27ae60' : '#f39c12',
                          color: 'white'
                        }}>
                          {order.status === 'pending' && 'Ожидает'}
                          {order.status === 'processing' && 'Обрабатывается'}
                          {order.status === 'shipped' && 'Отправлен'}
                          {order.status === 'delivered' && 'Доставлен'}
                          {order.status === 'cancelled' && 'Отменен'}
                        </span>
                      </div>
                      <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>
                        Товаров: {order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                      </p>
                      <p style={{ color: '#6c757d', marginBottom: '0.5rem' }}>
                        Сумма: {order.total} ₴
                      </p>
                      <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                        Дата: {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </MainContent>
      </ProfileContent>
    </ProfileContainer>
  );
};

export default Profile;

