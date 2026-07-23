import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types';
import toast from 'react-hot-toast';
import { parseStoredArray } from '../utils/cart';

const WISHLIST_STORAGE_KEY = 'dreamshop_wishlist';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalItems: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    return parseStoredArray<Product>(localStorage.getItem(WISHLIST_STORAGE_KEY));
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Не удалось сохранить избранное:', error);
    }
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(prevItems => {
      const isAlreadyInWishlist = prevItems.some(item => item.id === product.id);
      
      if (isAlreadyInWishlist) {
        toast.error('Товар вже в обраному');
        return prevItems;
      }

      const newItems = [...prevItems, product];
      toast.success('Товар додано до обраного');
      return newItems;
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      toast.success('Товар видалено з обраного');
      return newItems;
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    toast.success('Обране очищено');
  };

  const getTotalItems = () => {
    return items.length;
  };

  const value = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getTotalItems
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
