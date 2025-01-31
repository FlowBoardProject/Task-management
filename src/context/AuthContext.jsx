import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Ensure `db` is initialized for Realtime Database
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database"; // Import Realtime Database functions

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user data from Realtime Database
        const userRef = ref(db, `users/${user.uid}`); // Path to user data
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser({ ...user, ...userData }); // Combine auth user and Realtime Database data
        } else {
          setUser(user); // Fallback to auth user if no additional data is found
        }
      } else {
        setUser(null); // No user is signed in
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
