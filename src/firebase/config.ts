// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // Отключено для избежания неиспользуемого импорта
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getPerformance } from 'firebase/performance';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dreamshop-odessa.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dreamshop-odessa",
  // Исправлено имя bucket: должно быть projectId + '.appspot.com'
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dreamshop-odessa.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "941215601569",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:941215601569:web:a4e5c1bb2892892bbc31e0",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-KZHPZJXTS1"
};

// VAPID ключ для Web Push уведомлений (FCM)
// Получить: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates → Generate key pair
export const FIREBASE_VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY || "BIHiR_I7lAdFsAAQQZzU4ScS78H7oB84HqoCAx1E9xfY5WSiMCKGdKq3xVkXZ2OXH6XGHMWwwMCBfe_0fwvPEks";

console.log('🔧 Initializing Firebase with explicit config (не загружаем из reserved URLs)');
console.log('🔧 Auth Domain:', firebaseConfig.authDomain);
console.log('🔧 Project ID:', firebaseConfig.projectId);

// Initialize Firebase
const app = initializeApp(firebaseConfig, {
  // Явно указываем имя приложения чтобы избежать автозагрузки конфига
  name: 'dreamshop-main'
});

console.log('✅ Firebase app initialized:', app.name);
// const analytics = getAnalytics(app); // Отключено для избежания неиспользуемой переменной

// Инициализация сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);

// Инициализация Performance Monitoring для отслеживания производительности
let perf;
try {
  perf = getPerformance(app);
  console.log('✅ Firebase Performance Monitoring enabled');
} catch (error) {
  console.warn('⚠️ Performance Monitoring не удалось инициализировать:', error);
}
export const performance = perf;

// Провайдеры аутентификации
export const googleProvider = new GoogleAuthProvider();

// Настройка устойчивости с безопасным фолбэком для мобильных браузеров
// Если постоянное хранилище недоступно (например, iOS Private Mode), используем in-memory
setPersistence(auth, browserLocalPersistence).catch(() => setPersistence(auth, inMemoryPersistence));

// Включаем офлайн-персистентність (кэш запросов) для ускорения повторных посещений
// ВАЖЛИВО: Офлайн кеш може конфліктувати з операціями запису в деяких браузерах
// Якщо виникають помилки типу "INTERNAL ASSERTION FAILED", розгляньте вимкнення persistence
const ENABLE_OFFLINE_PERSISTENCE = true; // Встановіть false для відладки помилок транзакцій

if (ENABLE_OFFLINE_PERSISTENCE) {
  try {
    enableIndexedDbPersistence(db).then(() => {
      console.log('✅ Firestore offline persistence enabled');
    }).catch(err => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Persistence: Multiple tabs open, persistence enabled in first tab only');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Persistence: Browser doesn\'t support IndexedDB');
      } else {
        console.warn('⚠️ Persistence not enabled:', err.code, err.message);
      }
    });
  } catch (e) {
    console.warn('⚠️ Persistence init failed:', e);
  }
} else {
  console.log('ℹ️ Firestore offline persistence disabled (debug mode)');
}

export default app;
