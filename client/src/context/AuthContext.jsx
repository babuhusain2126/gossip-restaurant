import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import api from '../utils/api';

const AuthContext = createContext(null);

/**
 * AuthProvider
 * Wraps the app and provides auth state + actions to all components
 */
export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null); // Firebase user object
  const [dbUser, setDbUser] = useState(null);             // MongoDB profile
  const [loading, setLoading] = useState(true);           // initial auth check
  const [error, setError] = useState('');

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // Sync with MongoDB and fetch profile
        await syncWithBackend();
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync Firebase user to MongoDB and load full profile
  const syncWithBackend = async () => {
    try {
      const { data } = await api.post('/users/sync');
      setDbUser(data.user);
    } catch (err) {
      console.error('Backend sync failed:', err.message);
    }
  };

  // Refresh dbUser from backend
  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setDbUser(data.user);
    } catch (err) {
      console.error('Profile refresh failed:', err.message);
    }
  };

  // ── Auth Actions ──────────────────────────────────────────────────

  const register = async (email, password, displayName) => {
    setError('');
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name in Firebase
    await updateProfile(cred.user, { displayName });
    // Sync to MongoDB
    await syncWithBackend();
    return cred;
  };

  const login = async (email, password) => {
    setError('');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncWithBackend();
    return cred;
  };

  const logout = async () => {
    await signOut(auth);
    setDbUser(null);
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  const value = {
    firebaseUser,
    dbUser,
    setDbUser,
    loading,
    error,
    setError,
    register,
    login,
    logout,
    resetPassword,
    refreshProfile,
    isAuthenticated: !!firebaseUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/** Hook for consuming AuthContext */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export default AuthContext;
