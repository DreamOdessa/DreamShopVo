import React from 'react';
import styled from 'styled-components';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SideCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ── Оверлей под панелью ── */
const Overlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 20, 32, ${p => (p.$open ? '0.48' : '0')});
  opacity: ${p => (p.$open ? 1 : 0)};
  pointer-events: ${p => (p.$open ? 'auto' : 'none')};
  transition: opacity 0.44s ease;
  z-index: 1100;
`;

/* ── Основная панель (тот же градиент что и бургер-меню) ── */
const Panel = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100dvh;
  width: 420px;
  max-width: 93vw;

  background: linear-gradient(
    175deg,
    rgba(5, 82, 102, 0.99)  0%,
    rgba(14, 115, 138, 0.98) 22%,
    rgba(24, 145, 168, 0.97) 48%,
    rgba(38, 168, 190, 0.96) 72%,
    rgba(62, 198, 218, 0.95) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-left: 1px solid rgba(255, 255, 255, 0.18);

  transform: translateX(${p => (p.$open ? '0' : '110%')});
  transition: transform 0.44s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: ${p =>
    p.$open
      ? '-10px 0 60px rgba(0, 0, 0, 0.35), inset 1px 0 0 rgba(255,255,255,0.12)'
      : 'none'};

  z-index: 1110;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* Декоративный световой блик */
  &::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
`;

/* ── Шапка (как DrawerHeader в бургере) ── */
const DrawerHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: calc(env(safe-area-inset-top, 0px) + 1.1rem) 1.25rem 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.13);
  background: rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
`;

const DrawerTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1.12rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.04em;

  svg { font-size: 1.1rem; opacity: 0.9; }
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    color: white;
    border-color: rgba(255, 255, 255, 0.38);
    transform: scale(1.1) rotate(90deg);
  }
`;

/* ── Список товаров ── */
const Items = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 1rem 1rem;
  position: relative;
  z-index: 1;

  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.22) transparent;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;

  svg { font-size: 2.5rem; opacity: 0.5; }
  span { font-size: 1rem; font-weight: 500; }
`;

/* ── Карточка товара ── */
const Item = styled.div`
  display: grid;
  grid-template-columns: 68px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem 0.9rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.11);
    border-color: rgba(255, 255, 255, 0.22);
  }

  &:last-child { margin-bottom: 0; }
`;

const Thumb = styled.img`
  width: 68px;
  height: 68px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px;
`;

const ItemInfo = styled.div`
  min-width: 0;
`;

const ItemName = styled.div`
  font-weight: 700;
  font-size: 0.92rem;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemMeta = styled.div`
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.58);
`;

const ItemPrice = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
`;

/* ── Количество ── */
const QtyRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
`;

const Qty = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 10px;
  padding: 3px;
`;

const QtyBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  border: none;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.18s ease;

  &:hover { background: rgba(255,255,255,0.22); }
`;

const QtyNum = styled.span`
  min-width: 20px;
  text-align: center;
  font-size: 0.88rem;
  font-weight: 700;
  color: rgba(255,255,255,0.95);
`;

const RemoveBtn = styled.button`
  background: rgba(231, 76, 60, 0.15);
  border: 1px solid rgba(231, 76, 60, 0.25);
  border-radius: 8px;
  color: rgba(255, 120, 110, 0.9);
  cursor: pointer;
  padding: 5px 7px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.28);
    border-color: rgba(231, 76, 60, 0.45);
    color: #ff8a80;
    transform: scale(1.08);
  }
`;

/* ── Футер ── */
const DrawerFoot = styled.div`
  flex-shrink: 0;
  padding: 1rem 1.25rem calc(env(safe-area-inset-bottom, 0px) + 1.1rem);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.9rem;
`;

const TotalLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
`;

const TotalAmount = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.97);
  letter-spacing: -0.02em;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  letter-spacing: 0.01em;

  svg { font-size: 1.05rem; transition: transform 0.25s ease; }

  &:hover {
    background: rgba(255, 255, 255, 0.26);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);

    svg { transform: translateX(4px); }
  }

  &:active { transform: translateY(0); }
`;

const SideCartDrawer: React.FC<SideCartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Overlay $open={isOpen} onClick={onClose} />
      <Panel $open={isOpen} aria-hidden={!isOpen}>

        <DrawerHead>
          <DrawerTitle>
            <FiShoppingCart />
            Кошик
            {items.length > 0 && (
              <span style={{
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '20px',
                padding: '1px 9px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
              }}>
                {items.length}
              </span>
            )}
          </DrawerTitle>
          <CloseBtn onClick={onClose} aria-label="Закрити кошик">
            <FiX />
          </CloseBtn>
        </DrawerHead>

        <Items>
          {items.length === 0 ? (
            <EmptyState>
              <FiShoppingCart />
              <span>Ваш кошик порожній</span>
            </EmptyState>
          ) : (
            items.map(({ product, quantity }) => (
              <Item key={product.id}>
                <Thumb
                  src={(product.images && product.images[0]) || product.image}
                  alt={product.name}
                />
                <ItemInfo>
                  <ItemName>{product.name}</ItemName>
                  <ItemMeta>{quantity} шт.</ItemMeta>
                  <ItemPrice>{Math.round(product.price * quantity)} ₴</ItemPrice>
                </ItemInfo>
                <QtyRow>
                  <Qty>
                    <QtyBtn onClick={() => updateQuantity(product.id, quantity - 1)}>
                      <FiMinus />
                    </QtyBtn>
                    <QtyNum>{quantity}</QtyNum>
                    <QtyBtn onClick={() => updateQuantity(product.id, quantity + 1)}>
                      <FiPlus />
                    </QtyBtn>
                  </Qty>
                  <RemoveBtn onClick={() => removeFromCart(product.id)} title="Видалити">
                    <FiTrash2 />
                  </RemoveBtn>
                </QtyRow>
              </Item>
            ))
          )}
        </Items>

        <DrawerFoot>
          <TotalRow>
            <TotalLabel>Разом</TotalLabel>
            <TotalAmount>{Math.round(getTotalPrice(user?.discount))} ₴</TotalAmount>
          </TotalRow>
          <CheckoutBtn
            onClick={() => { onClose(); navigate('/checkout'); }}
            disabled={items.length === 0}
            style={items.length === 0 ? { opacity: 0.45, cursor: 'not-allowed' } : {}}
          >
            Оформити замовлення
            <FiArrowRight />
          </CheckoutBtn>
        </DrawerFoot>

      </Panel>
    </>
  );
};

export default SideCartDrawer;
