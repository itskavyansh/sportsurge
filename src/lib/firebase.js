// ─────────────────────────────────────────────
// PASTE YOUR FIREBASE CONFIG HERE
// Firebase Console → Project Settings → Your Apps → Web → firebaseConfig
// ─────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd4q6HkT-xkHEu9OnCQwG40LjJqLYCFB4",
  authDomain: "sportsurge-67ae8.firebaseapp.com",
  projectId: "sportsurge-67ae8",
  storageBucket: "sportsurge-67ae8.firebasestorage.app",
  messagingSenderId: "49908045408",
  appId: "1:49908045408:web:aa36de6cb23126d6451505"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
