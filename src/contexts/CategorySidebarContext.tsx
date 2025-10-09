import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategorySidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const CategorySidebarContext = createContext<CategorySidebarContextType | undefined>(undefined);

export const useCategorySidebar = () => {
  const context = useContext(CategorySidebarContext);
  if (!context) {
    throw new Error('useCategorySidebar must be used within a CategorySidebarProvider');
  }
  return context;
};

interface CategorySidebarProviderProps {
  children: ReactNode;
}

export const CategorySidebarProvider: React.FC<CategorySidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);
  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <CategorySidebarContext.Provider value={{
      isOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar
    }}>
      {children}
    </CategorySidebarContext.Provider>
  );
};
