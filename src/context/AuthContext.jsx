import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Signup
  const signup = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, {
      email,
      isAdmin: false, // default = normal user
      createdAt: new Date(),
    });
    return cred.user;
  };

  // Login
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsAdmin(!!data.isAdmin); // true/false
        } else {
          await setDoc(userRef, {
            email: firebaseUser.email,
            isAdmin: false,
            createdAt: new Date(),
          });
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
