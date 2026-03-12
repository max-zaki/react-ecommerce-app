import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

const productsRef = () => collection(db, 'products');

export const getAllProducts = async () => {
  const snap = await getDocs(productsRef());
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getProductsByCategory = async (category) => {
  const q = query(productsRef(), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createProduct = async (productData) => {
  const docRef = await addDoc(productsRef(), {
    ...productData,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, ...productData };
};

export const updateProduct = async (id, updates) => {
  await updateDoc(doc(db, 'products', id), updates);
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id));
};

/** One-time seed: pulls 20 products from FakeStore and saves to Firestore */
export const seedProductsFromFakeStore = async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  const items = await res.json();
  const writes = items.map((p) =>
    addDoc(productsRef(), {
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      rating: p.rating,
      createdAt: serverTimestamp(),
    })
  );
  await Promise.all(writes);
};
