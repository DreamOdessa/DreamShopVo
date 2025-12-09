import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Product, Category } from '../types';
import { FiX, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

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
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  font-size: 1.3rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;

  &:hover {
    color: #333;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductSelectionArea = styled.div`
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  max-height: 250px;
  overflow-y: auto;
`;

const ProductItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f7ff;
    border-color: #4dd0e1;
  }

  input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const ProductName = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
`;

const ProductCategory = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

const CategorySelectionArea = styled.div`
  background: #f8f9fa;
  border: 2px dashed #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;

const CategorySelect = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const SelectInput = styled.select`
  padding: 0.75rem;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4dd0e1;
    box-shadow: 0 0 8px rgba(77, 208, 225, 0.2);
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
`;

const Arrow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4dd0e1;
  font-weight: 600;
  font-size: 1.1rem;
`;

const Summary = styled.div`
  background: #f0f7ff;
  border: 2px solid #b3e5fc;
  border-radius: 8px;
  padding: 1rem;
  margin: 1.5rem 0;
  font-size: 0.95rem;
`;

const SummaryItem = styled.div`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;

  strong {
    color: #4dd0e1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(77, 208, 225, 0.3);
        }
        
        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #999;
`;

interface MoveProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  sourceCategory: Category | null;
  onMove: (productIds: string[], targetCategory: string, targetSubcategory: string) => Promise<void>;
  isForSpicer?: boolean;
}

const MoveProductsModal: React.FC<MoveProductsModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  sourceCategory,
  onMove,
  isForSpicer = false
}) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [targetCategory, setTargetCategory] = useState<string>('');
  const [targetSubcategory, setTargetSubcategory] = useState<string>('');
  const [isMoving, setIsMoving] = useState(false);

  // Фильтруем товары, которые можно перемещать из текущей категории
  const availableProducts = useMemo(() => {
    if (!sourceCategory) return [];
    
    const filtered = products.filter(p => {
      if (isForSpicer) {
        return (p.brand === 'spicer' || p.isSpicer) && 
               p.category === sourceCategory.slug;
      } else {
        return p.category === sourceCategory.slug;
      }
    });
    
    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  }, [products, sourceCategory, isForSpicer]);

  // Фильтруем доступные категории для перемещения
  const availableCategories = useMemo(() => {
    // Показываем ВСЕ категории (корневые и підкатегорії) незалежно від сторінки
    const filtered = categories || [];
    // Исключаем текущую категорию (если задана)
    return filtered.filter(c => c.id !== sourceCategory?.id);
  }, [categories, sourceCategory]);

  // Подкатегории для выбранной целевой категории
  const targetSubcategories = useMemo(() => {
    if (!targetCategory) return [];
    return (categories || [])
      .filter(c => c.parentSlug === targetCategory)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [targetCategory, categories]);

  const handleSelectProduct = (productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked 
        ? [...prev, productId]
        : prev.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedProducts(checked ? availableProducts.map(p => p.id) : []);
  };

  const handleMove = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Виберіть товари для переміщення');
      return;
    }

    if (!targetCategory) {
      toast.error('Виберіть цільову категорію');
      return;
    }

    setIsMoving(true);
    try {
      await onMove(selectedProducts, targetCategory, targetSubcategory);
      toast.success(`✅ ${selectedProducts.length} товарів перенесено`);
      handleClose();
    } catch (error) {
      console.error('Помилка переміщення товарів:', error);
      toast.error('❌ Помилка переміщення товарів');
    } finally {
      setIsMoving(false);
    }
  };

  const handleClose = () => {
    setSelectedProducts([]);
    setTargetCategory('');
    setTargetSubcategory('');
    onClose();
  };

  const targetCategoryName = availableCategories.find(c => c.slug === targetCategory)?.name;
  const targetSubcategoryName = targetSubcategories.find(c => c.slug === targetSubcategory)?.name;

  if (!isOpen || !sourceCategory) return null;

  return (
    <Modal isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            ➡️ Переміщення товарів між категоріями
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {availableProducts.length === 0 ? (
          <EmptyState>
            <p>У категорії "{sourceCategory.name}" немає товарів для переміщення.</p>
          </EmptyState>
        ) : (
          <>
            <Section>
              <SectionTitle>
                📦 Вихідна категорія: <strong>{sourceCategory.name}</strong>
              </SectionTitle>
            </Section>

            <Section>
              <SectionTitle>
                <FiCheckCircle size={18} />
                Виберіть товари ({selectedProducts.length}/{availableProducts.length})
              </SectionTitle>
              
              <ProductSelectionArea>
                <ProductItem>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === availableProducts.length && availableProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <strong style={{ color: '#4dd0e1' }}>Вибрати всі</strong>
                </ProductItem>

                {availableProducts.map(product => (
                  <ProductItem key={product.id}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductCategory>
                        {product.subcategory ? `${product.subcategory}` : 'Без підкатегорії'}
                      </ProductCategory>
                    </ProductInfo>
                  </ProductItem>
                ))}
              </ProductSelectionArea>
            </Section>

            <ArrowContainer>
              <Arrow>
                <FiArrowRight />
                переміщення
              </Arrow>
            </ArrowContainer>

            <Section>
              <SectionTitle>
                🎯 Виберіть цільову категорію
              </SectionTitle>

              <CategorySelectionArea>
                <CategorySelect>
                  <Label>Категорія</Label>
                  <SelectInput
                    value={targetCategory}
                    onChange={(e) => {
                      setTargetCategory(e.target.value);
                      setTargetSubcategory('');
                    }}
                  >
                    <option value="">— оберіть категорію —</option>
                    {availableCategories
                      .filter(c => !c.parentSlug || c.parentSlug === 'spicer-root')
                      .map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                  </SelectInput>
                </CategorySelect>

                {targetCategory && targetSubcategories.length > 0 && (
                  <CategorySelect>
                    <Label>Підкатегорія (опціонально)</Label>
                    <SelectInput
                      value={targetSubcategory}
                      onChange={(e) => setTargetSubcategory(e.target.value)}
                    >
                      <option value="">— без підкатегорії —</option>
                      {targetSubcategories.map(c => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </SelectInput>
                  </CategorySelect>
                )}
              </CategorySelectionArea>
            </Section>

            {selectedProducts.length > 0 && targetCategory && (
              <Summary>
                <SummaryItem>
                  <span>📦 Товарів на переміщення:</span>
                  <strong>{selectedProducts.length}</strong>
                </SummaryItem>
                <SummaryItem>
                  <span>🎯 Цільова категорія:</span>
                  <strong>{targetCategoryName}</strong>
                </SummaryItem>
                {targetSubcategoryName && (
                  <SummaryItem>
                    <span>├─ Підкатегорія:</span>
                    <strong>{targetSubcategoryName}</strong>
                  </SummaryItem>
                )}
              </Summary>
            )}

            <ButtonGroup>
              <Button onClick={handleClose}>
                Скасувати
              </Button>
              <Button
                variant="primary"
                onClick={handleMove}
                disabled={selectedProducts.length === 0 || !targetCategory || isMoving}
              >
                {isMoving ? 'Переміщення...' : '➡️ Перемістити'}
              </Button>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MoveProductsModal;
