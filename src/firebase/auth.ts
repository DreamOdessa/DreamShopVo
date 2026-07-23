import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
  isAdmin: false
});

// Проверка результата redirect при загрузке приложения
export const checkRedirectResult = async (): Promise<User | null> => {
  try {
    console.log('🔍 Проверяем результат redirect...');
    const result = await getRedirectResult(auth);
    if (!result?.user) {
      console.log('ℹ️ Нет pending redirect');
      return null;
    }
    console.log('✅ Redirect успешен:', result.user.email);
    const existingUser = await userService.getById(result.user.uid);
    let user: User;
    if (existingUser) {
      user = {
        ...existingUser,
        name: existingUser.name || result.user.displayName || 'Користувач',
        email: result.user.email || existingUser.email,
        avatar: result.user.photoURL || existingUser.avatar
      };
    } else {
      user = mapFirebaseUser(result.user);
    }
    await userService.createOrUpdate(user);
    return user;
  } catch (error) {
    console.error('❌ Ошибка при проверке redirect:', error);
    return null;
  }
};

// Вход через Google (popup сначала, redirect как фолбэк)
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    console.log('🔄 Начинаем вход через Google...');
    console.log('🔧 Auth domain:', auth.app.options.authDomain);
    console.log('🔧 Project ID:', auth.app.options.projectId);
    console.log('🔧 User Agent:', navigator.userAgent);
    console.log('🔧 Window location:', window.location.href);

    let result;
    try {
      console.log('🪟 Пробуем signInWithPopup...');
      result = await signInWithPopup(auth, googleProvider);
      console.log('✅ Popup success');
    } catch (e: any) {
      console.warn('⚠️ Popup auth failed:', e?.code, e?.message);
      if (
        e?.code === 'auth/popup-blocked' ||
        e?.code === 'auth/popup-closed-by-user' ||
        e?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        console.log('↪️ Переключаемся на signInWithRedirect');
        await signInWithRedirect(auth, googleProvider);
        return null;
      }
      throw e;
    }

    console.log('✅ Google auth успешно:', result.user.email);
    const existingUser = await userService.getById(result.user.uid);
    let user: User;
    if (existingUser) {
      user = {
        ...existingUser,
        name: existingUser.name || result.user.displayName || 'Користувач',
        email: result.user.email || existingUser.email,
        avatar: result.user.photoURL || existingUser.avatar
      };
    } else {
      user = mapFirebaseUser(result.user);
    }
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
    try {
      if (firebaseUser) {
        console.log('🔐 Firebase пользователь вошел:', firebaseUser.email);

        const userData = await userService.getById(firebaseUser.uid);
        if (userData) {
          console.log('✅ Пользователь найден в базе:', userData.email);
          const updatedUser = {
            ...userData,
            name: userData.name || firebaseUser.displayName || 'Користувач',
            email: firebaseUser.email || userData.email,
            avatar: firebaseUser.photoURL || userData.avatar
          };
          await userService.createOrUpdate(updatedUser);
          callback(updatedUser);
        } else {
          console.log('➕ Создаем нового пользователя в базе');
          const user = mapFirebaseUser(firebaseUser);
          await userService.createOrUpdate(user);
          callback(user);
        }
      } else {
        console.log('🚪 Пользователь вышел');
        callback(null);
      }
    } catch (error) {
      console.error('Ошибка синхронизации пользователя:', error);
      callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    }
  });
};
