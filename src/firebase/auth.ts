import { 
  signInWithPopup, 
  signInWithRedirect,
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { userService } from './services';
import { User } from '../types';

// Преобразование Firebase User в наш User
const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || 'Користувач',
  email: firebaseUser.email || '',
  avatar: firebaseUser.photoURL || undefined,
  discount: 0,
  isAdmin: false // По умолчанию не админ, можно настроить через базу данных
});

// Вход через Google
export const signInWithGoogle = async (): Promise<User> => {
  try {
    console.log('🔄 Начинаем вход через Google...');
    console.log('🔧 Auth domain:', auth.app.options.authDomain);
    console.log('🔧 Project ID:', auth.app.options.projectId);
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    let result;
    if (isMobile) {
      console.log('📱 Мобильное устройство: используем signInWithRedirect');
      await signInWithRedirect(auth, googleProvider);
      // Возвращаем заглушку; фактический пользователь придет через onAuthStateChanged после редиректа
      return mapFirebaseUser({
        uid: 'redirect_pending',
        displayName: 'Redirecting',
        email: '',
        photoURL: undefined,
        providerData: [],
        phoneNumber: null,
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => '',
        getIdTokenResult: async () => ({
          authTime: '',
          expirationTime: '',
          issuedAtTime: '',
          signInProvider: '',
          signInSecondFactor: null,
          claims: {}
        }),
        reload: async () => {},
        isAnonymous: false,
        metadata: { creationTime: '', lastSignInTime: '' },
        providerId: 'google',
        emailVerified: false
      } as any);
    } else {
      result = await signInWithPopup(auth, googleProvider);
    }
    console.log('✅ Google auth успешно:', result.user.email);
    
    // Проверяем, есть ли пользователь в базе данных
    const existingUser = await userService.getById(result.user.uid);
    let user;
    
    if (existingUser) {
      // Если пользователь существует, обновляем только основные данные, сохраняя права администратора
      console.log('👤 Обновляем существующего пользователя');
      user = {
        ...existingUser,
        // Сохраняем имя из базы, а Google-имя используем только как резервное
        name: existingUser.name || result.user.displayName || 'Користувач',
        email: result.user.email || existingUser.email,
        avatar: result.user.photoURL || existingUser.avatar
      };
    } else {
      // Если пользователя нет, создаем нового
      console.log('➕ Создаем нового пользователя');
      user = mapFirebaseUser(result.user);
    }
    
    // Сохраняем пользователя в базе данных
    await userService.createOrUpdate(user);
    console.log('💾 Пользователь сохранен в базе данных');
    
    return user;
  } catch (error) {
    console.error('❌ Помилка входу через Google:', error);
    console.error('❌ Детали ошибки:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Выход
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Помилка виходу:', error);
    throw error;
  }
};

// Слушатель изменений состояния аутентификации
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      console.log('🔐 Firebase пользователь вошел:', firebaseUser.email);
      
      // Получаем данные пользователя из базы данных
      const userData = await userService.getById(firebaseUser.uid);
      if (userData) {
        console.log('✅ Пользователь найден в базе:', userData.email);
        // Обновляем только основные данные, сохраняя права администратора
        const updatedUser = {
          ...userData,
          // Не затираем имя из базы, используем Google-имя только если в базе пусто
          name: userData.name || firebaseUser.displayName || 'Користувач',
          email: firebaseUser.email || userData.email,
          avatar: firebaseUser.photoURL || userData.avatar
        };
        await userService.createOrUpdate(updatedUser);
        callback(updatedUser);
      } else {
        // Если пользователя нет в базе, создаем его
        console.log('➕ Создаем нового пользователя в базе');
        const user = mapFirebaseUser(firebaseUser);
        await userService.createOrUpdate(user);
        callback(user);
      }
    } else {
      console.log('🚪 Пользователь вышел');
      callback(null);
    }
  });
};
