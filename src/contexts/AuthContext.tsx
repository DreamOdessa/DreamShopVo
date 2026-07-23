import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { signInWithGoogle, signOutUser, onAuthStateChange } from '../firebase/auth';
import { userService } from '../firebase/services';

interface AuthContextType {
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем redirect result при первой загрузке
    const initAuth = async () => {
      console.log('🔐 Инициализация Auth...');
      console.log('📱 User Agent:', navigator.userAgent);
      console.log('🌐 Location:', window.location.href);
      
      try {
        const { checkRedirectResult } = await import('../firebase/auth');
        const redirectUser = await checkRedirectResult();
        if (redirectUser) {
          console.log('✅ Пользователь получен из redirect:', redirectUser.email);
          setUser(redirectUser);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('❌ Ошибка проверки redirect:', error);
      }
      
      console.log('👂 Подписываемся на изменения auth...');
    };
    
    initAuth();
    
    const unsubscribe = onAuthStateChange(async (user) => {
      console.log('🔄 Auth state changed:', user?.email || 'null');
      if (user) {
        // Загружаем полные данные пользователя из Firestore
        try {
          const fullUserData = await userService.getById(user.id);
          if (fullUserData) {
            // Обновляем данные в localStorage
            const profileData = {
              name: fullUserData.name,
              lastName: fullUserData.lastName,
              phone: fullUserData.phone,
              city: fullUserData.city,
              novaPoshtaOffice: fullUserData.novaPoshtaOffice,
              address: fullUserData.address,
              establishmentName: fullUserData.establishmentName,
              isPrivatePerson: fullUserData.isPrivatePerson
            };
            localStorage.setItem('dreamshop_profile', JSON.stringify(profileData));
            setUser(fullUserData);
          } else {
            setUser(user);
          }
        } catch (error) {
          console.error('❌ Ошибка загрузки данных пользователя:', error);
          setUser(user);
        }
      } else {
        setUser(null);
        // Очищаем данные профиля при выходе
        localStorage.removeItem('dreamshop_profile');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Страховка: если onAuthStateChange зависнет на мобильных (из-за ограничений хранилища),
  // снимаем лоадер через несколько секунд, чтобы публичные страницы открывались.
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 3500);
    return () => clearTimeout(t);
  }, [loading]);

  const login = async () => {
    try {
      console.log('🔑 Login initiated from UI');
      setLoading(true);
      const userData = await signInWithGoogle();
      if (!userData) {
        return;
      }

      console.log('✅ signInWithGoogle returned:', userData.email);
      
      // Загружаем полные данные пользователя из Firestore
      try {
        const fullUserData = await userService.getById(userData.id);
        if (fullUserData) {
          // Обновляем данные в localStorage
          const profileData = {
            name: fullUserData.name,
            lastName: fullUserData.lastName,
            phone: fullUserData.phone,
            city: fullUserData.city,
            novaPoshtaOffice: fullUserData.novaPoshtaOffice,
            address: fullUserData.address,
            establishmentName: fullUserData.establishmentName,
            isPrivatePerson: fullUserData.isPrivatePerson
          };
          localStorage.setItem('dreamshop_profile', JSON.stringify(profileData));
          setUser(fullUserData);
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        setUser(userData);
      }
    } catch (error: any) {
      console.error('❌ Помилка входу:', error);
      console.error('❌ Error code:', error?.code);
      console.error('❌ Error message:', error?.message);
      const errorMsg = `Auth Error: ${error?.code || 'unknown'} - ${error?.message || 'Unknown error'}`;
      alert(errorMsg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOutUser();
      setUser(null);
      // Очищаем данные профиля при выходе
      localStorage.removeItem('dreamshop_profile');
    } catch (error) {
      console.error('Помилка виходу:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
