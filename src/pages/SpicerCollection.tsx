import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

// Глобальные стили (включая блок анимированных категорий)
const GlobalStyle = createGlobalStyle`
  body { font-family: Mulish, sans-serif; }
  /* Анимированные категории */
  #SECTION_1 { block-size:433.875px; height:433.875px; inline-size:1247px; padding-block-start:110.425px; perspective-origin:623.5px 272.141px; transform-origin:623.5px 272.148px; width:1247px; font:10.5125px Mulish, sans-serif; padding:110.425px 0 0; margin:0 auto; background:#fff; }
  #DIV_2 { block-size:433.875px; height:433.875px; inline-size:1077.95px; max-inline-size:1077.96px; max-width:1077.96px; perspective-origin:538.969px 216.938px; transform-origin:538.977px 216.938px; width:1077.95px; font:10.5125px Mulish, sans-serif; margin:0 auto; }
  #UL_3 { block-size:433.875px; box-sizing:border-box; display:flex; height:433.875px; inline-size:1077.95px; margin-block-end:0; margin-block-start:0; padding-inline-start:0; perspective-origin:538.969px 216.938px; transform-origin:538.977px 216.938px; width:1077.95px; flex-flow:row nowrap; font:10.5125px Mulish, sans-serif; list-style:none; margin:0; padding:0; justify-content:center; }
  #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { block-size:433.875px; bottom:0; height:433.875px; inline-size:188.656px; inset:0; margin-inline-end:33.5692px; perspective-origin:94.3281px 216.938px; position:relative; transform-origin:94.3281px 216.938px; width:188.656px; font:10.5125px Mulish, sans-serif; list-style:none; margin:0 33.5692px 0 0; }
  #A_5, #A_9, #A_13, #A_17, #A_21 { position:absolute; inset:0; display:block; text-decoration:none; z-index:3; }
  #H3_7, #H3_11, #H3_15, #H3_19 { width:188.656px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); opacity:0; font:900 23.6625px/29.5813px Mulish, sans-serif; letter-spacing:0.591563px; text-align:center; text-transform:uppercase; color:#000; margin:0; transition:opacity 0.3s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1), bottom 0.6s cubic-bezier(0.4,0,0.2,1); z-index:4; }
  #LI_4:hover #DIV_6, #LI_8:hover #DIV_10, #LI_12:hover #DIV_14 { clip-path:polygon(0 0,100% 0,100% 100%,0 100%); }
  #LI_16:hover #DIV_18 { clip-path:circle(71% at 50% 50%); }
  #UL_3 li:hover > h3 { opacity:1; bottom:40px; top:auto; transform:translateX(-50%); }
  #DIV_6 { clip-path:polygon(50% 30%, 50% 30%, 0% 70%, 100% 70%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2025/03/xaaaa-scaled-_1_.webp.pagespeed.ic.gBzUJPDoPi.webp') center/cover no-repeat; height:100%; }
  #DIV_10 { clip-path:polygon(0% 30%, 100% 30%, 100% 70%, 0% 70%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2024/02/xtom-yam_nova-etyketka4-scaled.jpg.pagespeed.ic.jDI4z6GSXa.webp') center/cover no-repeat; height:100%; }
  #DIV_14 { clip-path:polygon(86% 30%, 100% 37%, 14% 70%, 0% 63%); transition:clip-path .5s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2025/03/o-de-v%D1%8B2-_1_.webp') center/cover no-repeat; height:100%; }
  #DIV_18 { clip-path:circle(25.3% at 50% 50%); transition:clip-path .9s ease-in-out; background:url('https://spicer.ua/wp-content/uploads/2024/10/x4-4630-scaled.jpg.pagespeed.ic.7HdXLWoA9R.webp') center/cover no-repeat; height:100%; }
  .stripes-card { width:188.656px; height:433.875px; position:relative; overflow:hidden; margin-right:33.5692px; list-style:none; }
  .stripes-card a { display:block; width:100%; height:100%; position:relative; text-decoration:none; }
  .stripe { position:absolute; inset:0; background-size:cover; background-position:center; transition:clip-path .6s cubic-bezier(0.4,0,0.2,1); }
  .stripe--top { clip-path: inset(30% 0 60% 0); }
  .stripe--middle { clip-path: inset(45% 0 45% 0); }
  .stripe--bottom { clip-path: inset(60% 0 30% 0); }
  .stripes-card:hover .stripe { clip-path: inset(0 0 0 0); }
  .stripes-card h3 { z-index:10; position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); opacity:0; font:900 23.6625px/29.5813px Mulish,sans-serif; letter-spacing:.591563px; text-align:center; text-transform:uppercase; color:#000; margin:0; transition:opacity .3s ease, transform .6s cubic-bezier(0.4,0,0.2,1), bottom .6s cubic-bezier(0.4,0,0.2,1); }
  .stripes-card:hover h3 { opacity:1; bottom:40px; top:auto; transform:translateX(-50%); }
  @media (max-width: 768px) {
    #SECTION_1 { height:auto; padding:60px 0; block-size:auto; overflow-x:scroll; overflow-y:hidden; -webkit-overflow-scrolling:touch; width:100%; }
    #DIV_2 { width:auto; max-width:none; height:433.875px; inline-size:auto; margin:0; padding:0 20px; min-width:100%; }
    #UL_3 { flex-flow:row nowrap; width:auto; height:433.875px; justify-content:flex-start; inline-size:auto; block-size:433.875px; gap:0; }
    #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { flex-shrink:0; }
  }
`;

const PageWrapper = styled.div`
  background:#fff;
  color:#000;
  min-height:100vh;
`;

const Hero = styled.section`
  display:flex;
  justify-content:space-between;
  align-items:center;
  max-width:1006.2px;
  margin:0 auto;
  padding:60px 0 0;
  flex-wrap:wrap;
`;

const HeroLeft = styled.div`
  width:494px;
  max-width:100%;
  text-align:center;
  img { max-width:100%; height:auto; }
  h2 { font:300 18.8813px/23.6041px Mulish,sans-serif; margin:0 0 18px; }
`;

const HeroRight = styled.div`
  width:275px;
  img { width:100%; height:auto; display:block; }
`;

const BrandThree = styled.ul`
  display:flex; flex-wrap:wrap; list-style:none; margin:0 auto; padding:60px 0; max-width:1006.2px; width:100%;
  li { width:274px; margin:0 16.7867px 16.7867px 0; display:flex; flex-direction:column; }
  h2 { font:800 18.9316px Mulish,sans-serif; text-transform:uppercase; margin:0 0 12px; }
  p { font:300 9.44566px/12.0639px Mulish,sans-serif; margin:0 0 12px; }
  img { width:100%; height:auto; margin-top:auto; display:block; }
`;

const SectionHeading = styled.h2`
  font:800 33.5331px Mulish,sans-serif;
  text-transform:uppercase;
  margin:0 0 52px;
  width:100%;
  text-align:left;
`;

const Row = styled.div<{reverse?: boolean}>`
  max-width:1006.2px;
  margin:0 auto;
  padding:58px 0;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  flex-direction:${({reverse}) => reverse ? 'row-reverse' : 'row'};
  gap:64px;

  .image-col { flex:0 0 420px; }
  .image-col img { width:100%; height:auto; display:block; border-radius:4px; }
  .text-col { flex:1; min-width:0; }
  .text-col h2 { font:800 18.9316px Mulish,sans-serif; text-transform:uppercase; margin:0 0 34px; }
  .text-col p { font:300 10.9px/1.6 Mulish,sans-serif; margin:0 0 20px; }
  .text-col p:last-child { margin-bottom:0; }

  @media (max-width: 900px) {
    flex-direction:column;
    .image-col, .text-col { width:100%; }
    .image-col { order:0; }
    .text-col { order:1; }
  }
`;

const CTASection = styled.section`
  background:url("https://spicer.ua/wp-content/themes/spicer/img/xsection7-bg.png.pagespeed.ic.2UdfkxSREj.png") center/100% no-repeat;
  padding:58px 0; text-align:center; max-width:1006.2px; margin:0 auto;
  h2 { font:800 18.8813px/23.6041px Mulish,sans-serif; text-transform:uppercase; margin:0 0 50px; }
  a { display:inline-flex; align-items:center; justify-content:center; font:700 9.44566px/12.0639px Mulish,sans-serif; text-decoration:none; color:#fff; background:#000; border:1px solid #000; padding:5px 12.5px; transition:.3s; position:relative; }
  a:hover { background:#222; }
`;

const SpicerCollection: React.FC = () => {
  return (
    <PageWrapper>
      <GlobalStyle />
      <Hero>
        <HeroLeft>
          <img src="https://spicer.ua/wp-content/uploads/2022/10/logo-about.svg" alt="Spicer Logo" />
          <h2>український бренд міцного алкоголю зі смаками та сенсами</h2>
        </HeroLeft>
        <HeroRight>
          <img src="https://spicer.ua/wp-content/uploads/2024/11/laz_9702-scaled.jpg" alt="Spicer Hero" />
        </HeroRight>
      </Hero>

      {/* Анимированные категории перенесены на страницу бренда */}

      <BrandThree>
        <li>
          <h2>ГАСТРОНОМІЧНИЙ</h2>
          <p>SPICER вміє створювати напої, що говорять: через мікс трав, спецій та фруктів. Уся історія бренду обертається навколо гастрономії. Від назви SPICER, що пронизана спеціями до інгредієнтів у кожному джині чи лікері. Ми створюємо незвичайні смаки, які приносять якісне задоволення.</p>
          <img src="https://spicer.ua/wp-content/uploads/2024/11/4-4649-scaled.jpg" alt="Гастрономічний" />
        </li>
        <li>
          <h2>ЯКІСНИЙ</h2>
            <p>Наше виробництво сучасне та відкрите: ми настоюємо напої на натуральних травах, фруктах та спеціях і використовуємо метод холодної дистиляції. Завдяки цьому напої зберігають якість, свіжий та м’який смак усіх ботанікалів і мають насичений аромат.</p>
            <img src="https://spicer.ua/wp-content/uploads/2024/11/img_1184-scaled.jpg" alt="Якісний" />
        </li>
        <li>
          <h2>МІКСОЛОГІЧНИЙ</h2>
          <p>Міксувати коктейлі — це мистецтво, але чого воно має бути складним та незрозумілим? Ми розбиваємо стереотипи про складність міксології та показуємо як легко приготувати коктейль вдома. Разом з нами ти дізнаєшся чим замінити шейкер та що таке «бітер», бо ми пояснюємо, що це напої настояні на травах. Усе легше, чим здається.</p>
          <img src="https://spicer.ua/wp-content/uploads/2024/11/img_118411-scaled.jpg" alt="Міксологічний" />
        </li>
      </BrandThree>

      <SectionHeading>Філософія бренду</SectionHeading>
      <Row reverse={false}>
        <div className="image-col">
          <img src="https://spicer.ua/wp-content/uploads/2024/11/015.png" alt="Артефакт бренду" />
        </div>
        <div className="text-col">
          <p>ми створили продукт, який легко пʼється. Мʼякий, ароматний та чистий</p>
          <p>Наші напої зберігають свіжий смак усіх фруктів та ботанікалів, які додаємо до них</p>
          <p>SPICER. Нічого звичайного.</p>
        </div>
      </Row>

      <Row reverse={true}>
        <div className="image-col">
          <img src="https://spicer.ua/wp-content/uploads/2024/11/5v8a6379-scaled.jpg" alt="Команда Spicer" />
        </div>
        <div className="text-col">
          <h2>Філософія бренду</h2>
          <p>SPICER — не просто «алкоголь на подію», це напій, що передає емоцію: мінливу, яскраву чи меланхолійну, але насичену, індивідуальну.</p>
          <p>З нами ти вибираєш не просто пляшку джину чи лікеру, ти обираєш свій стиль життя, смаки, кольори, настрій та цілий світогляд.</p>
          <h2>Місія бренду</h2>
          <p>Місія нашої команди — змінити ставлення до культури споживання алкоголю, бути у кожному коктейлі українця. Адже ми про гастрономічний алкоголь: зі смаком та враженнями, що залишаються.</p>
          <p>SPICER. Нічого звичайного!</p>
        </div>
      </Row>

      <CTASection>
        <h2>КОЛИСЬ ТИ ПЕРЕСТАНЕШ ПИТИ ЗВИЧАЙНИЙ АЛКОГОЛЬ, БО СПРОБУЄШ SPICER</h2>
        <a href="https://spicer.ua/shop/" target="_blank" rel="noopener noreferrer">Перейти до магазину</a>
      </CTASection>
    </PageWrapper>
  );
};

export default SpicerCollection;

// Styled Components
const SpicerContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  color: #ffffff;
`;

const HeroSection = styled.section`
  height: 60vh;
  background: 
    linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
    url('https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1920') center/cover;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(transparent, #0f0f0f);
  }
`;

const HeroContent = styled.div`
  z-index: 1;
`;

const Logo = styled.div`
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 10px;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 20px;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 15px;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
`;

const FiltersSection = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  gap: 30px;
  align-items: center;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: #cccccc;
`;

const FilterSelect = styled.select`
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  &:focus {
    outline: none;
    border-color: #f4d03f;
  }
`;

const ResultCount = styled.div`
  margin-left: auto;
  font-size: 1.1rem;
  color: #cccccc;
  
  span {
    color: #f4d03f;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ProductsGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpicerProductCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 25px 50px rgba(244, 208, 63, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  transition: transform 0.4s;
  
  ${SpicerProductCard}:hover & {
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 25px;
`;

const ProductName = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #ffffff;
`;

const ProductVolume = styled.div`
  display: inline-block;
  padding: 5px 12px;
  background: rgba(244, 208, 63, 0.2);
  color: #f4d03f;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-bottom: 15px;
`;

const ProductDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
`;

const ProductPrice = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f4d03f;
`;

const AddToCartButton = styled.button`
  padding: 12px 24px;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #000000;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(244, 208, 63, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const DistillBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  color: #000000;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 1px;
`;

const AboutSection = styled.section`
  max-width: 800px;
  margin: 80px auto 40px;
  padding: 60px 40px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  text-align: center;
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 25px;
  background: linear-gradient(135deg, #f4d03f 0%, #f39c12 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AboutText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #cccccc;
`;

const LoadingMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  font-size: 1.5rem;
  color: #f4d03f;
`;

const BrandInfoSection = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  padding: 80px 20px;
  background: #ffffff;
`;

const BrandIntro = styled.div`
  text-align: center;
  margin-bottom: 60px;
  
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #333;
    max-width: 900px;
    margin: 0 auto;
    font-weight: 300;
  }
`;

const BrandCardsContainer = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
`;

const BrandCard = styled.li`
  flex: 1 1 300px;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  background: #fff;
  
  h2 {
    font-size: 1.4rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin: 0 0 15px 0;
    color: #000;
  }
  
  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #333;
    margin: 0 0 15px 0;
    font-weight: 300;
    flex-grow: 1;
  }
  
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-top: auto;
    border-radius: 8px;
  }
`;

// Глобальный стиль: белый фон, плавная анимация для круга и трёх полосок, мобильная сетка 2x2+1
const SpicerCategoriesStyle = createGlobalStyle`
  #SECTION_1 { block-size:433.875px; height:433.875px; inline-size:1247px; padding-block-start:110.425px; perspective-origin:623.5px 272.141px; transform-origin:623.5px 272.148px; width:1247px; font:10.5125px Mulish, sans-serif; padding:110.425px 0 0; margin:0 auto; background:#fff; }
  #DIV_2 { block-size:433.875px; height:433.875px; inline-size:1077.95px; max-inline-size:1077.96px; max-width:1077.96px; perspective-origin:538.969px 216.938px; transform-origin:538.977px 216.938px; width:1077.95px; font:10.5125px Mulish, sans-serif; margin:0 auto; }
  #UL_3 { block-size:433.875px; box-sizing:border-box; display:flex; height:433.875px; inline-size:1077.95px; margin-block-end:0; margin-block-start:0; padding-inline-start:0; perspective-origin:538.969px 216.938px; transform-origin:538.977px 216.938px; width:1077.95px; flex-flow:row nowrap; font:10.5125px Mulish, sans-serif; list-style:none; margin:0; padding:0; justify-content:center; }
  #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { block-size:433.875px; bottom:0; height:433.875px; inline-size:188.656px; inset-block-end:0; inset-block-start:0; inset-inline-end:0; inset-inline-start:0; left:0; margin-inline-end:33.5692px; perspective-origin:94.3281px 216.938px; position:relative; right:0; top:0; transform-origin:94.3281px 216.938px; width:188.656px; font:10.5125px Mulish, sans-serif; list-style:none; margin:0 33.5692px 0 0; }
  #A_5, #A_9, #A_13, #A_17, #A_21 { color:#000; text-decoration:none; border:0 none; font:10.5125px Mulish, sans-serif; list-style:none; outline:none; position:absolute; inset:0; z-index:3; display:block; }
  
  /* Треугольник */
  #DIV_6 { block-size:433.875px; bottom:0; clip-path:polygon(50% 30%, 50% 30%, 0% 70%, 100% 70%); cursor:pointer; height:433.875px; inline-size:188.656px; position:relative; width:188.656px; background:url('https://spicer.ua/wp-content/uploads/2025/03/xaaaa-scaled-_1_.webp.pagespeed.ic.gBzUJPDoPi.webp') center/cover no-repeat; transition:clip-path 0.5s ease-in-out; }
  
  /* Квадрат */
  #DIV_10 { block-size:433.875px; bottom:0; clip-path:polygon(0% 30%, 100% 30%, 100% 70%, 0% 70%); cursor:pointer; height:433.875px; inline-size:188.656px; position:relative; width:188.656px; background:url('https://spicer.ua/wp-content/uploads/2024/02/xtom-yam_nova-etyketka4-scaled.jpg.pagespeed.ic.jDI4z6GSXa.webp') center/cover no-repeat; transition:clip-path 0.5s ease-in-out; }
  
  /* Диагональ */
  #DIV_14 { block-size:433.875px; bottom:0; clip-path:polygon(86% 30%, 100% 37%, 14% 70%, 0% 63%); cursor:pointer; height:433.875px; inline-size:188.656px; position:relative; width:188.656px; background:url('https://spicer.ua/wp-content/uploads/2025/03/o-de-v%D1%8B2-_1_.webp') center/cover no-repeat; transition:clip-path 0.5s ease-in-out; }
  
  /* Круг - плавное увеличение */
  #DIV_18 { block-size:433.875px; bottom:0; clip-path:circle(25.3% at 50% 50%); cursor:pointer; height:433.875px; inline-size:188.656px; position:relative; width:188.656px; background:url('https://spicer.ua/wp-content/uploads/2024/10/x4-4630-scaled.jpg.pagespeed.ic.7HdXLWoA9R.webp') center/cover no-repeat; transition:clip-path 0.9s ease-in-out; }
  
  /* Пятая карточка - три полоски */
  .stripes-card {
    width: 188.656px;
    height: 433.875px;
    position: relative;
    overflow: hidden;
    margin-right: 33.5692px;
    list-style: none;
  }

  .stripes-card a {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    text-decoration: none;
  }

  .stripe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  .stripes-card h3 {
    z-index: 10;
    width: 188.656px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    font: 900 23.6625px/29.5813px Mulish, sans-serif;
    letter-spacing: 0.591563px;
    text-align: center;
    text-transform: uppercase;
    color: #000;
    margin: 0;
    transition: opacity 0.3s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1), bottom 0.6s cubic-bezier(0.4,0,0.2,1);
  }

  /* ВЕРХНЯЯ ПОЛОСА:
   Срезаем 20% сверху.
   Срезаем 70% снизу.
   Остается: участок с 20% по 30% (Высота 10%)
*/
.stripe--top {
    clip-path: inset(30% 0 60% 0);
}

/* СРЕДНЯЯ ПОЛОСА:
   Срезаем 45% сверху.
   Срезаем 45% снизу.
   Остается: участок с 45% по 55% (Высота 10%)
*/
.stripe--middle {
    clip-path: inset(45% 0 45% 0);
}

/* НИЖНЯЯ ПОЛОСА:
   Срезаем 70% сверху.
   Срезаем 20% снизу.
   Остается: участок с 70% по 80% (Высота 10%)
*/
.stripe--bottom {
    clip-path: inset(60% 0 30% 0);
}

  .stripes-card:hover .stripe {
    clip-path: inset(0 0 0 0);
  }

  .stripes-card:hover h3 {
    opacity: 1;
    bottom: 40px;
    top: auto;
    transform: translateX(-50%);
  }
  
  #H3_7, #H3_11, #H3_15, #H3_19 { width:188.656px; position:absolute; left:50%; top:50%; transform:translate(-50%, -50%); opacity:0; font:900 23.6625px/29.5813px Mulish, sans-serif; letter-spacing:0.591563px; text-align:center; text-transform:uppercase; color:#000; margin:0; transition:opacity 0.3s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1), bottom 0.6s cubic-bezier(0.4,0,0.2,1); z-index:4; }
  
  /* Hover animations */
  #LI_4:hover #DIV_6, #LI_8:hover #DIV_10, #LI_12:hover #DIV_14 { clip-path:polygon(0 0,100% 0,100% 100%,0 100%); }
  #LI_16:hover #DIV_18 { clip-path:circle(71% at 50% 50%); }
  #UL_3 li:hover > h3 { opacity:1; bottom:40px; top:auto; transform:translateX(-50%); }
  
  /* Мобильная версия: горизонтальный скролл */
  @media (max-width: 768px) {
    #SECTION_1 { 
      height:auto; 
      padding:60px 0; 
      block-size:auto; 
      overflow-x:scroll; 
      overflow-y:hidden;
      -webkit-overflow-scrolling:touch;
      width:100%;
    }
    #DIV_2 { 
      width:auto; 
      max-width:none; 
      height:433.875px; 
      inline-size:auto;
      margin:0;
      padding:0 20px;
      min-width:100%;
    }
    #UL_3 { 
      flex-flow:row nowrap; 
      width:auto; 
      height:433.875px; 
      justify-content:flex-start; 
      inline-size:auto; 
      block-size:433.875px;
      gap:0;
    }
    #LI_4, #LI_8, #LI_12, #LI_16, #LI_20 { 
      width:188.656px; 
      height:433.875px; 
      margin:0 33.5692px 0 0; 
      inline-size:188.656px; 
      block-size:433.875px;
      flex-shrink:0;
      min-width:188.656px;
    }
    #DIV_6, #DIV_10, #DIV_14, #DIV_18, #DIV_22 { 
      width:188.656px; 
      height:433.875px; 
      inline-size:188.656px; 
      block-size:433.875px;
    }
    #H3_7, #H3_11, #H3_15, #H3_19, #H3_23 { 
      font-size:20px; 
      width:188.656px; 
      line-height:1.2; 
    }
  }
`;
// (Старый код удалён; компонент переписан под лендинг без логики товаров)
