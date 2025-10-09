import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiUsers, FiPackage, FiShoppingBag, FiSave, FiX, FiGrid, FiEye } from 'react-icons/fi';
import CategoryManager from '../components/CategoryManager';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { Product, Order } from '../types';
import OrderDetails from '../components/OrderDetails';
import toast from 'react-hot-toast';

const AdminContainer = styled.div`
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

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  border-radius: 15px;
  padding: 0.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Tab = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.isActive ? 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)' : 'transparent'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${props => props.isActive ? 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)' : '#f8f9fa'};
    color: ${props => props.isActive ? 'white' : '#00acc1'};
  }
`;

const Content = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const TableHeader = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  transition: background-color 0.3s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' | 'save' | 'cancel' }>`
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.2rem;

  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: #3498db;
          color: white;
          &:hover { background: #2980b9; }
        `;
      case 'delete':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      case 'save':
        return `
          background: #27ae60;
          color: white;
          &:hover { background: #229954; }
        `;
      case 'cancel':
        return `
          background: #95a5a6;
          color: white;
          &:hover { background: #7f8c8d; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #6c757d;
          &:hover { background: #e9ecef; }
        `;
    }
  }}
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 60px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 50%;

  &:hover {
    background: #f8f9fa;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
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

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { products, users, orders, addProduct, updateProduct, deleteProduct, updateUserDiscount, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState('products');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // const [editingUser, setEditingUser] = useState<User | null>(null); // Отключено для избежания неиспользуемой переменной
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'chips',
    organic: false,
    inStock: true,
    weight: '',
    ingredients: ''
  });

  if (!user?.isAdmin) {
    return (
      <AdminContainer>
        <div className="container">
          <EmptyState>
            <h3>Доступ запрещен</h3>
            <p>У вас нет прав для доступа к админ панели</p>
          </EmptyState>
        </div>
      </AdminContainer>
    );
  }

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'chips',
      organic: false,
      inStock: true,
      weight: '',
      ingredients: ''
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image,
      category: product.category,
      organic: product.organic,
      inStock: product.inStock,
      weight: product.weight || '',
      ingredients: product.ingredients?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.description || !productForm.price || !productForm.image) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    const productData = {
      ...productForm,
      price: parseFloat(productForm.price),
      category: productForm.category as 'chips' | 'decorations' | 'syrups' | 'purees' | 'dried_flowers',
      ingredients: productForm.ingredients ? productForm.ingredients.split(',').map(i => i.trim()) : []
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Товар обновлен!');
    } else {
      addProduct(productData);
      toast.success('Товар добавлен!');
    }

    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      deleteProduct(id);
      toast.success('Товар удален!');
    }
  };

  const handleUserDiscountChange = (userId: string, discount: number) => {
    updateUserDiscount(userId, discount);
    toast.success('Скидка обновлена!');
  };

  const handleOrderStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    toast.success('Статус заказа обновлен!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'processing': return '#3498db';
      case 'shipped': return '#9b59b6';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#6c757d';
    }
  };

  // const getStatusText = (status: string) => {
  //   switch (status) {
  //     case 'pending': return 'Ожидает';
  //     case 'processing': return 'Обрабатывается';
  //     case 'shipped': return 'Отправлен';
  //     case 'delivered': return 'Доставлен';
  //     case 'cancelled': return 'Отменен';
  //     default: return status;
  //   }
  // }; // Отключено для избежания неиспользуемой функции

  return (
    <AdminContainer>
      <Header>
        <div className="container">
          <Title>Адмін панель</Title>
          <Subtitle>Управління товарами, користувачами та замовленнями</Subtitle>
        </div>
      </Header>

      <AdminContent>
        <Tabs>
          <Tab isActive={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            <FiPackage />
            Товари
          </Tab>
          <Tab isActive={activeTab === 'categories'} onClick={() => setActiveTab('categories')}>
            <FiGrid />
            Категорії
          </Tab>
          <Tab isActive={activeTab === 'users'} onClick={() => setActiveTab('users')}>
            <FiUsers />
            Користувачі
          </Tab>
          <Tab isActive={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
            <FiShoppingBag />
            Замовлення
          </Tab>
        </Tabs>

        <Content>
          {activeTab === 'products' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiPackage />
                  Управление товарами
                </SectionTitle>
                <AddButton onClick={handleAddProduct}>
                  <FiPlus />
                  Добавить товар
                </AddButton>
              </SectionHeader>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Изображение</TableHeader>
                    <TableHeader>Название</TableHeader>
                    <TableHeader>Категория</TableHeader>
                    <TableHeader>Цена</TableHeader>
                    <TableHeader>Наличие</TableHeader>
                    <TableHeader>Действия</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: '600', color: '#2c3e50' }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#6c757d' }}>
                            {product.description.substring(0, 50)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.price} ₴</TableCell>
                      <TableCell>
                        <span style={{
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: product.inStock ? '#d4edda' : '#f8d7da',
                          color: product.inStock ? '#155724' : '#721c24'
                        }}>
                          {product.inStock ? 'В наличии' : 'Нет в наличии'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <ActionButton variant="edit" onClick={() => handleEditProduct(product)}>
                          <FiEdit />
                        </ActionButton>
                        <ActionButton variant="delete" onClick={() => handleDeleteProduct(product.id)}>
                          <FiTrash2 />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CategoryManager />
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiUsers />
                  Управление пользователями
                </SectionTitle>
              </SectionHeader>

              <Table>
                <thead>
                  <tr>
                    <TableHeader>Имя</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Скидка</TableHeader>
                    <TableHeader>Действия</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={user.discount || 0}
                          onChange={(e) => handleUserDiscountChange(user.id, parseInt(e.target.value) || 0)}
                          style={{ width: '80px' }}
                        />
                        <span style={{ marginLeft: '0.5rem', color: '#6c757d' }}>%</span>
                      </TableCell>
                      <TableCell>
                        {/*<ActionButton variant="edit" onClick={() => setEditingUser(user)}>
                          <FiEdit />
                        </ActionButton>*/}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SectionHeader>
                <SectionTitle>
                  <FiShoppingBag />
                  Управление заказами
                </SectionTitle>
              </SectionHeader>

              {orders.length === 0 ? (
                <EmptyState>
                  <h3>Нет заказов</h3>
                  <p>Заказы будут отображаться здесь</p>
                </EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <TableHeader>ID замовлення</TableHeader>
                      <TableHeader>Клієнт</TableHeader>
                      <TableHeader>Товари</TableHeader>
                      <TableHeader>Сума</TableHeader>
                      <TableHeader>Статус</TableHeader>
                      <TableHeader>Дата</TableHeader>
                      <TableHeader>Дії</TableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>#{order.id}</TableCell>
                        <TableCell>{order.shippingAddress.name}</TableCell>
                        <TableCell>{order.items.length} товаров</TableCell>
                        <TableCell>{order.total} ₴</TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                            style={{ background: getStatusColor(order.status), color: 'white', border: 'none' }}
                          >
                            <option value="pending">Ожидает</option>
                            <option value="processing">Обрабатывается</option>
                            <option value="shipped">Отправлен</option>
                            <option value="delivered">Доставлен</option>
                            <option value="cancelled">Отменен</option>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <ActionButton variant="edit" onClick={() => setSelectedOrder(order)}>
                            <FiEye />
                          </ActionButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              )}
            </motion.div>
          )}
        </Content>
      </AdminContent>

      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
              </ModalTitle>
              <CloseButton onClick={() => setShowModal(false)}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            <FormGroup>
              <Label>Название *</Label>
              <Input
                value={productForm.name}
                onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Название товара"
              />
            </FormGroup>

            <FormGroup>
              <Label>Описание *</Label>
              <TextArea
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание товара"
              />
            </FormGroup>

            <FormGroup>
              <Label>Цена *</Label>
              <Input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="Цена в рублях"
              />
            </FormGroup>

            <FormGroup>
              <Label>URL изображения *</Label>
              <Input
                value={productForm.image}
                onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </FormGroup>

            <FormGroup>
              <Label>Категория</Label>
              <Select
                value={productForm.category}
                onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value as any }))}
              >
                <option value="chips">Фруктовые чипсы</option>
                <option value="decorations">Украшения</option>
                <option value="syrups">Сиропы</option>
                <option value="purees">Пюре</option>
                <option value="dried_flowers">Сухоцветы</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Вес</Label>
              <Input
                value={productForm.weight}
                onChange={(e) => setProductForm(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="100г, 250мл и т.д."
              />
            </FormGroup>

            <FormGroup>
              <Label>Ингредиенты (через запятую)</Label>
              <Input
                value={productForm.ingredients}
                onChange={(e) => setProductForm(prev => ({ ...prev, ingredients: e.target.value }))}
                placeholder="Яблоки, корица, лимонный сок"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={productForm.organic}
                  onChange={(e) => setProductForm(prev => ({ ...prev, organic: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                Органический продукт
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>
                <input
                  type="checkbox"
                  checked={productForm.inStock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, inStock: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                />
                В наличии
              </Label>
            </FormGroup>

            <ModalButtons>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                <FiX />
                Отмена
              </Button>
              <Button variant="primary" onClick={handleSaveProduct}>
                <FiSave />
                Сохранить
              </Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}

      {/* Детальный просмотр заказа */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onPrint={() => {
            // Функция печати накладной
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <html>
                  <head>
                    <title>Накладна #${selectedOrder.id}</title>
                    <style>
                      body { font-family: Arial, sans-serif; margin: 20px; }
                      .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
                      .section { margin: 20px 0; }
                      .info { display: flex; justify-content: space-between; margin: 10px 0; }
                      .items { border: 1px solid #333; border-collapse: collapse; width: 100%; }
                      .items th, .items td { border: 1px solid #333; padding: 8px; text-align: left; }
                      .total { text-align: right; font-weight: bold; margin-top: 20px; }
                    </style>
                  </head>
                  <body>
                    <div class="header">
                      <h1>DreamShop</h1>
                      <h2>Накладна #${selectedOrder.id}</h2>
                      <p>Дата: ${new Date(selectedOrder.createdAt).toLocaleString('uk-UA')}</p>
                    </div>
                    
                    <div class="section">
                      <h3>Клієнт:</h3>
                      <div class="info">
                        <span>Ім'я: ${selectedOrder.customerInfo?.firstName || selectedOrder.shippingAddress.name.split(' ')[0]}</span>
                        <span>Телефон: ${selectedOrder.customerInfo?.phone || selectedOrder.shippingAddress.phone}</span>
                      </div>
                      <div class="info">
                        <span>Місто: ${selectedOrder.deliveryInfo?.city || selectedOrder.shippingAddress.city}</span>
                        <span>Адреса: ${selectedOrder.deliveryInfo?.deliveryDetails || selectedOrder.shippingAddress.address}</span>
                      </div>
                    </div>
                    
                    <div class="section">
                      <h3>Товари:</h3>
                      <table class="items">
                        <tr>
                          <th>Товар</th>
                          <th>Кількість</th>
                          <th>Ціна</th>
                          <th>Сума</th>
                        </tr>
                        ${selectedOrder.items.map(item => `
                          <tr>
                            <td>${item.product.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.product.price} ₴</td>
                            <td>${item.product.price * item.quantity} ₴</td>
                          </tr>
                        `).join('')}
                      </table>
                      <div class="total">Загальна сума: ${selectedOrder.total} ₴</div>
                    </div>
                  </body>
                </html>
              `);
              printWindow.document.close();
              printWindow.print();
            }
          }}
        />
      )}
    </AdminContainer>
  );
};

export default AdminPanel;

