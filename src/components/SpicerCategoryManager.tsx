import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../contexts/AdminContext';
import { Category } from '../types';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiArrowRight } from 'react-icons/fi';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';
import toast from 'react-hot-toast';
import MoveProductsModal from './MoveProductsModal';

const ManagerContainer = styled.div`
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
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa500 100%);
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
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CategoryCard = styled.div`
  background: #fef9f3;
  border: 2px solid #ffe4cc;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff6b35;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.1);
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
    background: #ffe4cc;
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
  font-size: 0.95rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 8px rgba(255, 107, 53, 0.2);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa500 100%);
        color: white;
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
        }
      `;
    } else {
      return `
        background: #f0f0f0;
        color: #333;
        &:hover {
          background: #e0e0e0;
        }
      `;
    }
  }}
`;

const SubcategorySection = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const SubcategoryTitle = styled.h5`
  color: #333;
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
`;

const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SubcategoryItem = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubcategoryName = styled.div`
  color: #333;
  font-size: 0.9rem;
`;

const SubcategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

interface FormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  parentSlug: string;
}

const SpicerCategoryManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, updateProduct, loading } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedCategoryForMove, setSelectedCategoryForMove] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    sortOrder: 0,
    parentSlug: ''
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Фильтруем только категории Spícer - используем специальный префикс/маркер
  // Категории Spícer будут иметь parentSlug = 'spicer-root' для корневых или 'spicer-xxx' для подкатегорий
  const spicerCategories = useMemo(() => {
    return categories.filter(cat => 
      cat.parentSlug === 'spicer-root' || (cat.parentSlug && cat.parentSlug.startsWith('spicer-'))
    ).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  const rootCategories = useMemo(() => {
    return spicerCategories.filter(cat => cat.parentSlug === 'spicer-root');
  }, [spicerCategories]);

  const getSubcategories = (parentSlug: string) => {
    return spicerCategories.filter(cat => cat.parentSlug === parentSlug);
  };

  const spicerProducts = useMemo(() => {
    return products.filter(p => p.brand === 'spicer' || p.isSpicer);
  }, [products]);

  const hasLinkedProducts = (categorySlug: string) => {
    return spicerProducts.some(p => p.category === categorySlug || p.subcategory === categorySlug);
  };

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
        sortOrder: category.sortOrder,
        parentSlug: category.parentSlug || ''
      });
      setSlugTouched(true);
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
        sortOrder: 0,
        parentSlug: 'spicer-root'
      });
      setSlugTouched(false);
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const slugify = (value: string) => {
    const map: Record<string, string> = {
      а:'a', б:'b', в:'v', г:'g', ґ:'g', д:'d', е:'e', є:'ie', ж:'zh', з:'z', и:'y', і:'i', ї:'i', й:'i', к:'k', л:'l', м:'m', н:'n', о:'o', п:'p', р:'r', с:'s', т:'t', у:'u', ф:'f', х:'kh', ц:'ts', ч:'ch', ш:'sh', щ:'shch', ь:'', ю:'iu', я:'ia', ы:'y', э:'e', ё:'e'
    };
    return value
      .toLowerCase()
      .split('')
      .map(ch => map[ch] ?? ch)
      .join('')
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = formData.slug && formData.slug.trim().length > 0
      ? formData.slug
      : slugify(formData.name);
    const payload = { ...formData, slug: finalSlug };
    
    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await addCategory(payload);
    }
    
    handleCloseModal();
  };

  const handleNameChange = (val: string) => {
    setFormData(prev => {
      const next = { ...prev, name: val };
      if (!slugTouched) {
        next.slug = slugify(val);
      }
      return next;
    });
  };

  const handleSlugChange = (val: string) => {
    setSlugTouched(true);
    setFormData(prev => ({ ...prev, slug: slugify(val) }));
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
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const downloadURL = await storageService.uploadFile(
        file, 
        STORAGE_PATHS.CATEGORIES
      );

      setFormData(prev => ({ ...prev, image: downloadURL }));
      toast.success('✅ Изображение загружено!');
      
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      toast.error('❌ Ошибка загрузки изображения');
      setImagePreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const cat = spicerCategories.find(c => c.id === id);
    if (!cat) return;
    if (hasLinkedProducts(cat.slug)) {
      toast.error('Неможливо видалити: до категорії привʼязані товари.');
      return;
    }
    if (window.confirm('Ви впевнені, що хочете видалити цю категорію?')) {
      await deleteCategory(id);
    }
  };

  const handleMoveProducts = async (
    productIds: string[],
    targetCategorySlug: string,
    targetSubcategorySlug: string
  ) => {
    const updatePromises = productIds.map(productId => {
      return updateProduct(productId, {
        category: targetCategorySlug,
        subcategory: targetSubcategorySlug || ''
      });
    });

    await Promise.all(updatePromises);
  };

  if (loading) {
    return (
      <ManagerContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Завантаження...
        </div>
      </ManagerContainer>
    );
  }

  return (
    <ManagerContainer>
      <Header>
        <Title>🌶️ Категорії Spícer</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus />
          Додати категорію
        </AddButton>
      </Header>

      {rootCategories.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#999',
          background: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p>Категорій Spícer не знайдено. Створіть першу категорію!</p>
        </div>
      ) : (
        <CategoryGrid>
          {rootCategories.map((category) => {
            const subcats = getSubcategories(category.slug);
            const linkedProducts = spicerProducts.filter(p => p.category === category.slug);
            
            return (
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

                {category.image && (
                  <div style={{ marginBottom: '1rem' }}>
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                )}

                <CategoryDescription>{category.description}</CategoryDescription>

                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
                  📦 Товарів: {linkedProducts.length}
                </div>

                {subcats.length > 0 && (
                  <SubcategorySection>
                    <SubcategoryTitle>Підкатегорії ({subcats.length})</SubcategoryTitle>
                    <SubcategoryList>
                      {subcats.map(subcat => (
                        <SubcategoryItem key={subcat.id}>
                          <SubcategoryName>{subcat.name}</SubcategoryName>
                          <SubcategoryActions>
                            <ActionButton onClick={() => handleOpenModal(subcat)} style={{ padding: '0.25rem' }}>
                              <FiEdit size={16} />
                            </ActionButton>
                            <ActionButton 
                              className="delete"
                              onClick={() => handleDelete(subcat.id)}
                              style={{ padding: '0.25rem' }}
                            >
                              <FiTrash2 size={16} />
                            </ActionButton>
                          </SubcategoryActions>
                        </SubcategoryItem>
                      ))}
                    </SubcategoryList>
                  </SubcategorySection>
                )}

                <div style={{
                  marginTop: '1rem',
                  display: 'flex',
                  gap: '0.5rem',
                  flexDirection: 'column'
                }}>
                  <Button 
                    onClick={() => handleOpenModal()}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    + Підкатегорія
                  </Button>

                  {linkedProducts.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCategoryForMove(category);
                        setIsMoveModalOpen(true);
                      }}
                      style={{
                        padding: '0.6rem',
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 50%, #e65100 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                        (e.target as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                        (e.target as HTMLButtonElement).style.boxShadow = 'none';
                      }}
                    >
                      <FiArrowRight size={16} />
                      Переместить товары
                    </button>
                  )}
                </div>
              </CategoryCard>
            );
          })}
        </CategoryGrid>
      )}

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingCategory ? 'Редагувати категорію' : 'Нова категорія Spícer'}
            </ModalTitle>
            <CloseButton onClick={handleCloseModal}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Назва категорії *</Label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="наприклад: Крепкі алкоголі"
              />
            </FormGroup>

            <FormGroup>
              <Label>Slug (URL ідентифікатор)</Label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="auto-generated-from-name"
              />
              <p style={{ fontSize: '0.75rem', color: '#999', margin: 0 }}>
                Залишіть порожнім для автозаповнення.
              </p>
            </FormGroup>

            <FormGroup>
              <Label>Опис</Label>
              <Input
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Описание категорії"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
            </FormGroup>

            <FormGroup>
              <Label>Іконка (emoji або символ)</Label>
              <Input
                type="text"
                maxLength={2}
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🍾"
              />
            </FormGroup>

            <FormGroup>
              <Label>Зображення</Label>
              <Input
                type="url"
                placeholder="https://..."
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
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa500 100%)',
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
                {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
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

            <FormGroup>
              <Label>Батьківська категорія</Label>
              <select
                style={{ padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px' }}
                value={formData.parentSlug}
                onChange={(e) => setFormData(prev => ({ ...prev, parentSlug: e.target.value }))}
              >
                <option value='spicer-root'>— основна категорія Spícer —</option>
                {rootCategories.filter(c => c.id !== editingCategory?.id).map(c => (
                  <option key={c.id} value={c.slug}>{c.name} (підкатегорія)</option>
                ))}
              </select>
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

      <MoveProductsModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        products={products}
        categories={categories}
        sourceCategory={selectedCategoryForMove}
        onMove={handleMoveProducts}
        isForSpicer={true}
      />
    </ManagerContainer>
  );
};

export default SpicerCategoryManager;
