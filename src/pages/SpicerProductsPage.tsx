import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const SpicerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Фильтры
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVolume, setSelectedVolume] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
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
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
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
          <SpicerLogo>SPICER</SpicerLogo>
          <Tagline>Преміальні алкогольні напої</Tagline>
        </LogoSection>
      </Header>

      <MainContent>
        {/* Сайдбар с фильтрами */}
        <Sidebar>
          <FilterSection>
            <FilterTitle>Фільтри</FilterTitle>
            
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
                {categories.map(cat => (
                  <FilterItem
                    key={cat}
                    active={selectedCategory === cat}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat === 'all' ? 'Всі' : cat.charAt(0).toUpperCase() + cat.slice(1)}
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
              }}
            >
              Скинути фільтри
            </ResetButton>
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

const SpicerLogo = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 15px;
  background: linear-gradient(135deg, #474743ff 0%, #050505ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    letter-spacing: 8px;
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
  }
`;

const Sidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;
  
  @media (max-width: 968px) {
    width: 100%;
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
    position: static;
  }
`;

const FilterTitle = styled.h2`
  font-size: 1.8rem;
  color: #4d4e4eff;
  margin-bottom: 25px;
  font-weight: 700;
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
