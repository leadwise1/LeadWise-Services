import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAhPL7NMbpHzbHN9kXKG_UKynyl7MNsJnw",
  authDomain: "leadwise-services-rule.firebaseapp.com",
  projectId: "leadwise-services-rule",
  storageBucket: "leadwise-services-rule.firebasestorage.app",
  messagingSenderId: "172388746691",
  appId: "1:172388746691:web:98e02ee0f8cdc4c390a976",
  measurementId: "G-FNP78P4T9L"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
