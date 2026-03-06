// src/services/authService.js
import { auth, db } from '../config/firebase';

export const signUp = async (email, password, name, role = 'customer') => {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  });
  return user;
};

export const signIn = async (email, password) => {
  const userCredential = await auth.signInWithEmailAndPassword(email, password);
  return userCredential.user;
};

export const signOut = async () => {
  await auth.signOut();
};

export const getCurrentUser = () => auth.currentUser;

export const getUserProfile = async (uid) => {
  const doc = await db.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const updateUserProfile = async (uid, data) => {
  await db.collection('users').doc(uid).update(data);
};

export const onAuthStateChanged = (callback) => {
  return auth.onAuthStateChanged(callback);
};
