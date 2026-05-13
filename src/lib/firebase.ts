import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only once, but only if we have an API key (prevents build-time crashes)
const app = (getApps().length === 0 && firebaseConfig.apiKey) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApps()[0] : null);

const db = app ? getFirestore(app) : null as any;
const auth = app ? getAuth(app) : null as any;

export { db, auth, app };
