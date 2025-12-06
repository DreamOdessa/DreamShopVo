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
      console.log('🔄 Завантаження даних...');
      setLoading(true);
      const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      // Загружаем ВСЕ товары (включая Spicer) для витрины на главной странице
      // Фильтрация Spicer будет происходить на странице Products
      const productsPromise = productService.getAll();

      const categoriesPromise = categoryService.getAll().catch(err => {
        console.error('❌ Ошибка загрузки категорий:', err);
        return [] as Category[];
      });

      const [productsData, categoriesData] = await Promise.all([
        productsPromise.catch(err => {
          console.error('❌ Ошибка загрузки товаров:', err);
          return [] as Product[];
        }),
        categoriesPromise
      ]);

      console.log(`✅ Завантажено товарів: ${productsData.length}`);
      console.log(`✅ Завантажено категорій: ${categoriesData.length}`);
      
      if (productsData.length > 0) {
        console.log('📝 Перші товари:', productsData.slice(0, 2).map(p => ({ name: p.name, category: p.category, isActive: p.isActive })));
      } else {
        console.warn('⚠️ ТОВАРИ НЕ ЗАВАНТАЖЕНІ! Натисніть на адмін-панелі кнопку "Импортировать товары"');
      }
      
      setProducts(productsData);
      setCategories(categoriesData);

      // Загружаем пользователей и заказы только в админке
      if (isAdmin) {
        try {
          const [usersData, ordersData] = await Promise.all([
            userService.getAll(),
            orderService.getAll()
          ]);
          setUsers(usersData);
          setOrders(ordersData);
        } catch (error) {
          console.log('ℹ️ Не удалось загрузить users/orders (не авторизован или нет прав)');
        }
      }
    } catch (error) {
      console.error('❌ КРИТИЧНА ПОМИЛКА при завантаженні даних:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      console.log('Додавання товару...', productData);
      const newProductId = await productService.create(productData);
      console.log('Товар створено з ID:', newProductId);
      
      // Небольшая задержка для eventual consistency Firestore
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await loadData();
      toast.success('Товар додано!');
    } catch (error) {
      console.error('Помилка додавання товару:', error);
      toast.error(`Помилка додавання товару: ${error instanceof Error ? error.message : 'Невідома помилка'}`);
      throw error;
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