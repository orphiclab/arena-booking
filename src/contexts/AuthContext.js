// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// ── Demo users (work without Firebase) ───────────────────
const DEMO_USERS = {
  'customer@demo.com': {
    uid: 'demo-customer-001',
    email: 'customer@demo.com',
    profile: { id: 'demo-customer-001', name: 'Demo Customer', email: 'customer@demo.com', role: 'customer', phone: '+91 9999999999' },
  },
  'owner@demo.com': {
    uid: 'demo-owner-001',
    email: 'owner@demo.com',
    profile: { id: 'demo-owner-001', name: 'Demo Owner', email: 'owner@demo.com', role: 'owner', phone: '+91 8888888888' },
  },
  'admin@demo.com': {
    uid: 'demo-admin-001',
    email: 'admin@demo.com',
    profile: { id: 'demo-admin-001', name: 'Demo Admin', email: 'admin@demo.com', role: 'admin', phone: '+91 7777777777' },
  },
};
const DEMO_PASSWORD = 'demo123';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Firebase, fall back gracefully if not configured
    let unsubscribe = () => {};
    try {
      const { auth, db } = require('../config/firebase');
      unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          try {
            const doc = await db.collection('users').doc(firebaseUser.uid).get();
            setUserProfile(doc.exists ? { id: doc.id, ...doc.data() } : null);
          } catch {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });
    } catch {
      // Firebase not configured — start in demo mode (not logged in)
      setLoading(false);
    }
    return unsubscribe;
  }, []);

  // Demo login — bypasses Firebase completely
  const demoLogin = (email) => {
    const demo = DEMO_USERS[email];
    if (!demo) return false;
    setUser({ uid: demo.uid, email: demo.email });
    setUserProfile(demo.profile);
    return true;
  };

  // Unified logout — works for demo AND Firebase users
  const logout = async () => {
    try {
      const { auth } = require('../config/firebase');
      await auth.signOut();
    } catch {
      // Firebase not configured or demo user — just clear state
    }
    setUser(null);
    setUserProfile(null);
  };

  // Refresh profile from Firestore (no-op in demo mode)
  const refreshProfile = async () => {
    if (!user?.uid || user.uid.startsWith('demo-')) return;
    try {
      const { db } = require('../config/firebase');
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) setUserProfile({ id: doc.id, ...doc.data() });
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, setUserProfile, demoLogin, logout, refreshProfile, DEMO_USERS, DEMO_PASSWORD }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
