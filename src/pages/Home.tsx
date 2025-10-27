import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiStar, FiHeart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
// import CategoryCarousel from '../components/CategoryCarousel';
import { useAdmin } from '../contexts/AdminContext';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-first.png');
  background-size: 115%;
  background-position: center;
  background-attachment: fixed;
  background-blend-mode: overlay;
  min-height: 100vh;
  display: flex;
  align-items: center;
  margin-top: -4rem;

  @media (max-width: 768px) {
    padding: 4rem 0;
    min-height: 80vh;
    margin-top: -2rem;
    background-size: 200%;
  }

  @media (max-width: 480px) {
    padding: 3rem 0;
    min-height: 70vh;
    margin-top: -1.5rem;
    background-size: 200%;
  }

  @media (max-width: 360px) {
    padding: 2rem 0;
    min-height: 60vh;
    margin-top: -1rem;
    background-size: 200%;
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
    background: linear-gradient(135deg, rgba(25, 174, 194, 0.62) 0%, rgb(138, 13, 13) 50%, rgbrgba(54, 214, 235, 0) 100%);
    z-index: 1;

    @media (max-width: 768px) {
      background: linear-gradient(135deg, rgba(111, 213, 226, 0.25) 0%, rgba(38, 197, 218, 0.1) 50%, rgba(0, 171, 193, 0.38) 100%);
    }

    @media (max-width: 480px) {
      background: linear-gradient(135deg, rgba(125, 223, 236, 0.18) 0%, rgba(74, 214, 233, 0) 50%, rgba(117, 212, 224, 0.27) 100%);
    }

    @media (max-width: 360px) {
      background: linear-gradient(135deg, rgba(77, 208, 225, 0.44) 0%, rgba(38, 197, 218, 0.03) 50%, rgba(45, 172, 189, 0.38) 100%);
    }
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
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

const CTAButton = styled(motion(Link))`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #00acc1;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(0, 150, 136, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 150, 136, 0.4);
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 360px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
`;


const ProductsSection = styled.section`
  padding: 6rem 0;
  background:rgba(248, 249, 250, 0);
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-second.jpg');
  background-size: 100%;
  background-position: center;
  background-attachment: fixed;
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


// Блок с тремя информационными карточками
const InfoCardsSection = styled.section`
  padding: 4rem 0;
  background: white;
  position: relative;
  z-index: 2;
`;

/* duplicate definitions removed */

const InfoCardsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: #f8f9fa;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: #4dd0e1;
  }
`;

const InfoCardIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
`;

const InfoCardTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const InfoCardDescription = styled.p`
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.6;
`;

const Home: React.FC = () => {
  const { products } = useAdmin();
  
  // Фильтруем только активные товары
  const activeProducts = products.filter(p => p.isActive !== false);
  
  // Популярные товары (отмеченные как популярные)
  const popularProducts = activeProducts.filter(p => p.isPopular).slice(0, 6);


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
          <CTAButton
            to="/products"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Переглянути каталог
            <FiArrowRight />
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <InfoCardsSection>
        <InfoCardsContainer>
          <InfoCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <InfoCardIcon>
              <FiZap />
            </InfoCardIcon>
            <InfoCardTitle>100% Органічні продукти</InfoCardTitle>
            <InfoCardDescription>
              Всі наші продукти виготовляються з натуральних інгредієнтів без використання хімічних добавок.
            </InfoCardDescription>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <InfoCardIcon>
              <FiStar />
            </InfoCardIcon>
            <InfoCardTitle>Висока якість</InfoCardTitle>
            <InfoCardDescription>
              Ми ретельно відбираємо постачальників та контролюємо якість на кожному етапі виробництва наших продуктів.
            </InfoCardDescription>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <InfoCardIcon>
              <FiHeart />
            </InfoCardIcon>
            <InfoCardTitle>Для всієї родини</InfoCardTitle>
            <InfoCardDescription>
              Наші продукти підходять для всіх віків та стануть відмінним доповненням до здорового харчування вашої родини.
            </InfoCardDescription>
          </InfoCard>
        </InfoCardsContainer>
      </InfoCardsSection>

      {/* <CategoryCarousel /> */}

      {popularProducts.length > 0 && (
        <ProductsSection>
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
