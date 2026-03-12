import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from './config';

export const createUserDoc = async (uid, { name, email }) => {
  await setDoc(doc(db, 'users', uid), {
    name,
    email,
    address: '',
    createdAt: serverTimestamp(),
  });
};

export const getUserDoc = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
};

export const updateUserDoc = async (uid, updates) => {
  await updateDoc(doc(db, 'users', uid), updates);
};

export const deleteUserAccount = async (uid) => {
  await deleteDoc(doc(db, 'users', uid));
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
};
