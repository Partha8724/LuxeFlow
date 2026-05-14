import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
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

  const getErrorMessage = (err: any) => {
    const code = err.code;
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already associated with a Luxe Doow account.';
      case 'auth/invalid-email':
        return 'The provided email domain is invalid.';
      case 'auth/weak-password':
        return 'Security protocols require a more resilient password.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Authentication failed. Please verify your credentials.';
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
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for OAuth operations for your Firebase project. Please add it in the Firebase Console.';
      case 'auth/invalid-api-key':
        return 'Your Firebase API Key is invalid. Please check your configuration.';
      case 'auth/app-deleted':
        return 'The Firebase App was deleted or is not configured properly.';
      default:
        return `An authentication error occurred (${code}): ${err.message || 'Please retry or open in a new tab.'}`;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error("Error signing in with Google", err);
      const friendlyMessage = getErrorMessage(err);
      setError(friendlyMessage);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      await sendEmailVerification(cred.user);
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      setError(getErrorMessage(err));
      throw err;
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
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      signInWithGoogle, 
      signUpWithEmail, 
      signInWithEmail,
      logout, 
      clearError 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
