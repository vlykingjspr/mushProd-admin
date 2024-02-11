// Import the functions you need from the SDKs you need
import { getApp, getApps } from "firebase/app";
import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp()
}

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const realdb = getDatabase();
// export const messaging = getMessaging(firebaseApp);
