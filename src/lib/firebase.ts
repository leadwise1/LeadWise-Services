import { initializeApp, getApps } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn("Firebase configuration: NEXT_PUBLIC_FIREBASE_API_KEY is missing.");
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
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true, // Add this line if you experience persistent WebChannel errors
});
const auth = getAuth(app);

export { db, auth, app };
