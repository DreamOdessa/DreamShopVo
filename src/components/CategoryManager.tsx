import React, { useState } from 'react';
import styled from 'styled-components';
import { useAdmin } from '../contexts/AdminContext';
import { Category } from '../types';
import { FiEdit, FiTrash2, FiPlus, FiX, FiUpload, FiShuffle, FiArrowRight } from 'react-icons/fi';
import { storageService, STORAGE_PATHS } from '../firebase/storageService';
import toast from 'react-hot-toast';
import MoveProductsModal from './MoveProductsModal';

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
  const [isDistributeOpen, setIsDistributeOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedCategoryForMove, setSelectedCategoryForMove] = useState<Category | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    sortOrder: 0,
    parentSlug: '' as string | ''
  });
  const [slugTouched, setSlugTouched] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectionMap, setSelectionMap] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<{ child: Category; matches: typeof products }[]>([]);
  const [customKeywords, setCustomKeywords] = useState<Record<string, string>>({});

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
      setSlugTouched(true); // existing category slug stays manual
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
        parentSlug: ''
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

  // Slug generation (supports basic Cyrillic -> Latin transliteration)
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
    // Only name is required; slug is optional and auto-generated from name if empty
    const finalSlug = formData.slug && formData.slug.trim().length > 0
      ? formData.slug
      : slugify(formData.name);
    const payload = { ...formData, slug: finalSlug } as any;
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

  // Удаление категории блокируется, если есть связанные продукты
  const hasLinkedProducts = (categorySlug: string) => {
    return products.some(p => p.category === categorySlug || p.subcategory === categorySlug);
  };

  // ---------- Автоматичний розклад товарів по підкатегоріях ----------
  const matchHeuristic = (p: typeof products[number], child: Category) => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const extra = (customKeywords[child.slug] || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    const tokens = [child.name.toLowerCase(), child.slug.toLowerCase(), ...extra];
    return tokens.some(t => t && (name.includes(t) || desc.includes(t)));
  };

  const recomputePreview = (parentSlug: string) => {
    const children = categories.filter(c => c.parentSlug === parentSlug);
    const nextPreview = children.map(child => {
      const matches = products.filter(p => p.category === parentSlug && !p.subcategory && matchHeuristic(p, child));
      return { child, matches };
    });
    setPreview(nextPreview);
    const nextMap: Record<string, boolean> = {};
    nextPreview.forEach(({ child, matches }) => {
      nextMap[child.slug] = matches.length > 0;
    });
    setSelectionMap(nextMap);
  };

  const openDistributeModal = () => {
    const firstRoot = categories.find(c => !c.parentSlug);
    const initialParent = firstRoot?.slug || '';
    setSelectedParent(initialParent);
    if (initialParent) {
      recomputePreview(initialParent);
    } else {
      setPreview([]);
      setSelectionMap({});
    }
    setIsDistributeOpen(true);
  };

  const handleParentChange = (slug: string) => {
    setSelectedParent(slug);
    if (slug) recomputePreview(slug);
    else {
      setPreview([]);
      setSelectionMap({});
    }
  };

  const handleToggleChildSelection = (childSlug: string) => {
    setSelectionMap(prev => ({ ...prev, [childSlug]: !prev[childSlug] }));
  };

  const handleApplyDistribution = async () => {
    const tasks: Promise<any>[] = [];
    let total = 0;
    preview.forEach(({ child, matches }) => {
      if (!selectionMap[child.slug]) return;
      matches.forEach(prod => {
        if (prod.subcategory !== child.slug) {
          total++;
          tasks.push(updateProduct(prod.id, { subcategory: child.slug }));
        }
      });
    });
    if (total === 0) {
      toast('Немає товарів для оновлення');
      return;
    }
    try {
      await Promise.all(tasks);
      toast.success(`Оновлено товарів: ${total}`);
      setIsDistributeOpen(false);
    } catch (error) {
      console.error('Помилка масового оновлення товарів:', error);
      toast.error('❌ Помилка масового оновлення товарів');
    }
  };

  // Міграція старої схеми: якщо у товару category == slug підкатегорії,
  // то переносимо category у батьківський slug, а subcategory = старий slug
  const migrateLegacyScheme = async () => {
    // Побудуємо мапу підкатегоріяSlug -> батьківськийSlug
    const childToParent: Record<string, string> = {};
    categories.forEach(c => {
      if (c.parentSlug) childToParent[c.slug] = c.parentSlug;
    });

    const tasks: Promise<any>[] = [];
    let moved = 0;
    products.forEach(p => {
      const parent = childToParent[p.category as string];
      if (parent && !p.subcategory) {
        moved++;
        tasks.push(updateProduct(p.id, { category: parent as any, subcategory: p.category }));
      }
    });

    if (moved === 0) {
      toast('Немає товарів для міграції за старою схемою');
      return;
    }
    try {
      await Promise.all(tasks);
      toast.success(`Перепривʼязано товарів: ${moved}`);
    } catch (e) {
      console.error('Помилка міграції старої схеми:', e);
      toast.error('❌ Помилка міграції старої схеми');
    }
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

      // Загружаем в Cloudinary
      const downloadURL = await storageService.uploadFile(
        file, 
        STORAGE_PATHS.CATEGORIES
      );

      // Сохраняем URL из Cloudinary
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
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    // Проверяем связанные продукты
    if (hasLinkedProducts(cat.slug)) {
      toast.error('Неможливо видалити: до категорії привʼязані товари. Перепривʼяжіть їх спочатку.');
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <AddButton onClick={() => handleOpenModal()}>
            <FiPlus />
            Додати категорію
          </AddButton>
          <AddButton onClick={openDistributeModal} style={{ background: 'linear-gradient(135deg, #81c784 0%, #66bb6a 50%, #43a047 100%)' }}>
            <FiShuffle />
            Авто-розклад товарів
          </AddButton>
        </div>
      </Header>

      <CategoryGrid>
        {categories
          .sort((a,b) => a.sortOrder - b.sortOrder)
          .map((category) => {
            const isSub = !!category.parentSlug;
            const parent = isSub ? categories.find(c => c.slug === category.parentSlug) : null;
            return (
              <CategoryCard key={category.id} style={isSub ? { marginLeft: '1.5rem', borderColor: '#d1ecf1' } : {}}>
                <CategoryHeader>
                  <CategoryName>
                    {isSub && <span style={{ color: '#00acc1', fontSize: '0.8rem', marginRight: '0.4rem' }}>↳</span>}
                    {category.name}
                  </CategoryName>
                  <CategoryActions>
                    <ActionButton onClick={() => handleOpenModal(category)}>
                      <FiEdit />
                    </ActionButton>
                    <ActionButton 
                      className="delete" 
                      onClick={() => handleDelete(category.id)}
                      title={hasLinkedProducts(category.slug) ? 'Є привʼязані товари' : 'Видалити категорію'}
                      style={hasLinkedProducts(category.slug) ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                      disabled={hasLinkedProducts(category.slug)}
                    >
                      <FiTrash2 />
                    </ActionButton>
                  </CategoryActions>
                </CategoryHeader>
                <CategoryDescription>{category.description}</CategoryDescription>
                <CategoryMeta>
                  <span>{isSub ? `Батьківська: ${parent?.name || '—'}` : 'Основна категорія'}</span>
                  <StatusBadge 
                    active={category.isActive}
                    onClick={() => handleToggleActive(category)}
                    title={category.isActive ? 'Нажмите чтобы скрыть категорію і всі товари' : 'Нажмите щоб показати категорію і всі товари'}
                  >
                    {category.isActive ? 'Активна' : 'Неактивна'}
                  </StatusBadge>
                </CategoryMeta>

                {hasLinkedProducts(category.slug) && (
                  <div style={{ marginTop: '1rem' }}>
                    <button
                      onClick={() => {
                        setSelectedCategoryForMove(category);
                        setIsMoveModalOpen(true);
                      }}
                      style={{
                        width: '100%',
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
                  </div>
                )}
              </CategoryCard>
            );
        })}
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Наприклад: Фруктові Чипси"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Slug (URL) {slugTouched ? '' : '(авто)'} </Label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="fruit-chips"
              />
              {!slugTouched && formData.name && (
                <p style={{ fontSize: '0.7rem', color: '#666', margin: '0.3rem 0 0' }}>
                  Значення генерується автоматично, змініть щоб зафіксувати.
                </p>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Опис</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

            <FormGroup>
              <Label>Батьківська категорія (залишити порожнім для основної)</Label>
              <select
                style={{ padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px' }}
                value={formData.parentSlug}
                onChange={(e) => setFormData(prev => ({ ...prev, parentSlug: e.target.value }))}
              >
                <option value=''>— основна категорія —</option>
                {categories
                  .filter(c => {
                    if (c.id === editingCategory?.id) return false;
                    return !c.parentSlug;
                  })
                  .map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: '#666', margin: '0.5rem 0 0' }}>
                Якщо вибрати значення — це буде підкатегорія.
              </p>
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

      {/* Модалка автозаповнення підкатегорій для існуючих товарів */}
      <Modal isOpen={isDistributeOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Автоматичний розклад товарів</ModalTitle>
            <CloseButton onClick={() => setIsDistributeOpen(false)}>
              <FiX />
            </CloseButton>
          </ModalHeader>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <Label>Батьківська категорія</Label>
              <select
                style={{ padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px', width: '100%' }}
                value={selectedParent}
                onChange={(e) => handleParentChange(e.target.value)}
              >
                <option value="">— оберіть категорію —</option>
                {categories.filter(c => !c.parentSlug).map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                Будуть враховані лише товари без підкатегорії у вибраній категорії.
              </p>
            </div>

            {selectedParent && (
              <div style={{ maxHeight: '50vh', overflowY: 'auto', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                {preview.length === 0 && (
                  <p style={{ color: '#999' }}>Підкатегорій не знайдено або немає збігів.</p>
                )}
                {preview.map(({ child, matches }) => (
                  <div key={child.slug} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem',
                    padding: '0.75rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    marginBottom: '0.75rem',
                    background: matches.length ? '#f9fff9' : '#fafafa'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="checkbox"
                          checked={!!selectionMap[child.slug]}
                          onChange={() => handleToggleChildSelection(child.slug)}
                        />
                        <strong>{child.name}</strong>
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>Знайдено: {matches.length}</span>
                    </div>
                    {matches.length > 0 && (
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>
                        Приклади: {matches.slice(0, 3).map(m => m.name).join(', ')}{matches.length > 3 ? '…' : ''}
                      </div>
                    )}
                    <div>
                      <Label>Ключові слова (через кому)</Label>
                      <Input
                        type="text"
                        placeholder="наприклад: полуниця, strawberry"
                        value={customKeywords[child.slug] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomKeywords(prev => ({ ...prev, [child.slug]: val }));
                        }}
                        onBlur={() => {
                          // Перераховуємо превʼю після зміни ключів
                          if (selectedParent) recomputePreview(selectedParent);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ButtonGroup>
              <Button type="button" onClick={() => setIsDistributeOpen(false)}>Скасувати</Button>
              <Button type="button" variant="primary" onClick={handleApplyDistribution}>
                Застосувати
              </Button>
            </ButtonGroup>
            <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#666' }}>
              Порада: додайте кілька синонімів для кожної підкатегорії та оновіть превʼю.
            </div>

            <div style={{ borderTop: '1px dashed #e0e0e0', marginTop: '1rem', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>Міграція старої схеми</strong>
                <Button type="button" onClick={migrateLegacyScheme}>Запустити</Button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                Якщо раніше товари зберігались з category, рівним slug підкатегорії, цей інструмент перенесе їх у батьківську категорію
                та виставить subcategory = старий slug.
              </div>
            </div>
          </div>
        </ModalContent>
      </Modal>

      <MoveProductsModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        products={products}
        categories={categories}
        sourceCategory={selectedCategoryForMove}
        onMove={handleMoveProducts}
      />
    </CategoryManagerContainer>
  );
};

export default CategoryManager;
