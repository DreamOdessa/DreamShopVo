import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiZap, FiHeart } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../contexts/AdminContext';

const HeroSection = styled.section`
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 6rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-first.PNG');
  background-size: cover;
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
  }

  @media (max-width: 480px) {
    padding: 3rem 0;
    min-height: 70vh;
  }

  @media (max-width: 360px) {
    padding: 2rem 0;
    min-height: 60vh;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(77, 208, 225, 0) 0%, rgba(38, 197, 218, 0.21) 50%, rgba(0, 171, 193, 0) 100%);
    z-index: 1;
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

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background: white;
  position: relative;
  z-index: 2;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg,rgb(193, 230, 236) 0%, #e9ecef 100%);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 2rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const FeatureDescription = styled.p`
  color: #6c757d;
  line-height: 1.6;
`;

const ProductsSection = styled.section`
  padding: 6rem 0;
  background:rgba(248, 249, 250, 0);
  background-image: url('https://raw.githubusercontent.com/DreamOdessa/DreamShopVo/main/public/background-second.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(117, 194, 194, 0.23);
    z-index: 1;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 2;
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  margin: 3rem auto 0;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  width: fit-content;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 150, 136, 0.3);
  }
`;

const Home: React.FC = () => {
  const { products } = useAdmin();
  const featuredProducts = products.slice(0, 6);


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
            Натуральні продукти для здорового харчування та красивої подачі страв.
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

      <FeaturesSection>
        <div className="container">
          <FeaturesGrid>
            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FiZap />
              </FeatureIcon>
              <FeatureTitle>100% Органічні продукти</FeatureTitle>
              <FeatureDescription>
                Всі наші продукти виготовляються з натуральних інгредієнтів 
                без використання хімічних добавок.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FiStar />
              </FeatureIcon>
              <FeatureTitle>Висока якість</FeatureTitle>
              <FeatureDescription>
                Ми ретельно відбираємо постачальників та контролюємо якість 
                на кожному етапі виробництва наших продуктів.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <FeatureIcon>
                <FiHeart />
              </FeatureIcon>
              <FeatureTitle>Для всієї родини</FeatureTitle>
              <FeatureDescription>
                Наші продукти підходять для всіх віків та стануть 
                відмінним доповненням до здорового харчування вашої родини.
              </FeatureDescription>
            </FeatureCard>
          </FeaturesGrid>
        </div>
      </FeaturesSection>

      <ProductsSection>
        <div className="container">
          <SectionTitle>Популярні товари</SectionTitle>
          <ProductsGrid>
            {featuredProducts.map((product, index) => (
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
          <ViewAllButton to="/products">
            Переглянути всі товари
            <FiArrowRight style={{ marginLeft: '0.5rem' }} />
          </ViewAllButton>
        </div>
      </ProductsSection>
    </>
  );
};

export default Home;
