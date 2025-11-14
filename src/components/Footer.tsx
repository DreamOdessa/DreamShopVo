import React from 'react';
import styled from 'styled-components';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #00695c 0%, #004d40 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 0rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const FooterSection = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: #ecf0f1;
  }

  p, li {
    color: #bdc3c7;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: white;
    }
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #bdc3c7;
`;

const FooterBottom = styled.div`
  border-top: 1px solid #34495e;
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: #bdc3c7;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>DreamShop</h3>
          <p>
            Магазин органічних фруктових чіпсів та прикрас для коктейлів в Україні. 
            Ми пропонуємо тільки натуральні продукти найвищої якості.
          </p>
         
        </FooterSection>

        <FooterSection>
          <h3>Каталог</h3>
          <ul>
            <li>Фруктові чіпси</li>
            <li>Прикраси для коктейлів</li>
            <li>Сиропи та пюре</li>
            <li>Сухоцвіти</li>
            <li>Органічні продукти</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Інформація</h3>
          <ul>
            <li>Про нас</li>
            <li>Доставка та оплата</li>
            <li>Повернення та обмін</li>
            <li>Політика конфіденційності</li>
            <li>Умови використання</li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Контакти</h3>
          <ContactInfo>
            <FiMapPin />
            <span>Одеса, район Приморський</span>
          </ContactInfo>
          <ContactInfo>
            <FiPhone />
            <span>+380 (93) 909-74-84</span>
          </ContactInfo>
          <ContactInfo>
            <FiMail />
            <span>dream.shop.odessa.dl@gmail.com</span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 DreamShop. Всі права захищені.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
