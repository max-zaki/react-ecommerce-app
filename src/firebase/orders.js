import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const ordersRef = () => collection(db, 'orders');

export const createOrder = async ({ userId, userEmail, items, totalItems, totalPrice }) => {
  const docRef = await addDoc(ordersRef(), {
    userId,
    userEmail,
    items,
    totalItems,
    totalPrice,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const getUserOrders = async (userId) => {
  const q = query(ordersRef(), where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate().toISOString() ?? null,
  }));
};

export const getOrderById = async (orderId) => {
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...snap.data(),
    createdAt: snap.data().createdAt?.toDate().toISOString() ?? null,
  };
};
