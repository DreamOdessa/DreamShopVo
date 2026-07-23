import React, { useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const MaintenanceGlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    background: #dceff0;
    color: #173f49;
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
`;

const Page = styled.main`
  position: relative;
  display: grid;
  min-height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background-image: url('/background-first.PNG');
  background-position: center;
  background-size: cover;

  &::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    background: rgba(230, 248, 248, 0.82);
    content: '';
  }
`;

const Content = styled.section`
  display: flex;
  width: min(100% - 2rem, 760px);
  min-height: 100svh;
  margin: 0 auto;
  padding: 3rem 0 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  @media (max-width: 640px) {
    width: min(100% - 1.5rem, 760px);
    padding: 2rem 0 1.5rem;
  }
`;

const Logo = styled.img`
  width: min(520px, 88vw);
  height: auto;
  margin-bottom: 2.25rem;
  filter: drop-shadow(0 12px 28px rgba(11, 75, 88, 0.16));

  @media (max-width: 640px) {
    width: min(390px, 92vw);
    margin-bottom: 1.75rem;
  }
`;

const Status = styled.div`
  display: inline-flex;
  margin-bottom: 1.25rem;
  align-items: center;
  gap: 0.65rem;
  color: #8a5211;
  font-size: 0.82rem;
  font-weight: 750;
  letter-spacing: 0;
  text-transform: uppercase;

  &::before {
    width: 0.65rem;
    height: 0.65rem;
    border: 2px solid rgba(138, 82, 17, 0.28);
    border-radius: 50%;
    background: #eaa546;
    content: '';
  }
`;

const Title = styled.h1`
  max-width: 680px;
  margin: 0;
  color: #0c5363;
  font-size: 3.25rem;
  font-weight: 760;
  line-height: 1.08;
  letter-spacing: 0;

  @media (max-width: 640px) {
    font-size: 2.25rem;
  }

  @media (max-width: 380px) {
    font-size: 1.9rem;
  }
`;

const Description = styled.p`
  max-width: 620px;
  margin: 1.5rem 0 0;
  color: #365f67;
  font-size: 1.1rem;
  line-height: 1.7;

  @media (max-width: 640px) {
    margin-top: 1.2rem;
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const Note = styled.p`
  margin: 2rem 0 0;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(12, 83, 99, 0.2);
  color: #0c5363;
  font-size: 0.95rem;
  font-weight: 650;
`;

const Footer = styled.footer`
  margin-top: auto;
  padding-top: 3rem;
  color: rgba(23, 63, 73, 0.68);
  font-size: 0.8rem;
`;

const MaintenancePage: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then(registrations => Promise.all(registrations.map(registration => registration.unregister())))
        .catch(() => undefined);
    }

    if ('caches' in window) {
      caches.keys()
        .then(keys => Promise.all(keys.map(key => caches.delete(key))))
        .catch(() => undefined);
    }
  }, []);

  return (
    <>
      <MaintenanceGlobalStyles />
      <Page>
        <Content aria-labelledby="maintenance-title">
          <Logo
            src="/logo-name.PNG"
            alt="DreamShop"
            width={520}
            height={416}
            fetchPriority="high"
          />
          <Status>Технічні роботи</Status>
          <Title id="maintenance-title">Магазин тимчасово недоступний</Title>
          <Description>
            Ми оновлюємо DreamShop, переносимо каталог і готуємо швидший та
            зручніший сайт. Повернемося зовсім скоро.
          </Description>
          <Note>Дякуємо за розуміння та довіру.</Note>
          <Footer>DreamShop, Одеса</Footer>
        </Content>
      </Page>
    </>
  );
};

export default MaintenancePage;
