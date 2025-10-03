import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../contexts/AdminContext';
// import { Product } from '../types'; // Отключено для избежания неиспользуемого импорта

const ProductsContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;
  background-image: url('/фон второй .jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(77, 208, 225, 0.8) 0%, rgba(38, 198, 218, 0.8) 50%, rgba(0, 172, 193, 0.8) 100%);
    z-index: 1;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  background: white;
  border-radius: 20px;
  margin-top: -2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const SearchAndFilters = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  flex: 1;
  position: relative;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
  }
`;

const SearchField = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
  font-size: 1.2rem;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.isActive ? '#667eea' : '#e9ecef'};
  border-radius: 25px;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: white;
  }
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const CategoryButton = styled.button<{ isActive: boolean }>`
  padding: 0.8rem 1.5rem;
  border: 2px solid ${props => props.isActive ? '#667eea' : '#e9ecef'};
  border-radius: 25px;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    background: white;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const NoProducts = styled.div`
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

const ClearFilters = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c0392b;
  }
`;

const categories = [
  { id: 'all', name: 'Все товары' },
  { id: 'chips', name: 'Фруктовые чипсы' },
  { id: 'decorations', name: 'Украшения' },
  { id: 'syrups', name: 'Сиропы' },
  { id: 'purees', name: 'Пюре' },
  { id: 'dried_flowers', name: 'Сухоцветы' }
];

const Products: React.FC = () => {
  const { products } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesOrganic = !showOrganicOnly || product.organic;

      return matchesSearch && matchesCategory && matchesOrganic;
    });
  }, [products, searchTerm, selectedCategory, showOrganicOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setShowOrganicOnly(false);
  };

  return (
    <ProductsContainer>
      <Header>
        <div className="container">
          <Title>Наши товары</Title>
          <Subtitle>
            Откройте для себя мир органических фруктовых чипсов и украшений для коктейлей
          </Subtitle>
        </div>
      </Header>

      <FiltersSection>
        <SearchAndFilters>
          <SearchInput>
            <SearchIcon />
            <SearchField
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>

          <FilterButton
            isActive={showOrganicOnly}
            onClick={() => setShowOrganicOnly(!showOrganicOnly)}
          >
            <FiFilter />
            Только органические
          </FilterButton>

          {(searchTerm || selectedCategory !== 'all' || showOrganicOnly) && (
            <ClearFilters onClick={clearFilters}>
              <FiX />
              Очистить фильтры
            </ClearFilters>
          )}
        </SearchAndFilters>

        <CategoryFilters>
          {categories.map(category => (
            <CategoryButton
              key={category.id}
              isActive={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </CategoryButton>
          ))}
        </CategoryFilters>

        {filteredProducts.length === 0 ? (
          <NoProducts>
            <h3>Товары не найдены</h3>
            <p>Попробуйте изменить параметры поиска или фильтры</p>
          </NoProducts>
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </ProductsGrid>
        )}
      </FiltersSection>
    </ProductsContainer>
  );
};

export default Products;
