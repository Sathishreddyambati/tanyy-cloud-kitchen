import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where, limit, serverTimestamp, runTransaction } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase web config values are safe to expose (they identify the project, not authenticate it —
// data access is controlled by Firestore Security Rules). We still load them from env for cleanliness.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Analytics only in browsers that support it
isSupported().then((ok) => { if (ok) getAnalytics(app); }).catch((e) => console.warn('Analytics init skipped:', e?.message));

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, r) => setTimeout(() => r(new Error('timeout')), ms))]);

// Reserve a unique sequential order number using a Firestore transaction.
// Falls back to a timestamp-based ID if Firestore is unreachable so the UX never breaks.
export async function reserveOrderNumber() {
  const counterRef = doc(db, 'settings', 'orderCounter');
  try {
    const next = await withTimeout(runTransaction(db, async (tx) => {
      const snap = await tx.get(counterRef);
      const current = snap.exists() ? (snap.data().value || 100000) : 100000;
      const value = current + 1;
      tx.set(counterRef, { value }, { merge: true });
      return value;
    }), 4000);
    return `TK${next}`;
  } catch (e) {
    console.warn('Order counter fallback:', e?.message);
    const t = Date.now().toString().slice(-6);
    return `TK${t}`;
  }
}

export async function saveOrder(order) {
  try {
    const ref = await withTimeout(addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }), 10000);

    return ref.id;
  } catch (e) {
    console.error('saveOrder failed:', e);
    throw e;
  }
}

export async function fetchOrders() {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await withTimeout(getDocs(q), 5000);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn('fetchOrders fallback:', e?.message);
    return [];
  }
}

export async function updateOrderStatus(id, status) {
  await updateDoc(doc(db, 'orders', id), { status, updatedAt: serverTimestamp() });
}

export async function removeOrder(id) {
  await deleteDoc(doc(db, 'orders', id));
}

// Fetch a single order by its orderNumber (TK######) — used by the customer tracking page.
export async function fetchOrderByNumber(orderNumber) {
  try {
    const q = query(collection(db, 'orders'), where('orderNumber', '==', orderNumber), limit(1));
    const snap = await withTimeout(getDocs(q), 5000);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() };
  } catch (e) {
    console.warn('fetchOrderByNumber fallback:', e?.message);
    return null;
  }
}
