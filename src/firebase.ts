import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  initializeFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
  getDocFromServer,
  memoryLocalCache,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

const firestoreDatabaseId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;

// Mock para evitar crash imediato da aplicação (em production, deve ter as envs certas)
export const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5;

if (!isFirebaseConfigured && import.meta.env.DEV) {
  console.warn("[firebase] Rodando em modo degradado: envs ausentes. Configure em Settings > Secrets.");
}

const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const app = firebaseApp;
export const db = isFirebaseConfigured && firebaseApp ? initializeFirestore(firebaseApp, {
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true,
}, firestoreDatabaseId || undefined) : null;

export const auth = isFirebaseConfigured && firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();

async function testConnection() {
  if (!db) return;
  try {
    await getDocFromServer(doc(db, "test", "connection"));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("the client is offline")
    ) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
};
