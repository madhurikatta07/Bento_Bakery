/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, collection } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { Order, AdminQuery, Review, User, Address } from './types';
import { INITIAL_QUERIES, INITIAL_REVIEWS } from './data';

// Determine if real Firebase config is loaded
const isFirebaseConfigured = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey.trim() !== "");

let app;
let firestoreDb: any = null;
let firebaseAuth: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firestoreDb = getFirestore(app);
    firebaseAuth = getAuth(app);
    console.log("Firebase initialized successfully with credentials.");
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
} else {
  console.log("Using Local Storage Fallback Sandbox (Firebase config is not yet active).");
}

// Ensure exports exist
export const db = firestoreDb;
export const auth = firebaseAuth;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: firebaseAuth?.currentUser?.uid || 'localStorage_sandbox',
      email: firebaseAuth?.currentUser?.email || 'admin@cakesandcreams.com',
      emailVerified: true,
      isAnonymous: false,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// LOCAL STORAGE INITIALIZERS
const LOCAL_STORAGE_KEYS = {
  USER: 'cakesandcreams_user',
  ORDERS: 'cakesandcreams_orders',
  QUERIES: 'cakesandcreams_queries',
  REVIEWS: 'cakesandcreams_reviews',
  WISHLIST: 'cakesandcreams_wishlist',
};

// Initialize Local Store with Predefined Data if empty
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.QUERIES)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.QUERIES, JSON.stringify(INITIAL_QUERIES));
}
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
}
if (!localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS)) {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify([]));
}

// CORE SERVICE API PROVIDER (TRANSPARENT FALLBACK FLOW)
export const ApiService = {
  // --- AUTHENTICATION SERVICE ---
  async getCurrentUser(): Promise<User | null> {
    if (isFirebaseConfigured && firebaseAuth?.currentUser) {
      const fUser = firebaseAuth.currentUser;
      try {
        const uDoc = await getDoc(doc(firestoreDb, 'users', fUser.uid));
        if (uDoc.exists()) {
          return uDoc.data() as User;
        }
      } catch (err) {
        console.warn("Could not fetch Firestore user profile, falling back", err);
      }
      return {
        uid: fUser.uid,
        email: fUser.email || 'customer@cakesandcreams.com',
        displayName: fUser.displayName || 'Sweet Customer',
        role: fUser.email === 'madhukatta0731@gmail.com' ? 'admin' : 'customer', // Auto boot user email as admin
        savedAddresses: [],
        wishlist: [],
      };
    } else {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    }
  },

  async login(email: string, displayName: string = 'Cute Baker'): Promise<User> {
    const isOwnerEmail = email === 'madhukatta0731@gmail.com' || email.toLowerCase().includes('deepika') || email.toLowerCase().includes('admin');
    const newUser: User = {
      uid: isOwnerEmail ? 'admin_deepika' : `user_${Date.now()}`,
      email,
      displayName: isOwnerEmail ? 'Deepika' : displayName,
      role: isOwnerEmail ? 'admin' : 'customer',
      savedAddresses: [
        { id: '1', street: '123 Bakery Lane', city: 'Sweetwater', state: 'CA', zip: '90210' }
      ],
      wishlist: []
    };

    if (isFirebaseConfigured && firebaseAuth) {
      // In a real configuration, we can sign in or sync with Firebase Users
      try {
        await setDoc(doc(firestoreDb, 'users', newUser.uid), newUser);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${newUser.uid}`);
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(newUser));
    return newUser;
  },

  logout() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  // --- ORDERS MANAGEMENT ---
  async getOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'orders'));
        const ordersList: Order[] = [];
        querySnapshot.forEach((d) => {
          ordersList.push({ id: d.id, ...d.data() } as Order);
        });
        return ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'orders');
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    const parsed: Order[] = saved ? JSON.parse(saved) : [];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createOrder(order: Omit<Order, 'id'>): Promise<Order> {
    const newId = `order_${Math.floor(100000 + Math.random() * 900000)}`;
    const fullOrder: Order = { ...order, id: newId };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'orders', newId), fullOrder);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `orders/${newId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    const parsed: Order[] = saved ? JSON.parse(saved) : [];
    parsed.push(fullOrder);
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(parsed));
    return fullOrder;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'orders', orderId), { status });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    const parsed: Order[] = saved ? JSON.parse(saved) : [];
    const index = parsed.findIndex(o => o.id === orderId);
    if (index !== -1) {
      parsed[index].status = status;
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(parsed));
    }
  },

  // --- CUSTOMER QUERIES (DEEPIKA INQUIRIES) ---
  async getQueries(): Promise<AdminQuery[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'queries'));
        const qsList: AdminQuery[] = [];
        querySnapshot.forEach((d) => {
          qsList.push({ id: d.id, ...d.data() } as AdminQuery);
        });
        return qsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'queries');
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUERIES);
    const parsed: AdminQuery[] = saved ? JSON.parse(saved) : [];
    return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async sendQuery(queryData: Omit<AdminQuery, 'id' | 'status' | 'createdAt'>): Promise<AdminQuery> {
    const qId = `query_${Date.now()}`;
    const newQuery: AdminQuery = {
      ...queryData,
      id: qId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'queries', qId), newQuery);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `queries/${qId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUERIES);
    const parsed: AdminQuery[] = saved ? JSON.parse(saved) : [];
    parsed.push(newQuery);
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUERIES, JSON.stringify(parsed));
    return newQuery;
  },

  async respondToQuery(queryId: string, responseText: string): Promise<void> {
    const respondedAt = new Date().toISOString();
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'queries', queryId), {
          status: 'Responded',
          responseText,
          respondedAt
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `queries/${queryId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUERIES);
    const parsed: AdminQuery[] = saved ? JSON.parse(saved) : [];
    const index = parsed.findIndex(q => q.id === queryId);
    if (index !== -1) {
      parsed[index].status = 'Responded';
      parsed[index].responseText = responseText;
      parsed[index].respondedAt = respondedAt;
      localStorage.setItem(LOCAL_STORAGE_KEYS.QUERIES, JSON.stringify(parsed));
    }
  },

  // --- REVIEWS MODERATION ---
  async getReviews(): Promise<Review[]> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const querySnapshot = await getDocs(collection(firestoreDb, 'reviews'));
        const revs: Review[] = [];
        querySnapshot.forEach((d) => {
          revs.push({ id: d.id, ...d.data() } as Review);
        });
        return revs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'reviews');
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
    const parsed = saved ? JSON.parse(saved) : [];
    return parsed.sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async addReview(review: Omit<Review, 'id' | 'approved' | 'createdAt'>): Promise<Review> {
    const rId = `rev_${Date.now()}`;
    const newRev: Review = {
      ...review,
      id: rId,
      approved: true, // Autoapprove for cute interactivity
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'reviews', rId), newRev);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `reviews/${rId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
    const parsed: Review[] = saved ? JSON.parse(saved) : [];
    parsed.push(newRev);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(parsed));
    return newRev;
  },

  async approveReview(reviewId: string, approved: boolean): Promise<void> {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'reviews', reviewId), { approved });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `reviews/${reviewId}`);
      }
    }

    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REVIEWS);
    const parsed: Review[] = saved ? JSON.parse(saved) : [];
    const index = parsed.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      parsed[index].approved = approved;
      localStorage.setItem(LOCAL_STORAGE_KEYS.REVIEWS, JSON.stringify(parsed));
    }
  },

  // --- WISHLIST ---
  async syncUserWishlist(uid: string, wishlist: string[]): Promise<void> {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (saved) {
      const parsed: User = JSON.parse(saved);
      if (parsed.uid === uid) {
        parsed.wishlist = wishlist;
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
    }

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'users', uid), { wishlist });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    }
  },

  // --- SAVE ADDRESSES ---
  async syncUserAddresses(uid: string, savedAddresses: Address[]): Promise<void> {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (saved) {
      const parsed: User = JSON.parse(saved);
      if (parsed.uid === uid) {
        parsed.savedAddresses = savedAddresses;
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(parsed));
      }
    }

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await updateDoc(doc(firestoreDb, 'users', uid), { savedAddresses });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    }
  }
};
