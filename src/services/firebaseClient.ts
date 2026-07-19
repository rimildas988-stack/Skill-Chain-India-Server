import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Initialize Analytics (optional)
try {
  const analytics = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
} catch (err) {
  console.log('ℹ️ Firebase Analytics not available in this environment');
}

// Log Firebase initialization
console.log('✅ Firebase initialized successfully');
console.log('Project:', firebaseConfig.projectId);

export default app;
