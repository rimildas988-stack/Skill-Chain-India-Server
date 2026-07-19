import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Load Firebase config from environment variables
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "remixed-project-id",
  appId: process.env.FIREBASE_APP_ID || "remixed-app-id",
  apiKey: process.env.FIREBASE_API_KEY || "remixed-api-key",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "remixed-auth-domain",
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "remixed-storage-bucket",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "remixed-messaging-sender-id",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "remixed-measurement-id"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const db: Firestore = getFirestore(firebaseApp);
const auth: Auth = getAuth(firebaseApp);
const storage: FirebaseStorage = getStorage(firebaseApp);

// Enable offline persistence in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Firebase initialized in development mode');
} else {
  console.log('Firebase initialized in production mode');
}

export { firebaseApp, db, auth, storage };
