import React, { useState, useEffect, useRef } from 'react';

// --- Объекты со стилями (замена styled-components) ---

// ИСПРАВЛЕНИЕ: Добавляем 'as const', чтобы TypeScript понимал, 
// что это конкретные CSS-свойства, а не просто строки.
const styles = {
  loaderContainer: {
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#d7f7f7', // Фон, как в вашем примере
    justifyContent: 'center',
    height: '100vh', // Занимает весь экран для демонстрации
    width: '100%',
  },
  limeLoaderSVG: {
    width: '120px',
    height: '120px',
  },
  loadingText: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '1.2rem',
    color: '#333',
    fontWeight: 'bold',
  },
  // Базовые стили для дольки
  segmentPath: {
    fill: '#aacc00',
    stroke: '#ffffff',
    strokeWidth: 2,
    transition: 'opacity 0.2s ease-in-out',
  },
} as const; // <--- Вот здесь исправление

// --- Основной компонент ---

const LoadingSpinner = () => {
  // Массив с координатами для каждой из 8 долек
  const segmentPaths = [
    "M0 -42 A 42 42 0 0 1 29.7 -29.7 L 0 0 Z",
    "M29.7 -29.7 A 42 42 0 0 1 42 0 L 0 0 Z",
    "M42 0 A 42 42 0 0 1 29.7 29.7 L 0 0 Z",
    "M29.7 29.7 A 42 42 0 0 1 0 42 L 0 0 Z",
    "M0 42 A 42 42 0 0 1 -29.7 29.7 L 0 0 Z",
    "M-29.7 29.7 A 42 42 0 0 1 -42 0 L 0 0 Z",
    "M-42 0 A 42 42 0 0 1 -29.7 -29.7 L 0 0 Z",
    "M-29.7 -29.7 A 42 42 0 0 1 0 -42 L 0 0 Z"
  ];

  // Состояние для отслеживания видимости каждой дольки (массив из true/false)
  const [visibility, setVisibility] = useState(new Array(segmentPaths.length).fill(false));
  
  // useRef для хранения текущего индекса и направления анимации
  const animationState = useRef({
    currentIndex: 0,
    direction: 'forward', // 'forward' - появление, 'backward' - исчезновение
  });

  useEffect(() => {
    // ИСПРАВЛЕНИЕ: Сбрасываем состояние анимации при каждом запуске эффекта.
    // Это решает проблему "пропуска" долек в режиме разработки React.
    animationState.current = {
      currentIndex: 0,
      direction: 'forward',
    };
    
    // Запускаем интервал для анимации
    const animationInterval = setInterval(() => {
      
      setVisibility(currentVisibility => {
        const { currentIndex, direction } = animationState.current;
        const newVisibility = [...currentVisibility];

        if (direction === 'forward') {
          if (currentIndex < segmentPaths.length) {
            newVisibility[currentIndex] = true;
            animationState.current.currentIndex++;
          } else {
            animationState.current.direction = 'backward';
            animationState.current.currentIndex--; 
          }
        } else { // direction === 'backward'
          if (currentIndex >= 0) {
            newVisibility[currentIndex] = false;
            animationState.current.currentIndex--;
          } else {
            animationState.current.direction = 'forward';
            animationState.current.currentIndex++;
          }
        }
        return newVisibility;
      });

    }, 150); // Скорость анимации

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(animationInterval);
  }, [segmentPaths.length]); // Добавляем зависимость

  return (
    <div style={styles.loaderContainer}>
      <svg style={styles.limeLoaderSVG} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#55a630" strokeWidth="4"/>
        <circle cx="50" cy="50" r="44" fill="#f8fff0"/>
        
        <g transform="translate(50,50)">
          {segmentPaths.map((pathData, index) => (
            <path
              key={index}
              d={pathData}
              style={{
                ...styles.segmentPath,
                opacity: visibility[index] ? 1 : 0 // Динамически управляем прозрачностью
              }}
            />
          ))}
        </g>
        
        <circle cx="50" cy="50" r="8" fill="#ffffff"/>
      </svg>
      <div style={styles.loadingText}>Хвилинку...</div>
    </div>
  );
};

export default LoadingSpinner;

