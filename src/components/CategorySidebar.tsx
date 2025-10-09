import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGrid, FiTag } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  icon?: string;
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
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
`;

const SidebarContainer = styled(motion.div)`
  width: 320px;
  height: 100vh;
  background: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #667eea;
  color: white;
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
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
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
  border: 2px solid ${props => props.isActive ? '#667eea' : '#e9ecef'};
  border-radius: 12px;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#495057'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;

  &:hover {
    border-color: #667eea;
    background: ${props => props.isActive ? '#667eea' : '#f8f9fa'};
    transform: translateX(4px);
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
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const categories = [
  { id: 'all', name: 'Всі товари', icon: '🏠' },
  { id: 'chips', name: 'Фруктові чіпси', icon: '🍎' },
  { id: 'decorations', name: 'Прикраси', icon: '✨' },
  { id: 'syrups', name: 'Сиропи', icon: '🍯' },
  { id: 'purees', name: 'Пюре', icon: '🥄' },
  { id: 'dried_flowers', name: 'Сухоцвіти', icon: '🌸' }
];

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  isOpen,
  onClose,
  categories: propCategories = categories,
  selectedCategory,
  onCategorySelect
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    onCategorySelect('all');
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
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
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
              {propCategories.map((category, index) => (
                <CategoryItem
                  key={category.id}
                  isActive={selectedCategory === category.id}
                  onClick={() => onCategorySelect(category.id)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CategoryIcon>
                    {category.icon || <FiTag />}
                  </CategoryIcon>
                  <CategoryName>{category.name}</CategoryName>
                </CategoryItem>
              ))}
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
