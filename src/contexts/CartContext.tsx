import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order } from '../types';
import { orderService } from '../firebase/services';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: (userDiscount?: number) => number;
  getTotalItems: () => number;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('dreamshop_cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dreamshop_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = (userDiscount?: number) => {
    const total = items.reduce((total, item) => {
      const price = item.product.originalPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
    
    if (userDiscount && userDiscount > 0) {
      return total * (1 - userDiscount / 100);
    }
    
    return total;
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
    try {
      // Валидация данных заказа
      if (!orderData.userId) {
        throw new Error('ID пользователя не указан');
      }
      if (!orderData.items || orderData.items.length === 0) {
        throw new Error('Корзина пуста');
      }
      if (!orderData.customerInfo || !orderData.deliveryInfo || !orderData.paymentInfo) {
        throw new Error('Неполная информация о заказе');
      }

      // Очищаем данные от undefined значений перед отправкой
      const cleanOrderData = {
        ...orderData,
        recipientInfo: {
          ...orderData.recipientInfo,
          establishmentName: orderData.recipientInfo.establishmentName || null
        }
      };

      const orderId = await orderService.create(cleanOrderData);
      clearCart();
      toast.success('Замовлення створено успішно!');
      return orderId;
    } catch (error) {
      console.error('Помилка створення замовлення:', error);
      const errorMessage = error instanceof Error ? error.message : 'Помилка створення замовлення';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    createOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

