import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCK5X7DEcjiS7uCAwe9gQQ9CA572pOkpuc",
  authDomain: "task-management-833ae.firebaseapp.com",
  databaseURL: "https://task-management-833ae-default-rtdb.firebaseio.com", // Realtime Database URL
  projectId: "task-management-833ae",
  storageBucket: "task-management-833ae.appspot.com",
  messagingSenderId: "272504848477",
  appId: "1:272504848477:web:d8049a9394a1e11dc60db4",
  measurementId: "G-L1N1DEQZBY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app); // Use getDatabase for Realtime Database
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
