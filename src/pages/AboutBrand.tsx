import React from 'react';
import '../styles/AboutBrand.css';
import AnimatedSpicerCategories from '../components/AnimatedSpicerCategories';

const AboutBrand: React.FC = () => {
  return (
    <div className="brand-page-wrapper">
      {/* SECTION 1: HERO */}
      <section className="brand-hero">
        <div className="brand-hero__left">
          <div className="brand-hero__content">
            <img
              className="brand-logo"
              src="https://spicer.ua/wp-content/uploads/2022/10/logo-about.svg"
              alt="Spicer Logo"
            />
            <h1 className="brand-title">український бренд міцного алкоголю зі смаками та сенсами</h1>
          </div>
        </div>
        <div className="brand-hero__right">
          <img
            src="https://spicer.ua/wp-content/uploads/2024/11/xlaz_9702-scaled.jpg.pagespeed.ic.CDWEPDEEGs.webp"
            alt="Spicer Mood"
          />
        </div>
      </section>

      {/* Анимированные категории (перенесено со страницы Spicer) */}
      <AnimatedSpicerCategories />

      {/* SECTION 2: INTRO */}
      <section className="brand-intro">
        <div className="container-small">
          <p>Ми виготовляємо смачні джини, авторські спайсери, лікери та фруктові настоянки. Поєднуємо традиції приготування алкоголю з інноваціями.</p>
        </div>
      </section>

      {/* SECTION 3: VALUES */}
      <section className="brand-values">
        <div className="container">
          <ul className="values-list">
            <li className="values-item">
              <h2>ГАСТРОНОМІЧНИЙ</h2>
              <p>SPICER вміє створювати напої, що говорять: через мікс трав, спецій та фруктів. Уся історія бренду обертається навколо гастрономії. Від назви SPICER, що пронизана спеціями до інгредієнтів у кожному джині чи лікері.</p>
              <div className="values-img-wrapper">
                <img src="https://spicer.ua/wp-content/uploads/2024/11/x4-4649-scaled.jpg.pagespeed.ic._1tOi1YVbr.webp" alt="Гастрономічний" />
              </div>
            </li>
            <li className="values-item">
              <h2>ЯКІСНИЙ</h2>
              <p>Наше виробництво сучасне та відкрите: ми настоюємо напої на натуральних травах, фруктах та спеціях і використовуємо метод холодної дистиляції. Завдяки цьому напої зберігають якість, свіжий та м’який смак усіх ботанікалів.</p>
              <div className="values-img-wrapper">
                <img src="https://spicer.ua/wp-content/uploads/2024/11/ximg_1184-scaled.jpg.pagespeed.ic.VdZF8kDOCN.webp" alt="Якісний" />
              </div>
            </li>
            <li className="values-item">
              <h2>МІКСОЛОГІЧНИЙ</h2>
              <p>Міксувати коктейлі — це мистецтво, але чого воно має бути складним? Ми розбиваємо стереотипи про складність міксології та показуємо як легко приготувати коктейль вдома. Разом з нами ти дізнаєшся чим замінити шейкер.</p>
              <div className="values-img-wrapper">
                <img src="https://spicer.ua/wp-content/uploads/2024/11/ximg_118411-scaled.jpg.pagespeed.ic.qS810SSrWR.webp" alt="Міксологічний" />
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 4: PHILOSOPHY */}
      <section className="brand-philosophy">
        <div className="philosophy-row">
          <div className="philosophy-content">
            <h2>Філософія бренду</h2>
            <p>ми створили продукт, який легко пʼється. Мʼякий, ароматний та чистий</p>
            <p>Наші напої зберігають свіжий смак усіх фруктів та ботанікалів, які додаємо до них</p>
            <p className="brand-accent">SPICER. Нічого звичайного.</p>
          </div>
          <div className="philosophy-image">
            <img src="https://spicer.ua/wp-content/uploads/2024/11/x015.png.pagespeed.ic.I8E2XnzL-L.png" alt="Philosophy Bottle" />
          </div>
        </div>
      </section>

      {/* SECTION 5: MISSION */}
      <section className="brand-mission">
        <div className="philosophy-row reversed">
          <div className="philosophy-content">
            <h2>Філософія бренду</h2>
            <p>SPICER — не просто «алкоголь на подію», це напій, що передає емоцію: мінливу, яскраву чи меланхолійну, але насичену.</p>
            <p>З нами ти вибираєш не просто пляшку джину чи лікеру, ти обираєш свій стиль життя, смаки, кольори.</p>
            <h2>Місія бренду</h2>
            <p>Місія нашої команди — змінити ставлення до культури споживання алкоголю, бути у кожному коктейлі українця.</p>
            <p className="brand-accent">SPICER. Нічого звичайного!</p>
          </div>
          <div className="philosophy-image">
            <img src="https://spicer.ua/wp-content/uploads/2024/11/x5v8a6379-scaled.jpg.pagespeed.ic._YMn0IJkUU.webp" alt="Mission Lifestyle" />
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="brand-cta">
        <div className="container">
          <h2>КОЛИСЬ ТИ ПЕРЕСТАНЕШ ПИТИ ЗВИЧАЙНИЙ АЛКОГОЛЬ, БО СПРОБУЄШ SPICER</h2>
          <a href="/shop" className="btn-primary">Перейти до магазину</a>
        </div>
      </section>
    </div>
  );
};

export default AboutBrand;
