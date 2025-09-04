// @ts-nocheck
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../Firebase/firebase.config";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // ✅ Role state
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // sign up
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // signIn user
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // logOut
  const logOut = () => {
    setLoading(true);
    setRole(null); // clear role on logout
    return signOut(auth);
  };

  // using observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/role/${currentUser.email}`);
          const data = await response.json();
          if (data.success) {
            setRole(data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null);
      }
      setLoading(false);

      if (currentUser) {
        const email = currentUser.email;

        // 🔁 Example: Fetch role from your backend (replace with real call)
        try {
          const res = await fetch(`http://localhost:5000/api/users/role?email=${email}`);
          const data = await res.json();
          setRole(data.role); // assume response like { role: "admin" }
        } catch (error) {
          console.error("Failed to fetch role:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const authentications = {
    googleLogin,
    createUser,
    signIn,
    logOut,
    user,
    role,
    loading,
  };

  return (
    <AuthContext.Provider value={authentications}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
