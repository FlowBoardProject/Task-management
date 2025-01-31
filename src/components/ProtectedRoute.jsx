import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const LoadingSpinner = ({ size = "md", color = "blue" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-500",
    red: "border-red-500",
    green: "border-green-500",
    purple: "border-purple-500",
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`
          ${sizeClasses[size]}
          border-4
          border-t-transparent
          ${colorClasses[color]}
          rounded-full
          animate-spin
        `}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If a user is logged in, fetch their role
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const role = snapshot.val().role;
          console.log("User role:", role); // Debug: Log the role
          setUserRole(role);
        } else {
          console.log("No role found for user:", user.uid); // Debug: Log if no role is found
        }
      } else {
        console.log("No user is logged in"); // Debug: Log if no user is logged in
      }
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    console.log("Loading..."); // Debug: Log loading state
    return <LoadingSpinner size="lg" color="blue" />;
  }

  console.log("User role after loading:", userRole); // Debug: Log user role

  // If the user is not a manager, redirect to the home page
  if (userRole !== "manager") {
    console.log("Redirecting to / because role is not manager"); // Debug: Log redirection
    return <Navigate to="/" replace />;
  }

  // If the user is a manager, render the children
  return children;
};

export default ProtectedRoute;
