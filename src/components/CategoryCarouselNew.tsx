import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

// Переменные
const PRIMARY_COLOR = '#ecad29';
const TEXT_COLOR = '#FFFFFFDD';

// Indicator (индикатор прогресса сверху)
const Indicator = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 5px;
  z-index: 60;
  background-color: ${PRIMARY_COLOR};
`;

// Nav (навигация)
const Nav = styled.nav`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 36px;
  font-weight: 500;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  .svg-container {
    width: 20px;
    height: 20px;
  }
  
  > div {
    display: inline-flex;
    align-items: center;
    text-transform: uppercase;
    font-size: 14px;
    
    &:first-child {
      gap: 10px;
    }
    
    &:last-child {
      gap: 24px;
    }
  }
`;

const NavGroup = styled.div`
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
  font-size: 14px;
  
  &:first-child {
    gap: 10px;
  }
  
  &:last-child {
    gap: 24px;
  }
`;

const SvgContainer = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
`;

const NavDot = styled.div<{ $isActive?: boolean }>`
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isActive ? 'white' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.$isActive && `
    &::after {
      bottom: -8px;
      left: 0;
      right: 0;
      position: absolute;
      content: "";
      height: 3px;
      border-radius: 99px;
      background-color: ${PRIMARY_COLOR};
    }
  `}
  
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

// Demo контейнер
const DemoContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #1a1a1a;
  color: ${TEXT_COLOR};
  font-family: 'Inter', sans-serif;
`;

// Cover (белый экран для плавного перехода)
const Cover = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 100;
`;

// Details (детали категории)
const Details = styled.div<{ $isEven?: boolean }>`
  z-index: ${props => props.$isEven ? 22 : 12};
  position: absolute;
  top: 240px;
  left: 60px;
  color: white;
`;

const PlaceBox = styled.div`
  height: 46px;
  overflow: hidden;
`;

const Text = styled.div`
  padding-top: 16px;
  font-size: 20px;
  color: white;
  
  &::before {
    top: 0;
    left: 0;
    position: absolute;
    content: "";
    width: 30px;
    height: 4px;
    border-radius: 99px;
    background-color: white;
  }
`;

const TitleBox = styled.div`
  margin-top: 2px;
  height: 100px;
  overflow: hidden;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 72px;
  font-family: 'Oswald', sans-serif;
  line-height: 1;
  color: white;
`;

const Description = styled.div`
  margin-top: 16px;
  width: 500px;
  font-size: 16px;
  line-height: 1.6;
  color: ${TEXT_COLOR};
`;

const CTA = styled.div`
  width: 500px;
  margin-top: 24px;
  display: flex;
  align-items: center;
`;

const BookmarkButton = styled.button`
  border: none;
  background-color: ${PRIMARY_COLOR};
  width: 36px;
  height: 36px;
  border-radius: 99px;
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const DiscoverButton = styled(Link)`
  border: 1px solid #ffffff;
  background-color: transparent;
  height: 36px;
  border-radius: 99px;
  color: #ffffff;
  padding: 4px 24px;
  font-size: 12px;
  margin-left: 16px;
  text-transform: uppercase;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: white;
    color: #1a1a1a;
  }
`;

// Pagination
const Pagination = styled.div`
  position: absolute;
  left: 0px;
  top: 0px;
  display: inline-flex;
  align-items: center;
  gap: 20px;
  z-index: 60;
`;

const ArrowButton = styled.button`
  z-index: 60;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: 2px solid #ffffff55;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:nth-child(2) {
    margin-left: 20px;
  }
  
  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
    color: #ffffff99;
  }
`;

const ProgressSubContainer = styled.div`
  margin-left: 24px;
  z-index: 60;
  width: 500px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const ProgressSubBackground = styled.div`
  width: 500px;
  height: 3px;
  background-color: #ffffff33;
`;

const ProgressSubForeground = styled.div`
  height: 3px;
  background-color: ${PRIMARY_COLOR};
  transition: width 0.8s ease;
`;

const SlideNumbers = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  z-index: 60;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
`;

const SlideNumber = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  color: white;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: bold;
`;

// Маппинг категорий
const categories = [
  {
    id: 'chips',
    place: 'Органічні продукти',
    title: 'ФРУКТОВІ',
    title2: 'ЧІПСИ',
    description: 'Хрусткі та смачні органічні фруктові чіпси. Ідеальна здорова закуска для будь-якого часу дня. Виготовлені з натуральних фруктів без додавання цукру та консервантів.',
    link: '/products?category=chips',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800'
  },
  {
    id: 'purees',
    place: 'Органічні продукти',
    title: 'ФРУКТОВЕ',
    title2: 'ПЮРЕ',
    description: 'Нежне та ароматне пюре для десертів та смузі. Тільки натуральні інгредієнти без додавання цукру. Високоякісні продукти для створення смачних та здорових напоїв.',
    link: '/products?category=purees',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
  },
  {
    id: 'syrups',
    place: 'Натуральні інгредієнти',
    title: 'СИРОПИ',
    title2: '',
    description: 'Ароматні сиропи з натуральних інгредієнтів для створення унікальних смаків. Ідеальні для коктейлів, кави, чаю та десертів. Великий вибір смаків та ароматів.',
    link: '/products?category=syrups',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800'
  },
  {
    id: 'powders',
    place: 'Суперфуди',
    title: 'ПУДРИ',
    title2: '',
    description: 'Суперфуди та натуральні барвники для випічки та напоїв. Високоякісні продукти для створення красивих та корисних страв. Ідеальні для професійних кухарів та домашніх майстрів.',
    link: '/products?category=powders',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
  },
  {
    id: 'dried_flowers',
    place: 'Декоративні елементи',
    title: 'СУХОЦВІТИ',
    title2: '',
    description: 'Красиві сухоцвіти для декорації напоїв та страв. Натуральні та екологічні продукти для створення естетичних композицій. Різноманітні кольори та форми.',
    link: '/products?category=dried_flowers',
    image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800'
  },
  {
    id: 'decorations',
    place: 'Прикраси',
    title: 'ПРИКРАСИ',
    title2: 'ДЛЯ ТОРТІВ',
    description: 'Спеціальні прикраси для тортів та святкового декору. Елегантні та красиві елементи для створення неперевершених десертів. Різноманітні варіанти для професійних кондитерів.',
    link: '/products?category=decorations',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800'
  }
];

const CategoryCarouselNew: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState([0, 1, 2, 3, 4, 5]);
  const [detailsEven, setDetailsEven] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const offsetTop = 200;
  let offsetLeft = 700;
  const cardWidth = 200;
  const cardHeight = 300;
  const gap = 40;
  const numberSize = 50;
  const ease = "sine.inOut";

  // Загрузка изображений
  useEffect(() => {
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    const loadImages = async () => {
      try {
        const promises = categories.map(({ image }) => loadImage(image));
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Одна или несколько картинок не загрузились", error);
        setImagesLoaded(true); // Продолжаем в любом случае
      }
    };

    loadImages();
  }, []);

  // Инициализация
  useEffect(() => {
    if (!imagesLoaded) return;

    const [active] = order;
    const detailsActive = detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = detailsEven ? "#details-odd" : "#details-even";
    const { innerHeight: height, innerWidth: width } = window;
    const calculatedOffsetTop = height - 430;
    const calculatedOffsetLeft = width - 830;

    // Устанавливаем начальные позиции
    gsap.set("#pagination", {
      top: calculatedOffsetTop + 330,
      left: calculatedOffsetLeft,
      y: 200,
      opacity: 0,
      zIndex: 60,
    });
    gsap.set("nav", { y: -200, opacity: 0 });

    gsap.set(`#card${active}`, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    gsap.set(`#card-content-${active}`, { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    gsap.set(`${detailsInactive} .text`, { y: 100 });
    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .desc`, { y: 50 });
    gsap.set(`${detailsInactive} .cta`, { y: 60 });

    gsap.set(".progress-sub-foreground", {
      width: 500 * (1 / order.length) * (active + 1),
    });

    const rest = order.slice(1);
    rest.forEach((i, index) => {
      gsap.set(`#card${i}`, {
        x: calculatedOffsetLeft + 400 + index * (cardWidth + gap),
        y: calculatedOffsetTop,
        width: cardWidth,
        height: cardHeight,
        zIndex: 30,
        borderRadius: 10,
      });
      gsap.set(`#card-content-${i}`, {
        x: calculatedOffsetLeft + 400 + index * (cardWidth + gap),
        zIndex: 40,
        y: calculatedOffsetTop + cardHeight - 100,
      });
      gsap.set(`#slide-item-${i}`, { x: (index + 1) * numberSize });
    });

    gsap.set(".indicator", { x: -window.innerWidth });

    const startDelay = 0.6;

    // Анимация cover
    gsap.to(".cover", {
      x: width + 400,
      delay: 0.5,
      ease,
      onComplete: () => {
        setTimeout(() => {
          loop();
        }, 500);
      },
    });

    // Анимация карточек
    rest.forEach((i, index) => {
      gsap.to(`#card${i}`, {
        x: calculatedOffsetLeft + index * (cardWidth + gap),
        zIndex: 30,
        delay: startDelay + 0.05 * index,
        ease,
      });
      gsap.to(`#card-content-${i}`, {
        x: calculatedOffsetLeft + index * (cardWidth + gap),
        zIndex: 40,
        delay: startDelay + 0.05 * index,
        ease,
      });
    });

    gsap.to("#pagination", { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to("nav", { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
  }, [imagesLoaded]);

  // Функция step
  const step = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      const newOrder = [...order];
      newOrder.push(newOrder.shift()!);
      setOrder(newOrder);
      setDetailsEven(!detailsEven);

      const detailsActive = !detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = !detailsEven ? "#details-odd" : "#details-even";

      // Обновляем контент
      const activeCategory = categories[newOrder[0]];
      const activeText = document.querySelector(`${detailsActive} .place-box .text`);
      const activeTitle1 = document.querySelector(`${detailsActive} .title-1`);
      const activeTitle2 = document.querySelector(`${detailsActive} .title-2`);
      const activeDesc = document.querySelector(`${detailsActive} .desc`);

      if (activeText) activeText.textContent = activeCategory.place;
      if (activeTitle1) activeTitle1.textContent = activeCategory.title;
      if (activeTitle2) activeTitle2.textContent = activeCategory.title2;
      if (activeDesc) activeDesc.textContent = activeCategory.description;

      const [active, ...rest] = newOrder;
      const prv = rest[rest.length - 1];

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      gsap.to(`${detailsActive} .text`, {
        y: 0,
        delay: 0.1,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .title-1`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .title-2`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActive} .desc`, {
        y: 0,
        delay: 0.3,
        duration: 0.4,
        ease,
      });
      gsap.to(`${detailsActive} .cta`, {
        y: 0,
        delay: 0.35,
        duration: 0.4,
        onComplete: resolve,
        ease,
      });
      gsap.set(detailsInactive, { zIndex: 12 });

      const { innerHeight: height, innerWidth: width } = window;
      const calculatedOffsetTop = height - 430;
      const calculatedOffsetLeft = width - 830;

      gsap.set(`#card${prv}`, { zIndex: 10 });
      gsap.set(`#card${active}`, { zIndex: 20 });
      gsap.to(`#card${prv}`, { scale: 1.5, ease });

      gsap.to(`#card-content-${active}`, {
        y: calculatedOffsetTop + cardHeight - 10,
        opacity: 0,
        duration: 0.3,
        ease,
      });
      gsap.to(`#slide-item-${active}`, { x: 0, ease });
      gsap.to(`#slide-item-${prv}`, { x: -numberSize, ease });
      gsap.to(".progress-sub-foreground", {
        width: 500 * (1 / newOrder.length) * (active + 1),
        ease,
      });

      gsap.to(`#card${active}`, {
        x: 0,
        y: 0,
        ease,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        onComplete: () => {
          const xNew = calculatedOffsetLeft + (rest.length - 1) * (cardWidth + gap);
          gsap.set(`#card${prv}`, {
            x: xNew,
            y: calculatedOffsetTop,
            width: cardWidth,
            height: cardHeight,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(`#card-content-${prv}`, {
            x: xNew,
            y: calculatedOffsetTop + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
          });
          gsap.set(`#slide-item-${prv}`, { x: rest.length * numberSize });

          gsap.set(detailsInactive, { opacity: 0 });
          gsap.set(`${detailsInactive} .text`, { y: 100 });
          gsap.set(`${detailsInactive} .title-1`, { y: 100 });
          gsap.set(`${detailsInactive} .title-2`, { y: 100 });
          gsap.set(`${detailsInactive} .desc`, { y: 50 });
          gsap.set(`${detailsInactive} .cta`, { y: 60 });
        },
      });

      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = calculatedOffsetLeft + index * (cardWidth + gap);
          gsap.set(`#card${i}`, { zIndex: 30 });
          gsap.to(`#card${i}`, {
            x: xNew,
            y: calculatedOffsetTop,
            width: cardWidth,
            height: cardHeight,
            ease,
            delay: 0.1 * (index + 1),
          });

          gsap.to(`#card-content-${i}`, {
            x: xNew,
            y: calculatedOffsetTop + cardHeight - 100,
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
          });
          gsap.to(`#slide-item-${i}`, { x: (index + 1) * numberSize, ease });
        }
      });
    });
  }, [order, detailsEven]);

  // Функция loop
  const loop = React.useCallback(async () => {
    const animate = (target: string, duration: number, properties: any) => {
      return new Promise((resolve) => {
        gsap.to(target, {
          ...properties,
          duration: duration,
          onComplete: resolve,
        });
      });
    };

    await animate(".indicator", 2, { x: 0 });
    await animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
    gsap.set(".indicator", { x: -window.innerWidth });
    await step();
    loop();
  }, [step]);

  const activeCategory = categories[order[0]];

  return (
    <DemoContainer ref={containerRef}>
      <Indicator className="indicator" />
      
      <Nav>
        <div>
          <SvgContainer className="svg-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
          </SvgContainer>
          <div></div>
        </div>
        <div>
          {categories.map((_, index) => (
            <NavDot 
              key={index} 
              $isActive={order[0] === index}
            />
          ))}
          <SvgContainer className="svg-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </SvgContainer>
          <SvgContainer className="svg-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </SvgContainer>
        </div>
      </Nav>

      <div id="demo">
        {categories.map((category, index) => (
          <div
            key={category.id}
            id={`card${index}`}
            className="card"
            style={{ 
              backgroundImage: `url(${category.image})`,
              position: 'absolute',
              left: 0,
              top: 0,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              boxShadow: '6px 6px 10px 2px rgba(0, 0, 0, 0.6)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
          />
        ))}

        {categories.map((category, index) => (
          <div
            key={`content-${category.id}`}
            id={`card-content-${index}`}
            className="card-content"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              color: TEXT_COLOR,
              paddingLeft: 16,
              opacity: 0
            }}
          >
            <div className="content-start" style={{
              width: 30,
              height: 5,
              borderRadius: 99,
              backgroundColor: TEXT_COLOR
            }}></div>
            <div className="content-place" style={{
              marginTop: 6,
              fontSize: 13,
              fontWeight: 500
            }}>{category.place}</div>
            <div className="content-title-1" style={{
              fontWeight: 600,
              fontSize: 20,
              fontFamily: 'Oswald, sans-serif'
            }}>{category.title}</div>
            {category.title2 && (
              <div className="content-title-2" style={{
                fontWeight: 600,
                fontSize: 20,
                fontFamily: 'Oswald, sans-serif'
              }}>{category.title2}</div>
            )}
          </div>
        ))}
      </div>

      {/* Details Even */}
      <Details id="details-even" $isEven={true}>
        <PlaceBox>
          <Text className="text">{activeCategory.place}</Text>
        </PlaceBox>
        <TitleBox>
          <Title className="title-1">{activeCategory.title}</Title>
        </TitleBox>
        {activeCategory.title2 && (
          <TitleBox>
            <Title className="title-2">{activeCategory.title2}</Title>
          </TitleBox>
        )}
        <Description className="desc">{activeCategory.description}</Description>
        <CTA className="cta">
          <BookmarkButton className="bookmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </svg>
          </BookmarkButton>
          <DiscoverButton to={activeCategory.link} className="discover">
            Перейти до категорії
          </DiscoverButton>
        </CTA>
      </Details>

      {/* Details Odd */}
      <Details id="details-odd" $isEven={false}>
        <PlaceBox>
          <Text className="text">{activeCategory.place}</Text>
        </PlaceBox>
        <TitleBox>
          <Title className="title-1">{activeCategory.title}</Title>
        </TitleBox>
        {activeCategory.title2 && (
          <TitleBox>
            <Title className="title-2">{activeCategory.title2}</Title>
          </TitleBox>
        )}
        <Description className="desc">{activeCategory.description}</Description>
        <CTA className="cta">
          <BookmarkButton className="bookmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </svg>
          </BookmarkButton>
          <DiscoverButton to={activeCategory.link} className="discover">
            Перейти до категорії
          </DiscoverButton>
        </CTA>
      </Details>

      <Pagination id="pagination">
        <ArrowButton className="arrow arrow-left">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </ArrowButton>
        <ArrowButton className="arrow arrow-right">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </ArrowButton>
        <ProgressSubContainer className="progress-sub-container">
          <ProgressSubBackground className="progress-sub-background">
            <ProgressSubForeground className="progress-sub-foreground" />
          </ProgressSubBackground>
        </ProgressSubContainer>
        <SlideNumbers id="slide-numbers">
          {categories.map((_, index) => (
            <SlideNumber key={index} id={`slide-item-${index}`} className="item">
              {index + 1}
            </SlideNumber>
          ))}
        </SlideNumbers>
      </Pagination>

      <Cover className="cover" />
    </DemoContainer>
  );
};

export default CategoryCarouselNew;
