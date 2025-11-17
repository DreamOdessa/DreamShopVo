import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

const ScrollButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 15px rgba(77, 208, 225, 0.3);
  z-index: 999;
  opacity: 0.5;
  transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    opacity: 0.85;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(77, 208, 225, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 2.75rem;
    height: 2.75rem;
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.2rem;
  }
`;

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Показываем кнопку когда пользователь прокрутил вниз на 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <ScrollButton
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ opacity: 0.85 }}
          title="Прокрутити вгору"
          aria-label="Прокрутити вгору"
        >
          <FiArrowUp />
        </ScrollButton>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTopButton;
