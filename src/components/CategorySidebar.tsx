import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGrid, FiTag, FiChevronDown, FiChevronRight } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  parentSlug?: string; // slug родительской категории (если это подкатегория)
}

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const SidebarContainer = styled(motion.div)`
  width: 320px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    -5px 0 30px rgba(0, 0, 0, 0.1),
    inset 1px 0 0 rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(77, 208, 225, 0.05) 0%, 
      rgba(38, 197, 218, 0.08) 50%, 
      rgba(0, 171, 193, 0.05) 100%);
    z-index: -1;
  }
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
`;

const Title = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.1);
  }
`;

const CategoriesList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const CategoryItem = styled(motion.button)<{ isActive: boolean }>`
  width: 100%;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  background: ${props => props.isActive 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px) translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const CategoryIcon = styled.div`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const CategoryName = styled.span`
  font-size: 1rem;
  flex: 1;
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: transform 0.3s ease;
`;

const SubcategoryItem = styled(motion.div)<{ isActive: boolean }>`
  padding: 0.9rem 1.2rem 0.9rem 3rem;
  margin: 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-left: 3px solid transparent;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  position: relative;
  background: ${props => props.isActive 
    ? 'linear-gradient(90deg, rgba(77, 208, 225, 0.15) 0%, rgba(38, 197, 218, 0.08) 100%)' 
    : 'rgba(255, 255, 255, 0.02)'};
  border-left-color: ${props => props.isActive ? '#4dd0e1' : 'transparent'};
  color: ${props => props.isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)'};
  font-size: 0.9rem;
  font-weight: ${props => props.isActive ? '600' : '400'};

  &::before {
    content: '↳';
    position: absolute;
    left: 1.5rem;
    color: rgba(77, 208, 225, 0.6);
    font-size: 1rem;
  }

  &:hover {
    background: linear-gradient(90deg, 
      rgba(77, 208, 225, 0.2) 0%, 
      rgba(38, 197, 218, 0.15) 100%);
    border-left-color: #4dd0e1;
    color: rgba(255, 255, 255, 0.95);
    padding-left: 3.2rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.08), 
      transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: rgba(231, 76, 60, 0.2);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(231, 76, 60, 0.3);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  &:hover {
    background: rgba(231, 76, 60, 0.3);
    border-color: rgba(231, 76, 60, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(231, 76, 60, 0.2);
  }
`;

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  isOpen,
  onClose,
  categories: propCategories = [],
  selectedCategory,
  onCategorySelect
}) => {
  // Разделяем на родительские категории и подкатегории
  const { parentCategories, subcategoriesMap } = useMemo(() => {
    const parents: Category[] = [];
    const subMap: { [key: string]: Category[] } = {};

    (propCategories || []).forEach(cat => {
      if (!cat.parentSlug) {
        parents.push(cat);
      } else {
        if (!subMap[cat.parentSlug]) {
          subMap[cat.parentSlug] = [];
        }
        subMap[cat.parentSlug].push(cat);
      }
    });

    // Сортируем родительские категории и подкатегории
    parents.sort((a, b) => a.sortOrder - b.sortOrder);
    Object.keys(subMap).forEach(key => {
      subMap[key].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return { parentCategories: parents, subcategoriesMap: subMap };
  }, [propCategories]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [lastClickTime, setLastClickTime] = useState<{ [key: string]: number }>({});
  const [startX, setStartX] = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    onCategorySelect('all');
  };

  const handleCategoryClick = (category: Category) => {
    const now = Date.now();
    const lastClick = lastClickTime[category.id] || 0;
    const isDoubleClick = now - lastClick < 300; // 300ms для двойного клика

    if (isDoubleClick) {
      // Двойной клик - открываем все товары категории
      onCategorySelect(category.id);
      setLastClickTime({});
    } else {
      // Одиночный клик - раскрываем/скрываем подкатегории
      const subcategories = subcategoriesMap[category.slug] || [];
      if (subcategories.length > 0) {
        setExpandedCategories(prev => {
          const newSet = new Set(prev);
          if (newSet.has(category.id)) {
            newSet.delete(category.id);
          } else {
            newSet.add(category.id);
          }
          return newSet;
        });
      } else {
        // Если нет подкатегорий - сразу открываем категорию
        onCategorySelect(category.id);
      }
      setLastClickTime({ ...lastClickTime, [category.id]: now });
    }
  };

  // Touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouchX = e.touches[0].clientX;
    const deltaX = currentTouchX - startX;
    
    // Only allow swiping to the right (closing)
    if (deltaX > 0) {
      setCurrentX(Math.min(deltaX, 320));
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    // If swiped more than 100px, close the sidebar
    if (currentX > 100) {
      onClose();
    }
    
    setCurrentX(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <SidebarContainer
            initial={{ x: 320 }}
            animate={{ x: isDragging ? currentX : 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Header>
              <Title>
                <FiGrid />
                Категорії товарів
              </Title>
              <CloseButton onClick={onClose}>
                <FiX />
              </CloseButton>
            </Header>

            <CategoriesList>
              {parentCategories.map((category: Category, index: number) => {
                const subcategories = subcategoriesMap[category.slug] || [];
                const isExpanded = expandedCategories.has(category.id);
                const hasSubcategories = subcategories.length > 0;

                return (
                  <React.Fragment key={category.id}>
                    <CategoryItem
                      isActive={selectedCategory === category.id}
                      onClick={() => handleCategoryClick(category)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      title={hasSubcategories ? 'Клик - раскрыть, двойной клик - открыть все товары' : 'Открыть категорию'}
                    >
                      <CategoryIcon>
                        {category.icon || <FiTag />}
                      </CategoryIcon>
                      <CategoryName>{category.name}</CategoryName>
                      {hasSubcategories && (
                        <ChevronIcon
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <FiChevronRight />
                        </ChevronIcon>
                      )}
                    </CategoryItem>

                    {/* Подкатегории */}
                    <AnimatePresence>
                      {isExpanded && subcategories.map((subcat: Category, subIndex: number) => (
                        <SubcategoryItem
                          key={subcat.id}
                          isActive={selectedCategory === subcat.id}
                          onClick={() => onCategorySelect(subcat.id)}
                          initial={{ opacity: 0, height: 0, x: -10 }}
                          animate={{ opacity: 1, height: 'auto', x: 0 }}
                          exit={{ opacity: 0, height: 0, x: -10 }}
                          transition={{ 
                            duration: 0.2, 
                            delay: subIndex * 0.03,
                            ease: 'easeOut'
                          }}
                          whileHover={{ scale: 1.01, x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <CategoryName>{subcat.name}</CategoryName>
                        </SubcategoryItem>
                      ))}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </CategoriesList>

            <Footer>
              <ClearButton onClick={handleClearFilters}>
                Очистити фільтри
              </ClearButton>
            </Footer>
          </SidebarContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CategorySidebar;
