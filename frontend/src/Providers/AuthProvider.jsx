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

// Create and export the context
const AuthContext = createContext(null);
export { AuthContext };  // Named export

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // Google login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Sign up
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logOut = () => {
    setLoading(true);
    setRole(null);
    return signOut(auth);
  };

  // Auth state observer
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      
      // Fetch role from backend
      fetch(`http://localhost:5000/api/users/role?email=${encodeURIComponent(currentUser.email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.success) {
            setRole(data.role.toLowerCase());
          } else {
            console.error('Failed to get user role:', data.error);
            setRole('customer');
          }
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
          setRole('customer');
        })
        .finally(() => {
          setLoading(false);
        });
    });

    // Cleanup subscription on unmount

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const authInfo = {
    user,
    role,
    loading,
    createUser,
    signIn,
    googleLogin,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-700">
          <div className="text-emerald-400 text-xl">Loading...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Default export for the provider component
export default AuthProvider;
