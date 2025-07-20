import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBngJ-h3pgTPb28va_ajngUoFpfCMi5Tic",
  authDomain: "proof-of-hustle-41efb.firebaseapp.com",
  projectId: "proof-of-hustle-41efb",
  storageBucket: "proof-of-hustle-41efb.firebasestorage.app",
  messagingSenderId: "488138387004",
  appId: "1:488138387004:web:cdf10bedc85e611b5edd39",
  measurementId: "G-S09EJ5137P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;