import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCXMn_UBfWmjBM4AvHTc0axVsYv6-FxaLQ",
  authDomain: "task-manager-najjar.firebaseapp.com",
  projectId: "task-manager-najjar",
  storageBucket: "task-manager-najjar.firebasestorage.app",
  messagingSenderId: "403956343190",
  appId: "1:403956343190:web:88fc5a19e98e4605a93db7",
  measurementId: "G-54KL69H8Z5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
