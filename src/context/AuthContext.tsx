"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase'; // Relative Path
import { UserProfile } from '../types';      // Relative Path

const AuthContext = createContext<{ user: UserProfile | null; loading: boolean }>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        if (!fbUser.email?.endsWith("@iiitg.ac.in")) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            role: 'user',
            displayName: fbUser.displayName || 'Student',
          };
          await setDoc(doc(db, "users", fbUser.uid), newProfile);
          setUser(newProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);