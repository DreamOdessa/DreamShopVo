import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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
