import { initializeApp } from 'firebase/app';
import { getAuth, Auth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCEjMAeZAtgRyhGqPIqEd5Rcy4KJH4IYog",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skill-chain-india.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skill-chain-india",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skill-chain-india.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1058823004215",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1058823004215:web:42b675f0fc8f34a2eedfb2",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-PMEYB8PS6E"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth: Auth = getAuth(firebaseApp);
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);

// Initialize Analytics (optional)
try {
  const analytics = getAnalytics(firebaseApp);
  console.log('Firebase Analytics initialized');
} catch (err) {
  console.log('Firebase Analytics not available in this environment');
}

// Auth state listener
export const setupAuthListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

// Export app for other uses
export default firebaseApp;
