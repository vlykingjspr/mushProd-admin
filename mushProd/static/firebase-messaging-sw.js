importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyB6oe9cID6r5VG6dPcYGylqD0eTFXwULNQ',
    authDomain: 'betapeak-1b551.firebaseapp.com',
    databaseURL: 'https://betapeak-1b551-default-rtdb.asia-southeast1.firebasedatabase.app/',
    projectId: 'betapeak-1b551',
    storageBucket: 'betapeak-1b551.appspot.com',
    messagingSenderId: '442665321534',
    appId: '1:442665321534:web:10bc3c8a7112a8c4fc7d6f',
    measurementId: 'G-X9CJXFEGY5'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();


messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});