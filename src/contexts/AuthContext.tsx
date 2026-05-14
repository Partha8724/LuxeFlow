import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  logout: async () => {},
  clearError: () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/popup-blocked':
        return 'The authentication portal was restricted by your browser. Please permit pop-ups for this domain.';
      case 'auth/popup-closed-by-user':
        return 'The authentication sequence was terminated by the user. Please re-initiate.';
      case 'auth/cancelled-popup-request':
        return 'A redundant authentication attempt was detected. Sequence reset.';
      case 'auth/network-request-failed':
        return 'Connectivity interruption detected during authentication. Please verify your network state.';
      case 'auth/operation-not-allowed':
        return 'The requested authentication method is currently restricted in this environment.';
      default:
        return 'An internal exception occurred during authentication. Please retry or open in a new tab.';
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error signing in with Google", err);
      const friendlyMessage = getErrorMessage(err.code);
      setError(friendlyMessage);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out", err);
      setError('An exception occurred during the secure sign-out sequence.');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, signInWithGoogle, logout, clearError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
