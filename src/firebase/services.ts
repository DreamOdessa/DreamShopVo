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
  limit,
  startAfter,
  serverTimestamp,
  increment,
  DocumentSnapshot
} from 'firebase/firestore';
import { db } from './config';
import { Product, User, Order, Category } from '../types';
import { BugReport } from '../types/bugReport';

// Коллекции
const PRODUCTS_COLLECTION = 'products';
const USERS_COLLECTION = 'users';
const ORDERS_COLLECTION = 'orders';
const CATEGORIES_COLLECTION = 'categories';
const PRODUCT_VIEWS_COLLECTION = 'product_views'; // doc(productId) { viewCount }
const VISITORS_COLLECTION = 'visitors'; // daily visitor logs { visitorId, date, month, createdAt }
const SITE_SETTINGS_COLLECTION = 'site_settings'; // single doc 'main' { heroSubtitle }
const BUG_REPORTS_COLLECTION = 'bug_reports'; // bug reports from testers/admins

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

  // Получить ограниченное число товаров (для быстрой публичной загрузки)
  async getLimited(limitCount: number = 60): Promise<Product[]> {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Product[];
  },

  // Получить товары БЕЗ Spicer (для основного магазина)
  async getWithoutSpicer(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    return snapshot.docs
      .filter(doc => {
        const data = doc.data();
        return !data.brand || data.brand !== 'spicer';
      })
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
      })) as Product[];
  },

  // Получить ограниченное число товаров БЕЗ Spicer
  async getLimitedWithoutSpicer(limitCount: number = 60): Promise<Product[]> {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .filter(doc => {
        const data = doc.data();
        return !data.brand || data.brand !== 'spicer';
      })
      .slice(0, limitCount)
      .map(doc => ({
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
  },

  // Получить товары с пагинацией (для каталога)
  async getPaginated(limitCount: number = 20, lastDoc?: DocumentSnapshot): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null }> {
    let q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Product[];

    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { products, lastDoc: newLastDoc };
  },

  // Получить товары по категории с пагинацией
  async getByCategoryPaginated(category: string, limitCount: number = 20, lastDoc?: DocumentSnapshot): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null }> {
    let q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (lastDoc) {
      q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Product[];

    const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    return { products, lastDoc: newLastDoc };
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

  // Обновить пользователя (универсальный метод)
  async update(userId: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const cleanedData = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    await updateDoc(docRef, cleanedData);
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
  // Удалить заказ полностью
  async delete(id: string): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    await deleteDoc(docRef);
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

    // ✅ Уведомление отправляется автоматически Cloud Function: onOrderCreated
    // Серверная функция следит за новыми документами в orders/ и отправляет push админам
    // Это предотвращает дублирование и гарантирует доставку даже если клиент отвалится
    console.log('✅ Заказ создан. Cloud Function onOrderCreated отправит уведомление админам:', docRef.id);
    
    return docRef.id;
  },

  // Обновить статус заказа
  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    
    // Получаем данные заказа для уведомления
    const orderSnapshot = await getDoc(docRef);
    const orderData = orderSnapshot.data() as Order;
    
    await updateDoc(docRef, { status });
    
    // ✅ Уведомление отправляется автоматически Cloud Function: onOrderStatusUpdated
    // Серверная функция следит за изменениями в orders/{orderId} и отправляет push пользователю
    // Это предотвращает дублирование и гарантирует доставку даже если админ оффлайн
    console.log('✅ Статус обновлен. Cloud Function onOrderStatusUpdated отправит уведомление пользователю:', orderData.userId);
  }
};

// === ПРОСМОТРЫ ТОВАРОВ ===
export const productViewsService = {
  async incrementView(productId: string): Promise<void> {
    if (!productId) return;
    const docRef = doc(db, PRODUCT_VIEWS_COLLECTION, productId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      await updateDoc(docRef, { viewCount: increment(1), lastViewedAt: serverTimestamp() });
    } else {
      await setDoc(docRef, { viewCount: 1, createdAt: serverTimestamp(), lastViewedAt: serverTimestamp() });
    }
  },
  async getTopViewed(limitCount: number = 5): Promise<{ productId: string; viewCount: number }[]> {
    // Firestore не позволяет orderBy по несуществующему индексу без создания - предполагаем что index создан или будет создан
    const q = query(collection(db, PRODUCT_VIEWS_COLLECTION), orderBy('viewCount', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ productId: d.id, viewCount: d.data().viewCount || 0 }));
  },
  async getViewCount(productId: string): Promise<number> {
    const snap = await getDoc(doc(db, PRODUCT_VIEWS_COLLECTION, productId));
    return snap.exists() ? (snap.data().viewCount || 0) : 0;
  }
};

// === УНИКАЛЬНЫЕ ПОСЕТИТЕЛИ ===
export const visitorService = {
  async logVisit(visitorId: string): Promise<void> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const monthStr = now.toISOString().slice(0, 7); // YYYY-MM
    // Создаем документ с id `${dateStr}_${visitorId}` чтобы избежать дубликатов
    const docId = `${dateStr}_${visitorId}`;
    const docRef = doc(db, VISITORS_COLLECTION, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, { visitorId, date: dateStr, month: monthStr, createdAt: serverTimestamp() });
    }
  },
  async getCounts(): Promise<{ today: number; month: number }> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const monthStr = now.toISOString().slice(0, 7);
    const todayQ = query(collection(db, VISITORS_COLLECTION), where('date', '==', dateStr));
    const monthQ = query(collection(db, VISITORS_COLLECTION), where('month', '==', monthStr));
    const [todaySnap, monthSnap] = await Promise.all([getDocs(todayQ), getDocs(monthQ)]);
    return { today: todaySnap.size, month: monthSnap.size };
  }
};

// === НАСТРОЙКИ САЙТА (CMS) ===
export const siteSettingsService = {
  async getMain(): Promise<{ heroSubtitle: string } | null> {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return { heroSubtitle: data.heroSubtitle || '' };
    }
    return null;
  },
  async updateMain(values: { heroSubtitle: string }): Promise<void> {
    const docRef = doc(db, SITE_SETTINGS_COLLECTION, 'main');
    await setDoc(docRef, { heroSubtitle: values.heroSubtitle, updatedAt: serverTimestamp() }, { merge: true });
  }
};

// === BUG REPORTS (Feedback Tool) ===
export const bugReportService = {
  // Create a new bug report
  async create(data: Omit<BugReport, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      // Спроба 1: Використовуємо serverTimestamp()
      const docRef = await addDoc(collection(db, BUG_REPORTS_COLLECTION), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error: any) {
      // Якщо помилка транзакції (INTERNAL ASSERTION FAILED) - fallback на клієнтську дату
      if (error?.code === 'internal' || error?.message?.includes('INTERNAL ASSERTION')) {
        console.warn('⚠️ serverTimestamp() failed, using client timestamp:', error.message);
        const docRef = await addDoc(collection(db, BUG_REPORTS_COLLECTION), {
          ...data,
          status: 'new',
          createdAt: new Date() // Клієнтський timestamp замість серверного
        });
        return docRef.id;
      }
      // Інші помилки пробрасываем
      throw error;
    }
  },

  // Get all bug reports (for admin panel)
  async getAll(): Promise<BugReport[]> {
    const q = query(
      collection(db, BUG_REPORTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString()
    })) as BugReport[];
  },

  // Get a single bug report by ID
  async getById(id: string): Promise<BugReport | null> {
    const docRef = doc(db, BUG_REPORTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    
    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: snapshot.data().updatedAt?.toDate().toISOString()
    } as BugReport;
  },

  // Update bug report status
  async updateStatus(id: string, status: BugReport['status']): Promise<void> {
    const docRef = doc(db, BUG_REPORTS_COLLECTION, id);
    await updateDoc(docRef, { 
      status, 
      updatedAt: serverTimestamp() 
    });
  },

  // Delete bug report
  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, BUG_REPORTS_COLLECTION, id));
  }
};
