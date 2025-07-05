import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export default function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);
  if (user === undefined) return null; // ou um loading
  return user ? children : <Navigate to="/login" />;
}
