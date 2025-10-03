import { 
  signInWithPopup, 
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
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log('✅ Google auth успешно:', result.user.email);
    
    const user = mapFirebaseUser(result.user);
    
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
        callback(userData);
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
