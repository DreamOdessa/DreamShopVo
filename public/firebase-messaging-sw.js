// Firebase Messaging Service Worker для фоновых уведомлений
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxCHgP-eF_xp1kPan6HtcYUCYCJBZc7VE",
  authDomain: "dreamshop-odessa.firebaseapp.com",
  projectId: "dreamshop-odessa",
  storageBucket: "dreamshop-odessa.appspot.com",
  messagingSenderId: "941215601569",
  appId: "1:941215601569:web:a4e5c1bb2892892bbc31e0",
  measurementId: "G-KZHPZJXTS1"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Обработка фоновых уведомлений
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'DreamShop';
  const notificationOptions = {
    body: payload.notification?.body || 'У вас новое уведомление',
    icon: payload.notification?.icon || '/logo192.png',
    badge: '/favicon.ico',
    data: payload.data || {},
    actions: [
      {
        action: 'open',
        title: 'Открыть'
      },
      {
        action: 'close',
        title: 'Закрыть'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
