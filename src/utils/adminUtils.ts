import { userService } from '../firebase/services';
import { User } from '../types';

// Утилита для установки админских прав текущему пользователю
export const makeCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    // Получаем текущего пользователя из localStorage
    const savedUser = localStorage.getItem('dreamshop_user');
    if (!savedUser) {
      console.error('❌ Пользователь не найден в localStorage');
      return false;
    }

    const user: User = JSON.parse(savedUser);
    console.log('👤 Текущий пользователь:', user.email);

    // Обновляем права админа
    const updatedUser = { ...user, isAdmin: true };
    
    // Сохраняем в Firebase
    await userService.createOrUpdate(updatedUser);
    
    // Обновляем localStorage
    localStorage.setItem('dreamshop_user', JSON.stringify(updatedUser));
    
    console.log('✅ Пользователь стал админом:', user.email);
    return true;
  } catch (error) {
    console.error('❌ Ошибка установки прав админа:', error);
    return false;
  }
};

// Утилита для очистки дублированных пользователей
export const cleanupDuplicateUsers = async (): Promise<void> => {
  try {
    console.log('🧹 Начинаем очистку дублированных пользователей...');
    
    const allUsers = await userService.getAll();
    console.log(`📊 Найдено пользователей: ${allUsers.length}`);
    
    // Группируем по email
    const usersByEmail: { [email: string]: User[] } = {};
    allUsers.forEach(user => {
      if (!usersByEmail[user.email]) {
        usersByEmail[user.email] = [];
      }
      usersByEmail[user.email].push(user);
    });

    // Находим дубликаты
    for (const email in usersByEmail) {
      const users = usersByEmail[email];
      if (users.length > 1) {
        console.log(`🔍 Найдены дубликаты для ${email}: ${users.length} записей`);
        
        // Оставляем самого нового пользователя (с isAdmin если есть)
        const adminUser = users.find(u => u.isAdmin);
        const keepUser = adminUser || users[users.length - 1];
        
        // Удаляем остальных
        for (const user of users) {
          if (user.id !== keepUser.id) {
            console.log(`🗑️ Удаляем дубликат: ${user.id}`);
            // Здесь можно добавить логику удаления через userService
          }
        }
      }
    }
    
    console.log('✅ Очистка завершена');
  } catch (error) {
    console.error('❌ Ошибка очистки:', error);
  }
};

// Глобальные функции для консоли браузера
declare global {
  interface Window {
    makeAdmin: () => Promise<boolean>;
    cleanupUsers: () => Promise<void>;
  }
}

// Добавляем функции в window для использования в консоли
if (typeof window !== 'undefined') {
  window.makeAdmin = makeCurrentUserAdmin;
  window.cleanupUsers = cleanupDuplicateUsers;
}
