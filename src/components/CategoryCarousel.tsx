import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FiArrowRight } from 'react-icons/fi';

const CarouselContainer = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
  overflow: hidden;
  margin-top: -4rem;
  font-family: 'Inter', sans-serif;
`;

const CardContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Card = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background-position: center;
  background-size: cover;
  box-shadow: 6px 6px 10px 2px rgba(0, 0, 0, 0.6);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &.is-active {
    z-index: 10;
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  
  .is-active & {
    opacity: 1;
    visibility: visible;
  }
`;

const CardTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'Oswald', sans-serif;
`;

const CardDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
`;

const CardButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #ecad29;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #d99d20;
    transform: translateY(-2px);
  }
`;

const Details = styled.div`
  position: absolute;
  top: 240px;
  left: 60px;
  z-index: 22;
  color: white;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  
  &.is-active {
    opacity: 1;
    visibility: visible;
  }
`;

const PlaceBox = styled.div`
  height: 46px;
  overflow: hidden;
  position: relative;
  padding-top: 16px;
  font-size: 20px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 4px;
    border-radius: 99px;
    background-color: white;
  }
`;

const TitleBox = styled.div`
  height: 100px;
  overflow: hidden;
  margin-top: 2px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 72px;
  font-family: 'Oswald', sans-serif;
  line-height: 1;
`;

const Description = styled.div`
  margin-top: 16px;
  width: 500px;
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
`;

const CTA = styled.div`
  width: 500px;
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const BookmarkButton = styled.button`
  border: none;
  background-color: #ecad29;
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
  border: 1px solid white;
  background-color: transparent;
  height: 36px;
  border-radius: 99px;
  color: white;
  padding: 4px 24px;
  font-size: 12px;
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

const Pagination = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 60px;
  z-index: 60;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ArrowButton = styled.button`
  z-index: 60;
  width: 50px;
  height: 50px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 24px;
    height: 24px;
    stroke-width: 2;
    color: rgba(255, 255, 255, 0.6);
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
  background-color: rgba(255, 255, 255, 0.2);
`;

const ProgressSubForeground = styled.div<{ width: number }>`
  height: 3px;
  background-color: #ecad29;
  width: ${props => props.width}%;
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

const Indicator = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 5px;
  z-index: 60;
  background-color: #ecad29;
`;

interface Category {
  id: string;
  title: string;
  title2: string;
  description: string;
  image: string;
  link: string;
}

const categories: Category[] = [
  {
    id: 'chips',
    title: 'ФРУКТОВІ',
    title2: 'ЧІПСИ',
    description: 'Хрусткі та смачні органічні фруктові чіпси. Ідеальна здорова закуска для будь-якого часу дня. Виготовлені з натуральних фруктів без додавання цукру та консервантів.',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
    link: '/products?category=chips'
  },
  {
    id: 'decorations',
    title: 'ПРИКРАСИ',
    title2: 'ДЛЯ КОКТЕЙЛІВ',
    description: 'Елегантні та красиві прикраси для коктейлів та напоїв. Зробіть ваші напої справжнім шедевром. Різноманітні варіанти для професійних барменів та домашніх майстрів.',
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800',
    link: '/products?category=decorations'
  },
  {
    id: 'syrups',
    title: 'НАТУРАЛЬНІ',
    title2: 'СИРОПИ',
    description: 'Ароматні сиропи з натуральних інгредієнтів для створення унікальних смаків. Ідеальні для коктейлів, кави, чаю та десертів. Великий вибір смаків та ароматів.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    link: '/products?category=syrups'
  },
  {
    id: 'purees',
    title: 'ФРУКТОВІ',
    title2: 'ПЮРЕ',
    description: 'Натуральні фруктові пюре для створення смачних та здорових напоїв. Високоякісні продукти без додавання цукру. Ідеальні для смузі, коктейлів та десертів.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    link: '/products?category=purees'
  },
  {
    id: 'flowers',
    title: 'СУХОЦВІТИ',
    title2: '',
    description: 'Красиві сухоцвіти для декорації напоїв та страв. Натуральні та екологічні продукти для створення естетичних композицій. Різноманітні кольори та форми.',
    image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    link: '/products?category=dried_flowers'
  }
];

const CategoryCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);
  const pauseDuration = 5000;

  // Обновляем ref при изменении currentIndex
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Функция анимации карточки
  const animateCard = React.useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const cards = document.querySelectorAll('.category-card');
    const details = document.querySelector('.details-container');
    const offsetLeft = window.innerWidth - 830;
    const offsetTop = window.innerHeight - 430;
    const cardWidth = 200;
    const cardHeight = 300;
    const gap = 40;

    const index = currentIndexRef.current;
    
    // 1. Убираем активный класс
    cards.forEach(card => card.classList.remove('is-active'));
    if (details) details.classList.remove('is-active');

    // 2. Определяем текущую карточку
    const currentCard = cards[index];

    if (!currentCard) {
      isAnimatingRef.current = false;
      return;
    }

    // 3. Увеличиваем карточку на весь экран
    gsap.to(currentCard, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        // Показываем текст
        currentCard.classList.add('is-active');
        if (details) details.classList.add('is-active');

        // Пауза 5 секунд
        setTimeout(() => {
          // Сдвигаем остальные карточки влево
          cards.forEach((card, i) => {
            if (i !== index) {
              const newIndex = i > index ? i - 1 : i;
              gsap.to(card, {
                x: offsetLeft + newIndex * (cardWidth + gap),
                duration: 0.8,
                ease: 'power2.inOut',
              });
            }
          });

          // Перемещаем текущую карточку в конец ряда
          gsap.to(currentCard, {
            x: offsetLeft + (categories.length - 1) * (cardWidth + gap),
            y: offsetTop,
            width: cardWidth,
            height: cardHeight,
            borderRadius: 10,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
              // Убираем активный класс
              currentCard.classList.remove('is-active');
              if (details) details.classList.remove('is-active');

              // Обновляем индекс
              const nextIndex = (index + 1) % categories.length;
              setCurrentIndex(nextIndex);
              isAnimatingRef.current = false;
            }
          });
        }, pauseDuration);
      }
    });
  }, []);

  // Инициализация позиций карточек
  useEffect(() => {
    const cards = document.querySelectorAll('.category-card');
    const offsetLeft = window.innerWidth - 830;
    const offsetTop = window.innerHeight - 430;
    const cardWidth = 200;
    const cardHeight = 300;
    const gap = 40;

    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          zIndex: 10,
        });
      } else {
        gsap.set(card, {
          x: offsetLeft + (index - 1) * (cardWidth + gap),
          y: offsetTop,
          width: cardWidth,
          height: cardHeight,
          zIndex: 5,
          borderRadius: 10,
        });
      }
    });

    const firstCard = cards[0];
    const details = document.querySelector('.details-container');
    if (firstCard) firstCard.classList.add('is-active');
    if (details) details.classList.add('is-active');

    // Запускаем первую анимацию
    setTimeout(() => {
      animateCard();
    }, 1000);
  }, [animateCard]);

  const handleArrowClick = (direction: 'left' | 'right') => {
    // Останавливаем автоматический цикл и переключаем вручную
    if (direction === 'right') {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % categories.length);
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + categories.length) % categories.length);
    }
  };

  const activeCategory = categories[currentIndex];
  const progressWidth = ((currentIndex + 1) / categories.length) * 100;

  return (
    <CarouselContainer ref={containerRef}>
      <Indicator className="indicator" />
      
      <CardContainer>
        {categories.map((category, index) => (
          <Card
            key={category.id}
            className="category-card"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <CardImage />
            <CardContent>
              <CardTitle>{category.title} {category.title2}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
              <CardButton to={category.link}>
                Перейти до категорії
                <FiArrowRight />
              </CardButton>
            </CardContent>
          </Card>
        ))}
      </CardContainer>

      <Details className="details-container">
        <PlaceBox>
          <div className="text">Категорія</div>
        </PlaceBox>
        <TitleBox>
          <div className="title-1">{activeCategory.title}</div>
        </TitleBox>
        <TitleBox>
          <div className="title-2">{activeCategory.title2}</div>
        </TitleBox>
        <Description className="desc">{activeCategory.description}</Description>
        <CTA className="cta">
          <BookmarkButton>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </svg>
          </BookmarkButton>
          <DiscoverButton to={activeCategory.link}>
            Перейти до категорії
            <FiArrowRight />
          </DiscoverButton>
        </CTA>
      </Details>

      <Pagination>
        <ArrowButton onClick={() => handleArrowClick('left')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </ArrowButton>
        <ArrowButton onClick={() => handleArrowClick('right')}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </ArrowButton>
        <ProgressSubContainer>
          <ProgressSubBackground>
            <ProgressSubForeground width={progressWidth} />
          </ProgressSubBackground>
        </ProgressSubContainer>
        <SlideNumbers>
          {currentIndex + 1}
        </SlideNumbers>
      </Pagination>
    </CarouselContainer>
  );
};

export default CategoryCarousel;
