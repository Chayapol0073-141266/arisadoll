import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAwuo4Mn2Pq3KO-HJ6tJCy21Ik45k7MADQ",
  authDomain: "arisadb-b8936.firebaseapp.com",
  projectId: "arisadb-b8936",
  storageBucket: "arisadb-b8936.firebasestorage.app",
  messagingSenderId: "227600459327",
  appId: "1:227600459327:web:6b5470d6bcd670c72e3a8a",
  measurementId: "G-T8GTL5Z049"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export default app;
