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
    await updateDoc(docRef, product);
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
    await updateDoc(docRef, category);
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
    
    try {
      // Пытаемся обновить существующий документ
      await updateDoc(docRef, userData);
      console.log(`✅ Пользователь ${user.email} обновлен`);
    } catch (error) {
      // Если документ не существует, создаем его с конкретным ID
      try {
        await setDoc(docRef, userData);
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
    const q = query(
      collection(db, ORDERS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Order[];
  },

  // Создать заказ
  async create(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Обновить статус заказа
  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await updateDoc(docRef, { status });
  }
};
