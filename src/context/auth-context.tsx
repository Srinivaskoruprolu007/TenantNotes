
"use client";

import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  reloadUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, reloadUser: async () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const freshUser = auth.currentUser;
      setUser(freshUser);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    // Listen for token changes to get updated user profile
    const unsubscribeToken = onIdTokenChanged(auth, (user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
      unsubscribeToken();
    }
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Skeleton className="w-full h-full" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading, reloadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
