import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGrid, FiTag, FiChevronRight, FiRefreshCw } from 'react-icons/fi';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  isActive: boolean;
  sortOrder: number;
  parentSlug?: string;
}

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

/* ── Оверлей (framer-motion, тот же z-index что раньше) ── */
const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 32, 0.48);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;   /* панель выезжает справа */
`;

/* ── Основная панель — единый стиль с бургер-меню ── */
const SidebarContainer = styled(motion.div)`
  width: 340px;
  max-width: 92vw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  /* Тот же градиент что у бургер-дравера */
  background: linear-gradient(
    175deg,
    rgba(5, 82, 102, 0.99)  0%,
    rgba(14, 115, 138, 0.98) 22%,
    rgba(24, 145, 168, 0.97) 48%,
    rgba(38, 168, 190, 0.96) 72%,
    rgba(62, 198, 218, 0.95) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-left: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: -10px 0 60px rgba(0, 0, 0, 0.35), inset 1px 0 0 rgba(255,255,255,0.12);

  /* Декоративный световой блик */
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
`;

/* ── Шапка — единый стиль с DrawerHeader из бургера ── */
const DrawerHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0px) + 1.1rem) 1.25rem 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const DrawerTitle = styled.h2`
  font-size: 1.12rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.04em;

  svg { font-size: 1.1rem; opacity: 0.9; }
`;

/* ── Кнопка закрыть — круглая, поворачивается на 90° при hover ── */
const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    color: white;
    border-color: rgba(255, 255, 255, 0.38);
    transform: scale(1.1) rotate(90deg);
  }
`;

/* ── Список категорий ── */
const CategoriesList = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 1rem;
  position: relative;
  z-index: 1;

  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.22) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
`;

/* ── Кнопка категории — как NavLink в бургере, с акцентной полоской ── */
const CategoryItem = styled(motion.button)<{ isActive: boolean }>`
  width: 100%;
  padding: 0.92rem 1.1rem 0.92rem 1.25rem;
  margin-bottom: 0.4rem;
  border: 1px solid ${p => (p.isActive ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.1)')};
  border-radius: 14px;
  background: ${p => (p.isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)')};
  color: ${p => (p.isActive ? '#ffffff' : 'rgba(255,255,255,0.82)')};
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.22s ease, border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease, color 0.22s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  position: relative;
  overflow: hidden;
  box-shadow: ${p => (p.isActive ? '0 4px 16px rgba(0,0,0,0.12)' : 'none')};

  /* Акцентная вертикальная полоска слева */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%) ${p => (p.isActive ? 'scaleY(1)' : 'scaleY(0)')};
    width: 3px;
    height: 55%;
    background: rgba(255, 255, 255, 0.88);
    border-radius: 0 3px 3px 0;
    transition: transform 0.22s ease;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.36);
    background: rgba(255, 255, 255, 0.15);
    color: #ffffff;
    transform: translateX(4px);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.14);

    &::before { transform: translateY(-50%) scaleY(1); }
  }

  /* Блик при наведении */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    transition: left 0.45s ease;
  }
  &:hover::after { left: 100%; }
`;

const CategoryIcon = styled.div`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
`;

const CategoryName = styled.span`
  font-size: 1rem;
  flex: 1;
  line-height: 1.3;
`;

const ChevronIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.7;
  flex-shrink: 0;
`;

/* ── Подкатегория ── */
const SubcategoryItem = styled(motion.div)<{ isActive: boolean }>`
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  margin: 0 0 0.25rem 0.5rem;
  cursor: pointer;
  transition: all 0.22s ease;
  border-left: 2px solid ${p => (p.isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)')};
  border-radius: 0 10px 10px 0;
  background: ${p =>
    p.isActive
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(255,255,255,0.03)'};
  color: ${p => (p.isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.68)')};
  font-size: 0.9rem;
  font-weight: ${p => (p.isActive ? 600 : 400)};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;

  /* Маленькая стрелочка */
  &::before {
    content: '›';
    position: absolute;
    left: 1.1rem;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.4);
    line-height: 1;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-left-color: rgba(255, 255, 255, 0.55);
    color: rgba(255, 255, 255, 0.95);
    padding-left: 3rem;
  }
`;

/* ── Футер — единый стиль ── */
const DrawerFoot = styled.div`
  flex-shrink: 0;
  padding: 0.9rem 1rem calc(env(safe-area-inset-bottom, 0px) + 1rem);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const ClearButton = styled.button`
  width: 100%;
  padding: 0.82rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(231, 76, 60, 0.14);
  color: rgba(255, 200, 195, 0.9);
  border: 1px solid rgba(231, 76, 60, 0.28);
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  letter-spacing: 0.01em;

  svg { font-size: 0.95rem; transition: transform 0.3s ease; }

  &:hover {
    background: rgba(231, 76, 60, 0.26);
    border-color: rgba(231, 76, 60, 0.48);
    color: #ffb3ae;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(231, 76, 60, 0.18);

    svg { transform: rotate(180deg); }
  }

  &:active { transform: translateY(0); }
`;

/* ════════════════════════════════════════ */
const CategorySidebar: React.FC<CategorySidebarProps> = ({
  isOpen,
  onClose,
  categories: propCategories = [],
  selectedCategory,
  onCategorySelect,
}) => {
  const { parentCategories, subcategoriesMap } = useMemo(() => {
    const parents: Category[] = [];
    const subMap: { [key: string]: Category[] } = {};

    (propCategories || []).forEach(cat => {
      if (!cat.parentSlug) {
        parents.push(cat);
      } else {
        if (!subMap[cat.parentSlug]) subMap[cat.parentSlug] = [];
        subMap[cat.parentSlug].push(cat);
      }
    });

    parents.sort((a, b) => a.sortOrder - b.sortOrder);
    Object.keys(subMap).forEach(key => {
      subMap[key].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    return { parentCategories: parents, subcategoriesMap: subMap };
  }, [propCategories]);

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [lastClickTime, setLastClickTime] = useState<{ [key: string]: number }>({});
  const [startX, setStartX]     = useState<number>(0);
  const [currentX, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleClearFilters = () => onCategorySelect('all');

  const handleCategoryClick = (category: Category) => {
    const now = Date.now();
    const lastClick = lastClickTime[category.id] || 0;
    const isDoubleClick = now - lastClick < 300;

    if (isDoubleClick) {
      onCategorySelect(category.id);
      setLastClickTime({});
    } else {
      const subcategories = subcategoriesMap[category.slug] || [];
      if (subcategories.length > 0) {
        setExpandedCategories(prev => {
          const s = new Set(prev);
          s.has(category.id) ? s.delete(category.id) : s.add(category.id);
          return s;
        });
      } else {
        onCategorySelect(category.id);
      }
      setLastClickTime({ ...lastClickTime, [category.id]: now });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const delta = e.touches[0].clientX - startX;
    if (delta > 0) setCurrentX(Math.min(delta, 340));
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (currentX > 100) onClose();
    setCurrentX(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={handleOverlayClick}
        >
          <SidebarContainer
            initial={{ x: 340 }}
            animate={{ x: isDragging ? currentX : 0 }}
            exit={{ x: 340 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Шапка */}
            <DrawerHead>
              <DrawerTitle>
                <FiGrid />
                Категорії
              </DrawerTitle>
              <CloseButton onClick={onClose} aria-label="Закрити">
                <FiX />
              </CloseButton>
            </DrawerHead>

            {/* Список категорий */}
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
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      whileTap={{ scale: 0.97 }}
                      title={
                        hasSubcategories
                          ? 'Клік — розгорнути, подвійний — відкрити всі товари'
                          : 'Відкрити категорію'
                      }
                    >
                      <CategoryIcon>
                        {category.icon || <FiTag />}
                      </CategoryIcon>
                      <CategoryName>{category.name}</CategoryName>
                      {hasSubcategories && (
                        <ChevronIcon
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <FiChevronRight />
                        </ChevronIcon>
                      )}
                    </CategoryItem>

                    {/* Подкатегории */}
                    <AnimatePresence>
                      {isExpanded &&
                        subcategories.map((subcat: Category, subIndex: number) => (
                          <SubcategoryItem
                            key={subcat.id}
                            isActive={selectedCategory === subcat.id}
                            onClick={() => onCategorySelect(subcat.id)}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                              duration: 0.22,
                              delay: subIndex * 0.03,
                              ease: 'easeOut',
                            }}
                            whileHover={{ x: 4 }}
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

            {/* Футер */}
            <DrawerFoot>
              <ClearButton onClick={handleClearFilters}>
                <FiRefreshCw />
                Очистити фільтри
              </ClearButton>
            </DrawerFoot>
          </SidebarContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default CategorySidebar;
