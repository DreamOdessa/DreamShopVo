import React, { useState } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../contexts/AdminContext';
import { Category } from '../types';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';
import toast from 'react-hot-toast';

const CategoryManagerContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h3`
  color: #333;
  margin: 0;
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 150, 136, 0.3);
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #00acc1;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 150, 136, 0.1);
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CategoryName = styled.h4`
  color: #333;
  margin: 0;
  font-size: 1.1rem;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
    color: #333;
  }

  &.delete:hover {
    background: #ffebee;
    color: #d32f2f;
  }
`;

const CategoryDescription = styled.p`
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const CategoryMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #999;
`;

const StatusBadge = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#4caf50' : '#f44336'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00acc1;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 150, 136, 0.3);
    }
  ` : `
    background: #f8f9fa;
    color: #666;
    border: 2px solid #e9ecef;
    &:hover {
      background: #e9ecef;
    }
  `}
`;

const CategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products, updateProduct, loading } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    sortOrder: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        image: category.image || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder
      });
      setImagePreview(category.image || '');
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: '',
        isActive: true,
        sortOrder: 0
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
    
    handleCloseModal();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Размер изображения не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Создаем превью
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Загружаем в Firebase Storage
      const downloadURL = await storageService.uploadFile(
        file, 
        STORAGE_PATHS.CATEGORIES
      );

      // Сохраняем URL из Firebase Storage
      setFormData(prev => ({ ...prev, image: downloadURL }));
      toast.success('✅ Изображение категории загружено!');
      
      // Очищаем превью URL
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Ошибка загрузки изображения категории:', error);
      toast.error('❌ Ошибка загрузки изображения');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    const newActiveState = !category.isActive;
    
    try {
      // Обновляем категорию
      await updateCategory(category.id, { isActive: newActiveState });
      
      // Обновляем все товары этой категории одним батчем
      const categoryProducts = products.filter(p => p.category === category.slug);
      
      // Создаем массив промисов для параллельного обновления
      const updatePromises = categoryProducts.map(product => 
        updateProduct(product.id, { isActive: newActiveState })
      );
      
      // Выполняем все обновления параллельно
      await Promise.all(updatePromises);
      
      toast.success(newActiveState 
        ? `✅ Категория "${category.name}" и ${categoryProducts.length} товаров активированы` 
        : `👁️ Категория "${category.name}" и ${categoryProducts.length} товаров скрыты`
      );
    } catch (error) {
      console.error('Ошибка обновления категории:', error);
      toast.error('❌ Ошибка обновления категории');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      await deleteCategory(id);
    }
  };

  if (loading) {
    return (
      <CategoryManagerContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Завантаження...
        </div>
      </CategoryManagerContainer>
    );
  }

  return (
    <CategoryManagerContainer>
      <Header>
        <Title>Управління категоріями</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Додати категорію
        </AddButton>
      </Header>

      <CategoryGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id}>
            <CategoryHeader>
              <CategoryName>{category.name}</CategoryName>
              <CategoryActions>
                <ActionButton onClick={() => handleOpenModal(category)}>
                  <FiEdit />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  onClick={() => handleDelete(category.id)}
                >
                  <FiTrash2 />
                </ActionButton>
              </CategoryActions>
            </CategoryHeader>
            <CategoryDescription>{category.description}</CategoryDescription>
            <CategoryMeta>
              <span>Порядок: {category.sortOrder}</span>
              <StatusBadge 
                active={category.isActive}
                onClick={() => handleToggleActive(category)}
                title={category.isActive ? 'Нажмите чтобы скрыть категорию и все товары' : 'Нажмите чтобы показать категорию и все товары'}
              >
                {category.isActive ? 'Активна' : 'Неактивна'}
              </StatusBadge>
            </CategoryMeta>
          </CategoryCard>
        ))}
      </CategoryGrid>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCategory ? 'Редагувати категорію' : 'Додати категорію'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Назва категорії</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Slug (URL)</Label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Опис</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Іконка (URL)</Label>
              <Input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Зображення (URL)</Label>
              <Input
                type="text"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setImagePreview(e.target.value);
                }}
              />
              
              <label style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%)',
                color: 'white',
                borderRadius: '8px',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.6 : 1,
                marginTop: '0.5rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none'
              }}>
                <FiUpload />
                {isUploading ? 'Загрузка...' : 'Загрузить изображение с устройства'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
              </label>

              {imagePreview && (
                <div style={{ marginTop: '1rem' }}>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '200px', 
                      borderRadius: '8px',
                      border: '2px solid #e9ecef'
                    }} 
                  />
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Порядок сортування</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </FormGroup>

            <CheckboxGroup>
              <Checkbox
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
              <Label>Активна категорія</Label>
            </CheckboxGroup>

            <ButtonGroup>
              <Button type="button" onClick={handleCloseModal}>
                Скасувати
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? 'Оновити' : 'Додати'}
              </Button>
            </ButtonGroup>
          </Form>
        </ModalContent>
      </Modal>
    </CategoryManagerContainer>
  );
};

export default CategoryManager;
