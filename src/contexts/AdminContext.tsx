import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, User, Order, Category } from '../types';
import { productService, userService, orderService, categoryService } from '../firebase/services';
import toast from 'react-hot-toast';

interface AdminContextType {
  products: Product[];
  users: User[];
  orders: Order[];
  categories: Category[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  updateUserDiscount: (userId: string, discount: number) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);


  // Загрузка данных
  const loadData = async () => {
    try {
      setLoading(true);
      // Загружаем только публичные данные (товары и категории)
      // Users и Orders загрузятся только в AdminPanel при необходимости
      const [productsData, categoriesData] = await Promise.all([
        productService.getAll().catch(err => {
          console.error('Ошибка загрузки товаров:', err);
          return [];
        }),
        categoryService.getAll().catch(err => {
          console.error('Ошибка загрузки категорий:', err);
          return [];
        })
      ]);
      
      setProducts(productsData);
      setCategories(categoriesData);
      
      // Users и Orders загружаем только если нужно (не блокируем загрузку сайта)
      try {
        const [usersData, ordersData] = await Promise.all([
          userService.getAll(),
          orderService.getAll()
        ]);
        setUsers(usersData);
        setOrders(ordersData);
      } catch (error) {
        // Если не авторизован или нет прав - не страшно, сайт работает
        console.log('Пользователь не авторизован для загрузки users/orders');
      }
    } catch (error) {
      console.error('Помилка завантаження даних:', error);
      // Убрали toast.error - не пугаем пользователя при первой загрузке
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      await productService.create(productData);
      await loadData();
      toast.success('Товар додано!');
    } catch (error) {
      console.error('Помилка додавання товару:', error);
      toast.error('Помилка додавання товару');
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      await productService.update(id, productData);
      await loadData();
      toast.success('Товар оновлено!');
    } catch (error) {
      console.error('Помилка оновлення товару:', error);
      toast.error('Помилка оновлення товару');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productService.delete(id);
      await loadData();
      toast.success('Товар видалено!');
    } catch (error) {
      console.error('Помилка видалення товару:', error);
      toast.error('Помилка видалення товару');
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      await categoryService.create(categoryData);
      await loadData();
      toast.success('Категорію додано!');
    } catch (error) {
      console.error('Помилка додавання категорії:', error);
      toast.error('Помилка додавання категорії');
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      await categoryService.update(id, categoryData);
      await loadData();
      toast.success('Категорію оновлено!');
    } catch (error) {
      console.error('Помилка оновлення категорії:', error);
      toast.error('Помилка оновлення категорії');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoryService.delete(id);
      await loadData();
      toast.success('Категорію видалено!');
    } catch (error) {
      console.error('Помилка видалення категорії:', error);
      toast.error('Помилка видалення категорії');
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      await userService.update(userId, updates);
      await loadData();
      toast.success('Користувач оновлено!');
    } catch (error) {
      console.error('Помилка оновлення користувача:', error);
      toast.error('Помилка оновлення користувача');
    }
  };

  const updateUserDiscount = async (userId: string, discount: number) => {
    try {
      await userService.updateDiscount(userId, discount);
      await loadData();
      toast.success('Знижку оновлено!');
    } catch (error) {
      console.error('Помилка оновлення знижки:', error);
      toast.error('Помилка оновлення знижки');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await orderService.updateStatus(orderId, status);
      await loadData();
      toast.success('Статус замовлення оновлено!');
    } catch (error) {
      console.error('Помилка оновлення статусу:', error);
      toast.error('Помилка оновлення статусу');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await orderService.delete(orderId);
      await loadData();
      toast.success('Замовлення видалено!');
    } catch (error) {
      console.error('Помилка видалення замовлення:', error);
      toast.error('Помилка видалення замовлення');
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const value = {
    products,
    users,
    orders,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    updateUser,
    updateUserDiscount,
    updateOrderStatus,
    deleteOrder,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};