
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mycodex-4c426.firebaseapp.com",
  projectId: "mycodex-4c426",
  storageBucket: "mycodex-4c426.firebasestorage.app",
  messagingSenderId: "33967556897",
  appId: "1:33967556897:web:c2528531dc22bdce0e1660",
  measurementId: "G-HJJD5QR68Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();