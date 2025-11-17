import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import { sendNotificationToAdmins } from '../utils/notificationUtils';
import { sendNotificationToUser } from '../utils/notificationUtils';
import { Product, User, Order, Category } from '../types';

// Коллекции
const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';
const CATEGORIES_COLLECTION = 'categories';

// === ТОВАРЫ ===
export const productService = {
  // Получить все товары
  async getAll(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Product[];
  },

  // Получить товар по ID
  async getById(id: string): Promise<Product | null> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      } as Product;
    }
    return null;
  },

  // Добавить товар
  async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Обновить товар
  async update(id: string, product: Partial<Product>): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    // Удаляем undefined поля, т.к. Firestore их не принимает
    const cleanedData = Object.fromEntries(
      Object.entries(product).filter(([_, value]) => value !== undefined)
    );
    await updateDoc(docRef, cleanedData);
  },

  // Удалить товар
  async delete(id: string): Promise<void> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Получить товары по категории
  async getByCategory(category: string): Promise<Product[]> {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Product[];
  }
};

// === КАТЕГОРИИ ===
export const categoryService = {
  // Получить все категории
  async getAll(): Promise<Category[]> {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  // Добавить категорию
  async create(category: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), category);
    return docRef.id;
  },

  // Обновить категорию
  async update(id: string, category: Partial<Category>): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    const cleanedData = Object.fromEntries(
      Object.entries(category).filter(([_, value]) => value !== undefined)
    );
    await updateDoc(docRef, cleanedData);
  },

  // Удалить категорию
  async delete(id: string): Promise<void> {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  }
};

// === ПОЛЬЗОВАТЕЛИ ===
export const userService = {
  // Получить пользователя по ID
  async getById(id: string): Promise<User | null> {
    const docRef = doc(db, USERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as User;
    }
    return null;
  },

  // Создать или обновить пользователя
  async createOrUpdate(user: User): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, user.id);
    const userData = { ...user };
    const cleanedData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== undefined)
    );
    
    try {
      // Пытаемся обновить существующий документ
      await updateDoc(docRef, cleanedData);
      console.log(`✅ Пользователь ${user.email} обновлен`);
    } catch (error) {
      // Если документ не существует, создаем его с конкретным ID
      try {
        await setDoc(docRef, cleanedData);
        console.log(`✅ Пользователь ${user.email} создан с ID: ${user.id}`);
      } catch (setError) {
        console.error('❌ Ошибка создания пользователя:', setError);
        throw setError;
      }
    }
  },

  // Обновить скидку пользователя
  async updateDiscount(userId: string, discount: number): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(docRef, { discount });
  },

  // Получить всех пользователей (только для админов)
  async getAll(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[];
  }
};

// === ЗАКАЗЫ ===
export const orderService = {
  // Получить все заказы
  async getAll(): Promise<Order[]> {
    const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Order[];
  },

  // Получить заказы пользователя
  async getByUserId(userId: string): Promise<Order[]> {
    if (!userId) {
      throw new Error('ID пользователя не указан');
    }
    
    // Используем только фильтр по userId без orderBy, чтобы не требовать композитный индекс.
    // Сортировку по createdAt выполним на клиенте.
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        // Обеспечиваем совместимость со старой структурой
        items: data.items || [],
        total: data.total || 0,
        status: data.status || 'pending',
        customerInfo: data.customerInfo || {},
        deliveryInfo: data.deliveryInfo || {},
        paymentInfo: data.paymentInfo || {},
        shippingAddress: data.shippingAddress || {}
      } as Order;
    });
    // Сортируем по дате создания по убыванию
    return orders.sort((a, b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  },

  // Создать заказ
  async create(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    // Очищаем объект от undefined значений
    const cleanOrder = JSON.parse(JSON.stringify(order, (key, value) => {
      return value === undefined ? null : value;
    }));
    
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...cleanOrder,
      createdAt: serverTimestamp()
    });

    // Отправляем уведомление админам о новом заказе (после успешного создания)
    try {
      await sendNotificationToAdmins({
        title: '🛒 Новый заказ!',
        body: `Заказ #${docRef.id.substring(0, 8)} на сумму ${order.total} ₴`,
        icon: '/logo192.png',
        clickAction: '/admin',
        data: {
          orderId: docRef.id,
          type: 'new_order'
        }
      });
    } catch (error) {
      console.error('Ошибка отправки уведомления админам:', error);
    }
    return docRef.id;
  },

  // Обновить статус заказа
  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    
    // Получаем данные заказа для уведомления
    const orderSnapshot = await getDoc(docRef);
    const orderData = orderSnapshot.data() as Order;
    
    await updateDoc(docRef, { status });
    
    // Отправляем уведомление пользователю об изменении статуса
    if (orderData && orderData.userId) {
      const statusMessages: Record<Order['status'], string> = {
        pending: 'Ваш заказ ожидает обработки',
        processing: 'Ваш заказ обрабатывается',
        shipped: 'Ваш заказ отправлен',
        delivered: 'Ваш заказ доставлен!',
        cancelled: 'Ваш заказ отменен'
      };
      
      try {
        await sendNotificationToUser(orderData.userId, {
          title: '📦 Статус заказа изменен',
          body: statusMessages[status] || `Статус: ${status}`,
          icon: '/logo192.png',
          clickAction: '/orders',
          data: {
            orderId: id,
            status,
            type: 'order_status_update'
          }
        });
      } catch (error) {
        console.error('Ошибка отправки уведомления пользователю:', error);
      }
    }
  }
};
