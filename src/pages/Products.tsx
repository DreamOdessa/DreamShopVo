import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import CategorySidebar from '../components/CategorySidebar';
import { useAdmin } from '../contexts/AdminContext';
import { useCategorySidebar } from '../contexts/CategorySidebarContext';
// import { Product } from '../types'; // Отключено для избежания неиспользуемого импорта

const ProductsContainer = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: #1f4b5fff;
  padding: clamp(4rem, 10vw, 7rem) 0;
  text-align: center;
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-second.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  position: relative;
  margin-top: clamp(-4rem, -9vw, -7rem);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(77, 208, 225, 0.14) 0%, rgba(38, 197, 218, 0.44) 50%, rgba(0, 171, 193, 0.57) 100%);
    z-index: 1;
  }
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 4.5vw, 3rem);
  font-weight: 700;
  margin-bottom: clamp(0.5rem, 1.5vw, 1rem);
  position: relative;
  z-index: 2;
`;

const Subtitle = styled.p`
  font-size: clamp(0.875rem, 2vw, 1.2rem);
  opacity: 0.9;
  max-width: 37.5rem;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const FiltersSection = styled.div`
  max-width: 75rem;
  width: 100%;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem) clamp(0.75rem, 2.5vw, 1.5rem);
  background: white;
  border-radius: clamp(1rem, 2.5vw, 1.5rem);
  margin-top: clamp(-1rem, -2.5vw, -2rem);
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

const CategoryDropdown = styled.div`
  position: relative;
  margin-bottom: 2rem;
  max-width: 300px;
`;

const DropdownButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.isOpen ? '#667eea' : '#e9ecef'};
  border-radius: 25px;
  background: white;
  color: #495057;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: #667eea;
    color: #667eea;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const DropdownList = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
  display: ${props => props.isOpen ? 'block' : 'none'};
  margin-top: 0.5rem;
`;

const DropdownItem = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background: ${props => props.isActive ? '#667eea' : 'white'};
  color: ${props => props.isActive ? 'white' : '#495057'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background: ${props => props.isActive ? '#667eea' : '#f8f9fa'};
    color: ${props => props.isActive ? 'white' : '#667eea'};
  }

  &:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

// --- ИЗМЕНЕНИЯ ЗДЕСЬ (ProductsGrid) ---
const ProductsGrid = styled.div`
  display: flex; /* ИЗМЕНЕНО: было 'grid' */
  flex-wrap: wrap; /* ДОБАВЛЕНО: разрешаем перенос карточек */
  
  /* ДОБАВЛЕНО: Вот магия. 
    Центрируем карточки по горизонтали.
    Это заставит последнюю строку (с 1 карточкой) стать по центру.
  */
  justify-content: center; 
  
  gap: clamp(0.5rem, 2vw, 1.5rem);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2.5vw, 1.25rem);

  /* УДАЛЕНО: 'grid-template-columns', так как это больше не грид */
`;

// --- ДОБАВЛЕН НОВЫЙ КОМПОНЕНТ (ProductWrapper) ---
// Эта "обертка" теперь будет управлять размерами карточек,
// раз ProductsGrid (как flex) этим больше не занимается.
const ProductWrapper = styled(motion.div)`
  /* Это "жидкая" ширина:
    - flex-grow: 1 (растягиваться, чтобы заполнить ряд)
    - flex-shrink: 1 (сжиматься, если нужно)
    - flex-basis: clamp(...) (базовый "жидкий" размер)
  */
  flex: 1 1 clamp(150px, 30vw, 220px);
  
  /* Ограничитель, чтобы 1 или 2 карточки на планшете
    не растягивались СЛИШКОМ сильно.
    Можете поиграться с этим значением.
  */
  max-width: 350px; 
  
  /* Это нужно, чтобы ссылка (Link) внутри обертки 
    растягивалась на 100% высоты, передавая ее ProductCard
  */
  & > a {
    height: 100%;
    display: block;
  }
`;
// --- КОНЕЦ ИЗМЕНЕНИЙ ---


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

const SubcategoriesSection = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
`;

const SubcategoriesLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubcategoriesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const SubcategoryToggle = styled.button<{ isActive: boolean }>`
  padding: 0.6rem 1.2rem;
  border: 2px solid ${props => props.isActive ? '#00acc1' : '#e9ecef'};
  border-radius: 20px;
  background: ${props => props.isActive ? '#00acc1' : 'white'};
  color: ${props => props.isActive ? 'white' : '#6c757d'};
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    border-color: #00acc1;
    background: ${props => props.isActive ? '#0097a7' : '#e8f8f9'};
    color: ${props => props.isActive ? 'white' : '#00acc1'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 172, 193, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Products: React.FC = () => {
  const { products, categories } = useAdmin();
  const { closeSidebar, isOpen: isCategorySidebarOpen } = useCategorySidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null); // Новое состояние для подкатегории
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSubcategoryClickTime, setLastSubcategoryClickTime] = useState<{ [key: string]: number }>({});

  // Фильтруем только активные категории (родительские) и сортируем их
  // Исключаем категорию Spicer - она показывается только на витрине
  const activeParentCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .filter(cat => {
        if (!cat || cat.isActive === false || cat.parentSlug) return false;
        // Исключаем категорию Spicer по slug, id или имени
        const isSpicer = cat.slug === 'spicer' || 
                        cat.id === 'spicer' || 
                        cat.name?.toLowerCase().includes('spicer') ||
                        cat.slug?.toLowerCase().includes('spicer');
        return !isSpicer;
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [categories]);

  // Получаем все категории и подкатегории (для фильтрации и отображения)
  const allActiveCategories = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .filter(cat => cat && cat.isActive !== false)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [categories]);

  // Получаем подкатегории для выбранной родительской категории
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    
    const category = allActiveCategories?.find(cat => cat.id === selectedCategory);
    if (!category || category.parentSlug) return []; // Если это подкатегория, не показываем подкатегории

    return allActiveCategories.filter(cat => cat.parentSlug === category.slug);
  }, [selectedCategory, allActiveCategories]);

  // Читаем параметр category из URL при загрузке страницы
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return products.filter(product => {
      if (!product) return false;
      
      // Исключаем товары Spicer из страницы Products (они показываются только на витрине и на странице /spicer-products)
      if (product.brand === 'spicer') return false;
      
      // Проверка активности товара
      const isActive = product.isActive !== false;
      if (!isActive) return false;

      // Проверка поискового запроса
      const matchesSearch = !searchTerm || (
        (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (!matchesSearch) return false;

      // Проверка категории и подкатегории
      if (selectedCategory !== 'all') {
        const category = allActiveCategories?.find(cat => cat.id === selectedCategory);
        if (!category) {
          return false;
        }

        // Если выбрана родительская категория (без parentSlug)
        if (!category.parentSlug) {
          // Проверяем соответствие категории
          if (product.category !== category.slug) {
            return false;
          }

          // Если выбрана подкатегория - фильтруем по ней
          if (selectedSubcategory) {
            if (product.subcategory !== selectedSubcategory) {
              return false;
            }
          }
        } else {
          // Если выбрана подкатегория из dropdown - показываем только товары с этой подкатегорией
          const parentCategory = allActiveCategories?.find(cat => cat.slug === category.parentSlug);
          if (!parentCategory || product.category !== parentCategory.slug || product.subcategory !== category.name) {
            return false;
          }
        }
      }

      // Проверка органик-фильтра
      if (showOrganicOnly && !product.organic) {
        return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedCategory, selectedSubcategory, showOrganicOnly, allActiveCategories]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedSubcategory(null);
    setShowOrganicOnly(false);
    setIsDropdownOpen(false);
    // Очищаем URL от параметров фильтрации
    setSearchParams({});
  };

  const handleSubcategoryClick = (subcategoryName: string) => {
    const now = Date.now();
    const lastClick = lastSubcategoryClickTime[subcategoryName] || 0;
    const isDoubleClick = now - lastClick < 300; // 300ms для двойного клика

    if (isDoubleClick) {
      // Двойной клик - отключаем фильтр подкатегории
      setSelectedSubcategory(null);
      setLastSubcategoryClickTime({});
    } else {
      // Одиночный клик - включаем/переключаем фильтр
      setSelectedSubcategory(selectedSubcategory === subcategoryName ? null : subcategoryName);
      setLastSubcategoryClickTime({ ...lastSubcategoryClickTime, [subcategoryName]: now });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Сбрасываем выбранную подкатегорию при смене категории
    setIsDropdownOpen(false);
    
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  // Закрытие выпадающего списка при клике вне его
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <>
      <ProductsContainer>
      <Header>
        <div className="container">
          <Title>Наші товари</Title>
          <Subtitle>
            Відкрийте для себе світ органічних фруктових чіпсів та прикрас для коктейлів
          </Subtitle>
        </div>
      </Header>

      <FiltersSection>
        <SearchAndFilters>
          <SearchInput>
            <SearchIcon />
            <SearchField
              type="text"
              placeholder="Пошук товарів..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInput>

          <FilterButton
            isActive={showOrganicOnly}
            onClick={() => setShowOrganicOnly(!showOrganicOnly)}
          >
            <FiFilter />
            Тільки органічні
          </FilterButton>

          {(searchTerm || selectedCategory !== 'all' || selectedSubcategory || showOrganicOnly) && (
            <ClearFilters onClick={clearFilters}>
              <FiX />
              Очистити фільтри
            </ClearFilters>
          )}
        </SearchAndFilters>

        <CategoryDropdown data-dropdown>
          <DropdownButton 
            isOpen={isDropdownOpen}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedCategory === 'all' 
              ? 'Всі товари' 
              : allActiveCategories?.find(cat => cat.id === selectedCategory)?.name || 'Всі товари'}
            <FiChevronDown style={{ 
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }} />
          </DropdownButton>
          
          <DropdownList isOpen={isDropdownOpen}>
            <DropdownItem
              key="all"
              isActive={selectedCategory === 'all'}
              onClick={() => handleCategoryChange('all')}
            >
              Всі товари
            </DropdownItem>
            {activeParentCategories.map(category => (
              <DropdownItem
                key={category.id}
                isActive={selectedCategory === category.id}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </DropdownItem>
            ))}
          </DropdownList>
        </CategoryDropdown>

        {/* Горизонтальные кнопки подкатегорий */}
        {availableSubcategories.length > 0 && (
          <SubcategoriesSection>
            <SubcategoriesLabel>
              <FiFilter size={16} />
              Підкатегорії (подвійний клік для скидання):
            </SubcategoriesLabel>
            <SubcategoriesRow>
              {availableSubcategories.map(subcat => (
                <SubcategoryToggle
                  key={subcat.id}
                  isActive={selectedSubcategory === subcat.name}
                  onClick={() => handleSubcategoryClick(subcat.name)}
                  title="Клік - вибрати, подвійний клік - скинути"
                >
                  {subcat.name}
                </SubcategoryToggle>
              ))}
            </SubcategoriesRow>
          </SubcategoriesSection>
        )}

        {filteredProducts.length === 0 ? (
          <NoProducts>
            <h3>Товари не знайдено</h3>
            <p>Спробуйте змінити параметри пошуку або фільтри</p>
          </NoProducts>
        ) : (
          <ProductsGrid>
            {filteredProducts.map((product, index) => (
              // --- ИЗМЕНЕНИЕ ЗДЕСЬ ---
              // Обернули <ProductCard> в <ProductWrapper>
              <ProductWrapper
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </ProductWrapper>
              // --- КОНЕЦ ИЗМЕНЕНИЯ ---
            ))}
          </ProductsGrid>
        )}
      </FiltersSection>
      </ProductsContainer>

      {/* Боковая панель категорий */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={closeSidebar}
        categories={allActiveCategories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => {
          handleCategoryChange(categoryId);
          closeSidebar();
        }}
      />
    </>
  );
};

export default Products;