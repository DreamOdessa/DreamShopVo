// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dreamshop-odessa.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dreamshop-odessa",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dreamshop-odessa.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "941215601569",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:941215601569:web:a4e5c1bb2892892bbc31e0",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-KZHPZJXTS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Инициализация сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Провайдеры аутентификации
export const googleProvider = new GoogleAuthProvider();

export default app;