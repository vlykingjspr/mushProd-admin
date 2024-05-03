importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyB6oe9cID6r5VG6dPcYGylqD0eTFXwULNQ",
    authDomain: "betapeak-1b551.firebaseapp.com",
    databaseURL: "https://betapeak-1b551-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "betapeak-1b551",
    storageBucket: "betapeak-1b551.appspot.com",
    messagingSenderId: "442665321534",
    appId: "1:442665321534:web:10bc3c8a7112a8c4fc7d6f",
    measurementId: "G-X9CJXFEGY5"
    // apiKey: import.meta.env.VITE_APIKEY,
    // authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    // databaseURL: import.meta.env.VITE_DB_URL,
    // projectId: import.meta.env.VITE_PROJECT_ID,
    // storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    // messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    // appId: import.meta.env.VITE_APP_ID,
    // measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };


  firebaseConfig.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage(payload => {
    console.log('Received background message 2', payload);
  
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  