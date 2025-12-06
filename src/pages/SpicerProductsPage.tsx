import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFilter, FiX } from 'react-icons/fi';

const SpicerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Загрузка товаров Spicer из Firebase
  useEffect(() => {
    loadSpicerProducts();
  }, []);

  // Обработка URL параметров
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Применение фильтров
  const applyFilters = React.useCallback(() => {
    let filtered = [...products];

    // Фильтр по категории (или подкатегории для Spicer)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => {
        // Проверяем сначала подкатегорию, потом категорию
        return (p.subcategory === selectedCategory) || (p.category === selectedCategory);
      });
    }

    // Фильтр по объему
    if (selectedVolume !== 'all') {
      filtered = filtered.filter(p => p.volume === selectedVolume);
    }

    // Фильтр по цене
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Поиск
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedVolume, priceRange, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadSpicerProducts = async () => {
    try {
      setLoading(true);
      
      // Запрос только товаров Spicer
      const q = query(
        collection(db, 'products'),
        where('brand', '==', 'spicer')
      );
      
      const querySnapshot = await getDocs(q);
      const loadedProducts: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const data: any = docSnap.data();
        loadedProducts.push({
          id: docSnap.id,
          name: data.name || data.title || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
          image: data.image || data.imageUrl || '',
          images: data.images || undefined,
          category: data.category || 'chips', // fallback чтобы удовлетворить тип
          subcategory: data.subcategory || undefined,
          organic: Boolean(data.organic) || false,
          inStock: data.inStock !== undefined ? Boolean(data.inStock) : true,
          isActive: data.isActive !== false,
          isPopular: Boolean(data.isPopular),
          weight: data.weight || undefined,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : undefined,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
          brand: data.brand || 'spicer',
          isSpicer: true,
          volume: data.volume || '',
          imageUrl: data.imageUrl || data.image || ''
        });
      });
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Ошибка загрузки товаров Spicer:', error);
    } finally {
      setLoading(false);
    }
  };

  // Получение уникальных значений для фильтров
  // Для Spicer товаров используем subcategory если есть, иначе category
  // Определяем 5 основных категорий
  const mainCategories = [
    { key: 'all', label: 'Всі' },
    { key: 'джин', label: 'Джин' },
    { key: 'лікер', label: 'Лікери' },
    { key: 'distill', label: 'Distill' },
    { key: 'спайсери', label: 'Спайсери' },
    { key: 'настоянки', label: 'Настоянки' }
  ];
  
  const volumes: string[] = ['all', ...Array.from(new Set(products.map(p => (p.volume || '')).filter(v => v)))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Обновление URL
    const params = new URLSearchParams(location.search);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    
    const newSearch = params.toString();
    navigate(`/spicer-products${newSearch ? '?' + newSearch : ''}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header>
        <LogoSection>
          <SpicerLogoImage 
            src="https://spicer.ua/wp-content/uploads/2022/10/logo-about.svg"
            alt="Spicer Logo"
          />
          <Tagline>Преміальні алкогольні напої</Tagline>
        </LogoSection>
      </Header>

      {/* Мобильная кнопка фильтров */}
      <MobileFilterButton onClick={() => setShowFilters(!showFilters)}>
        <FiFilter />
        Фільтри
        {(selectedCategory !== 'all' || selectedVolume !== 'all' || searchQuery) && (
          <ActiveFilterBadge>{
            [selectedCategory !== 'all', selectedVolume !== 'all', searchQuery].filter(Boolean).length
          }</ActiveFilterBadge>
        )}
      </MobileFilterButton>

      <MainContent>
        {/* Сайдбар с фильтрами */}
        <Sidebar $isOpen={showFilters}>
          <FilterSection>
            <FilterHeader>
              <FilterTitle>Фільтри</FilterTitle>
              <CloseButton onClick={() => setShowFilters(false)}>
                <FiX />
              </CloseButton>
            </FilterHeader>
            
            {/* Поиск */}
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="Пошук товарів..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchBox>

            {/* Категория */}
            <FilterGroup>
              <FilterLabel>Категорія</FilterLabel>
              <FilterList>
                {mainCategories.map(cat => (
                  <FilterItem
                    key={cat.key}
                    active={selectedCategory === cat.key}
                    onClick={() => handleCategoryChange(cat.key)}
                  >
                    {cat.label}
                  </FilterItem>
                ))}
              </FilterList>
            </FilterGroup>

            {/* Объем */}
            <FilterGroup>
              <FilterLabel>Об'єм</FilterLabel>
              <FilterList>
                {volumes.map(vol => (
                  <FilterItem
                    key={vol}
                    active={selectedVolume === vol}
                    onClick={() => setSelectedVolume(vol)}
                  >
                    {vol === 'all' ? 'Всі' : vol}
                  </FilterItem>
                ))}
              </FilterList>
            </FilterGroup>

            {/* Диапазон цен */}
            <FilterGroup>
              <FilterLabel>Ціна: {priceRange[0]} - {priceRange[1]} ₴</FilterLabel>
              <PriceRangeContainer>
                <PriceInput
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                />
                <PriceInput
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                />
              </PriceRangeContainer>
            </FilterGroup>

            {/* Кнопка сброса */}
            <ResetButton
              onClick={() => {
                setSelectedCategory('all');
                setSelectedVolume('all');
                setPriceRange([0, 5000]);
                setSearchQuery('');
                navigate('/spicer-products');
                setShowFilters(false);
              }}
            >
              Скинути фільтри
            </ResetButton>

            {/* Кнопка применить (только на мобильных) */}
            <ApplyButton onClick={() => setShowFilters(false)}>
              Застосувати фільтри
            </ApplyButton>
          </FilterSection>
        </Sidebar>

        {/* Сетка товаров */}
        <ProductsSection>
          <ResultsHeader>
            <ResultCount>
              Знайдено товарів: <span>{filteredProducts.length}</span>
            </ResultCount>
          </ResultsHeader>

          <ProductsGrid>
            {filteredProducts.length === 0 ? (
              <NoResults>
                Товари не знайдені. Спробуйте змінити фільтри.
              </NoResults>
            ) : (
              filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  disableLink={true}
                  disableHoverImage={true}
                />
              ))
            )}
          </ProductsGrid>
        </ProductsSection>
      </MainContent>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffffff 0%, #ffffffff 50%, #ffffffff 100%);
  padding-top: 80px;
`;

const Header = styled.header`
  padding: 60px 20px 40px;
  text-align: center;
  background: linear-gradient(180deg, rgba(250, 250, 250, 0.07) 0%, transparent 100%);
`;

const LogoSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SpicerLogoImage = styled.img`
  max-width: 300px;
  width: 100%;
  height: auto;
  margin: 0 auto 20px;
  display: block;
  
  @media (max-width: 768px) {
    max-width: 200px;
  }
`;

const Tagline = styled.p`
  font-size: 1.2rem;
  color: #535353ff;
  font-weight: 300;
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 40px;
  
  @media (max-width: 968px) {
    flex-direction: column;
    padding-top: 20px;
  }
`;

const MobileFilterButton = styled.button`
  display: none;
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #8ff8f8bb 0%, #12d9f3ff 100%);
    color: #000;
    border: none;
    border-radius: 50px;
    padding: 15px 25px;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(18, 217, 243, 0.4);
    cursor: pointer;
    z-index: 999;
    transition: all 0.3s;

    svg {
      font-size: 1.2rem;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

const ActiveFilterBadge = styled.span`
  background: #ff3b30;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 0.3s ease;
    overflow-y: auto;
    padding: 0;
  }
`;

const FilterSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  position: sticky;
  top: 100px;
  
  @media (max-width: 968px) {
    position: relative;
    background: white;
    border-radius: 20px 20px 0 0;
    margin: auto 0 0;
    min-height: 80vh;
    max-width: 500px;
    width: 90%;
    margin-left: auto;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const CloseButton = styled.button`
  display: none;
  
  @media (max-width: 968px) {
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.1);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    transition: all 0.3s;

    svg {
      font-size: 1.5rem;
      color: #333;
    }

    &:active {
      transform: scale(0.9);
      background: rgba(0, 0, 0, 0.2);
    }
  }
`;

const FilterTitle = styled.h2`
  font-size: 1.8rem;
  color: #4d4e4eff;
  margin-bottom: 0;
  font-weight: 700;
  
  @media (max-width: 968px) {
    margin-bottom: 0;
  }
`;

const SearchBox = styled.div`
  margin-bottom: 25px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #535151ff;
  font-size: 1rem;
  transition: all 0.3s;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.9);
  }
  
  &:focus {
    outline: none;
    border-color: #3feef4ff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 30px;
`;

const FilterLabel = styled.h3`
  font-size: 1.1rem;
  color: #5c5a5aff;
  margin-bottom: 15px;
  font-weight: 600;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterItem = styled.button<{ active: boolean }>`
  padding: 10px 15px;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #8ff8f8bb 0%, #12d9f3ff 100%)' 
    : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? '#000000' : '#000000ff'};
  border: 1px solid ${props => props.active ? '#a63eecb4' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #12d9f3ff 0%, #8ff8f8bb 100%)' 
      : 'rgba(255, 255, 255, 0.1)'};
    border-color: #a63eecb4;
  }
`;

const PriceRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PriceInput = styled.input`
  width: 100%;
  accent-color: #4f8684ff;
  cursor: pointer;
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 12px;
  background: rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 59, 48, 0.3);
    border-color: #ff3b30;
  }
`;

const ApplyButton = styled.button`
  display: none;
  
  @media (max-width: 968px) {
    display: block;
    width: 100%;
    padding: 15px;
    margin-top: 15px;
    background: linear-gradient(135deg, #8ff8f8bb 0%, #12d9f3ff 100%);
    color: #000;
    border: none;
    border-radius: 10px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.98);
    }
  }
`;

const ProductsSection = styled.section`
  flex: 1;
`;

const ResultsHeader = styled.div`
  margin-bottom: 30px;
`;

const ResultCount = styled.h2`
  font-size: 1.4rem;
  color: #747474ff;
  
  span {
    color: #0a6470ff;
    font-weight: 700;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NoResults = styled.div`
  grid-column: 1 / -1;
  padding: 80px 20px;
  text-align: center;
  font-size: 1.3rem;
  color: #888888;
`;

export default SpicerProductsPage;
