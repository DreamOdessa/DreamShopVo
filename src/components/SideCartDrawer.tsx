import React from 'react';
import styled from 'styled-components';
import { FiX, FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SideCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'auto' : 'none'};
  transition: opacity 0.25s ease;
  z-index: 1100;
`;

const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  max-width: 92vw;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: -10px 0 30px rgba(0,0,0,0.15);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-left: 1px solid rgba(255, 255, 255, 0.35);
  transform: translateX(${p => p.$open ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1110;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.35);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #6c757d;
`;

const Items = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 1rem 1rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.35);
`;

const Thumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  background: rgba(255,255,255,0.6);
  border-radius: 10px;
`;

const Name = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
`;

const Muted = styled.div`
  font-size: 0.85rem;
  color: #6c757d;
`;

const Qty = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const QtyBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  background: #fff;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 6px;
`;

const Footer = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.35);
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #4dd0e1 0%, #26c6da 50%, #00acc1 100%);
  color: #fff;
  border: none;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  font-weight: 700;
`;

const SideCartDrawer: React.FC<SideCartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Overlay $open={isOpen} onClick={onClose} />
      <Panel $open={isOpen} aria-hidden={!isOpen}>
        <Header>
          <Title>Кошик</Title>
          <CloseBtn onClick={onClose} aria-label="Закрити"><FiX /></CloseBtn>
        </Header>
        <Items>
          {items.length === 0 ? (
            <Muted>Ваш кошик порожній</Muted>
          ) : items.map(({ product, quantity }) => (
            <Item key={product.id}>
              <Thumb src={(product.images && product.images[0]) || product.image} alt={product.name} />
              <div>
                <Name>{product.name}</Name>
                <Muted>{product.price} ₴ · {quantity} шт</Muted>
              </div>
              <div>
                <Qty>
                  <QtyBtn onClick={() => updateQuantity(product.id, quantity - 1)}><FiMinus /></QtyBtn>
                  <span>{quantity}</span>
                  <QtyBtn onClick={() => updateQuantity(product.id, quantity + 1)}><FiPlus /></QtyBtn>
                  <RemoveBtn onClick={() => removeFromCart(product.id)} title="Видалити"><FiTrash2 /></RemoveBtn>
                </Qty>
              </div>
            </Item>
          ))}
        </Items>
        <Footer>
          <TotalRow>
            <span>Разом</span>
            <span>{Math.round(getTotalPrice(user?.discount))} ₴</span>
          </TotalRow>
          <CheckoutBtn onClick={() => { onClose(); navigate('/checkout'); }}>Перейти до оформлення</CheckoutBtn>
        </Footer>
      </Panel>
    </>
  );
};

export default SideCartDrawer;


