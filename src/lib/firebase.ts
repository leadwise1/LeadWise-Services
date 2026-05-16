import { initializeApp, getApps } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("Firebase API Key is missing. Check your Vercel Environment Variables.");
  }
  console.warn("Firebase configuration: NEXT_PUBLIC_FIREBASE_API_KEY is missing in local dev.");
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 
  authDomain: "leadwise-services-rule.firebaseapp.com",
  projectId: "leadwise-services-rule",
  storageBucket: "leadwise-services-rule.firebasestorage.app",
  messagingSenderId: "172388746691",
  appId: "1:172388746691:web:98e02ee0f8cdc4c390a976",
  measurementId: "G-FNP78P4T9L"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]; 

// Using initializeFirestore allows for specific settings like long polling
// which helps students on restricted school or corporate networks.
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const auth = getAuth(app);

export { db, auth, app };
