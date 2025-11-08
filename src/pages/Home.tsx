import React from 'react';
// import { createPortal } from 'react-dom'; // УБРАЛИ createPortal
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import CategoryShowcase from '../components/CategoryShowcase';
import ProductCard from '../components/ProductCard';
// import CategoryCarousel from '../components/CategoryCarousel';
import { useAdmin } from '../contexts/AdminContext';

const HeroSection = styled.section`
  background: linear-gradient(135deg,rgba(77, 208, 225, 0.52) 0%,rgba(38, 197, 218, 0.51) 50%,rgba(0, 171, 193, 0.44) 100%);
  color: white;
  padding: 9rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-image: url('https://firebasestorage.googleapis.com/v0/b/dreamshop-odessa.firebasestorage.app/o/products%2Fhover%2Fbackground-first.png?alt=media&token=88566e3b-ec96-429e-9266-ab6909e82fa9');
  background-size: 100%;
  background-position: center;
  /* background-attachment: fixed; */ /* ОСТАВЛЯЕМ ВАШ КОД КАК БЫЛ - с параллаксом */
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-top: -6rem;

  /* overlay для затемнения боков (эффект тумана/вытягивания краёв) */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1; /* ниже контента, но выше фонового изображения */
    pointer-events: none;
    /* На больших экранах — сильнее затемнение по краям; на мобильных — чуть мягче */
    background: linear-gradient(
      to right,
      rgba(32, 58, 80, 0.55) 0%,
      rgba(26, 61, 80, 0.25) 12%,
      rgba(17, 43, 56, 0) 30%,
      rgba(30, 65, 82, 0) 70%,
      rgba(27, 70, 87, 0.25) 88%,
      rgba(20, 44, 58, 0.55) 100%
    );
  }

  @media (max-width: 768px) {
    padding: 6rem 0;
    min-height: 80vh;
    margin-top: -3.5rem;
    background-size: 200%;
  }

  @media (max-width: 480px) {
    padding: 5rem 0;
    min-height: 70vh;
    margin-top: -3rem;
    background-size: 200%;
  }

  @media (max-width: 360px) {
    padding: 4rem 0;
    min-height: 60vh;
    margin-top: -2.5rem;
    background-size: 200%;
  }

  /* Отключаем параллакс только для iOS устройств */
  @supports (-webkit-touch-callout: none) {
    background-attachment: scroll;
  }

  /* Убрали тяжелый оверлей, чтобы фон был виден */
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2; /* выше оверлея */
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 480px) {
    padding: 0 15px;
  }

  @media (max-width: 360px) {
    padding: 0 10px;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  /* Сделаем цвет текста более тёмным (темно-березовый) и добавим тень для читабельности */
  color: #1f4b5fff; /* темно-березовый оттенок */
  text-shadow: 0 6px 20px rgba(0,0,0,0.45);

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }

  @media (max-width: 360px) {
    font-size: 1.4rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
  /* Более тёмный цвет для лучшей читаемости на светлом/градиентном фоне */
  color: rgba(56, 71, 82, 0.95);
  text-shadow: 0 4px 12px rgba(0,0,0,0.35);

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }

  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
`;

// Анимация для стрелки
const fadeInOutMove = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(10px); }
`;


/* Стрелка прокрутки (ОБЫЧНЫЙ КОМПОНЕНТ, НЕ ФИКСИРОВАННЫЙ) */
const ScrollArrowContainer = styled.div`
  /* НЕТ position: fixed */
  position: relative; 
  cursor: pointer;
  z-index: 2;
  display: inline-flex; /* Чтобы была в потоке */
  align-items: center;
  justify-content: center;
  margin-top: 1.5rem; /* Отступ от субтитра */
  padding: 6px; 

  @media (min-width: 1024px) {
    /* bottom: 90px; */ /* Больше не нужно */
  }

  @media (max-width: 480px) {
    /* bottom: calc(env(safe-area-inset-bottom, 0px) + 18px); */ /* Больше не нужно */
    padding: 8px;
  }
`;

const ScrollArrowSVG = styled.svg`
  width: 80px; /* чуть больше */
  height: 80px;
  overflow: visible;

  .chevron {
    fill: none;
    stroke: #19708b; /* бирюзовый как в примере */
    stroke-width: 6;
    stroke-linecap: round;
    stroke-linejoin: round;
    opacity: 0;
    animation: ${fadeInOutMove} 2.5s infinite ease-out;
  }

  .chevron.bottom {
    animation-delay: 0.4s;
  }

  @media (max-width: 480px) {
    width: 72px;
    height: 72px;
  }
`;


const ProductsSection = styled.section`
  padding: 6rem 0;
  background:rgba(248, 249, 250, 0);
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-second.jpg');
  background-size: 100%;
  background-position: center;
  background-attachment: fixed; /* Оставили как было */
  position: relative;

  @media (max-width: 768px) {
    padding: 4rem 0;
  }

  @media (max-width: 480px) {
    padding: 3rem 0;
  }

  @media (max-width: 360px) {
    padding: 2rem 0;
  }

  /* Отключаем параллакс только для iOS устройств */
  @supports (-webkit-touch-callout: none) {
    background-attachment: scroll;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(117, 194, 194, 0.23);
    z-index: 1;

    @media (max-width: 768px) {
      background: rgba(117, 194, 194, 0.15);
    }

    @media (max-width: 480px) {
      background: rgba(117, 194, 194, 0.1);
    }

    @media (max-width: 360px) {
      background: rgba(117, 194, 194, 0.05);
    }
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  color: #2c3e50;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.8rem;
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    padding: 0 8px;
  }
`;


// Удалены неиспользуемые компоненты CTAButton и блоки информационных карточек

const Home: React.FC = () => {
  const { products } = useAdmin();
  
  // Фильтруем только активные товары
  const activeProducts = products.filter(p => p.isActive !== false);
  
  // Популярные товары (отмеченные как популярные)
  const popularProducts = activeProducts.filter(p => p.isPopular).slice(0, 6);

  // Arrow is fixed via CSS; no need to compute coordinates in JS.


  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img src="https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/logo.png" alt="DreamShop Welcome" />
            Ласкаво просимо до DreamShop
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Органічні фруктові чіпси та прикраси для коктейлів. 
            Натуральні продукти для здорового харчування та гарної подачі страв.
          </HeroSubtitle>
          
          {/* ВОТ СТРЕЛКА - ВНУТРИ HeroContent, ОНА БУДЕТ УЕЗЖАТЬ ВВЕРХ */}
          <ScrollArrowContainer
            role="button"
            aria-label="Перейти до витрини категорій"
            onClick={() => {
              const el = document.getElementById('category-showcase');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <ScrollArrowSVG viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path className="chevron top" d="M 15 20 L 30 35 L 45 20" />
              <path className="chevron bottom" d="M 15 35 L 30 50 L 45 35" />
            </ScrollArrowSVG>
          </ScrollArrowContainer>

        </HeroContent>
      </HeroSection>

      {/* УБРАЛИ createPortal - ОН БОЛЬШЕ НЕ НУЖЕН */}
      

      <CategoryShowcase />

      {/* <CategoryCarousel /> */}

      {popularProducts.length > 0 && (
        <ProductsSection id="products-section">
          <div className="container">
            <SectionTitle>⭐ Популярні товари</SectionTitle>
            <ProductsGrid>
              {popularProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </ProductsGrid>
          </div>
        </ProductsSection>
      )}

      {/* Рекомендовані товари приховані за бажанням замовника */}
    </>
  );
};

export default Home;