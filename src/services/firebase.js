import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const CUSTOM_FIREBASE_KEY = 'glow_custom_firebase_config';

/**
 * Mendapatkan konfigurasi Firebase baik dari Environment Variables Vite (.env)
 * maupun dari konfigurasi tersimpan di localStorage.
 */
export function getFirebaseConfig() {
  try {
    const saved = localStorage.getItem(CUSTOM_FIREBASE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.apiKey && parsed?.projectId) {
        return parsed;
      }
    }
  } catch {
    // Ignore JSON error
  }

  const envConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  return null;
}

export function saveCustomFirebaseConfig(configObj) {
  if (!configObj || !configObj.apiKey || !configObj.projectId) {
    throw new Error('Konfigurasi Firebase harus memiliki apiKey dan projectId!');
  }
  localStorage.setItem(CUSTOM_FIREBASE_KEY, JSON.stringify(configObj));
  // Re-initialize
  return initFirebase();
}

export function removeCustomFirebaseConfig() {
  localStorage.removeItem(CUSTOM_FIREBASE_KEY);
}

export function isFirebaseConfigured() {
  return getFirebaseConfig() !== null;
}

let appInstance = null;
let authInstance = null;
let firestoreInstance = null;

export function initFirebase() {
  const config = getFirebaseConfig();
  if (!config) {
    return { app: null, auth: null, db: null };
  }

  try {
    if (!getApps().length) {
      appInstance = initializeApp(config);
    } else {
      appInstance = getApp();
    }

    authInstance = getAuth(appInstance);

    try {
      // Inisialisasi Firestore dengan multi-tab persistent offline cache (IndexedDB)
      firestoreInstance = initializeFirestore(appInstance, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      // Fallback jika sudah pernah terinisialisasi
      firestoreInstance = getFirestore(appInstance);
    }

    return { app: appInstance, auth: authInstance, db: firestoreInstance };
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    return { app: null, auth: null, db: null };
  }
}

// Inisialisasi awal saat modul dimuat
initFirebase();

export function getDb() {
  if (!firestoreInstance) {
    const { db } = initFirebase();
    return db;
  }
  return firestoreInstance;
}

export function getFirebaseAuth() {
  if (!authInstance) {
    const { auth } = initFirebase();
    return auth;
  }
  return authInstance;
}

/**
 * Registrasi pengguna baru dengan email & kata sandi
 */
export async function registerWithEmail(email, password, displayName = '') {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase belum dikonfigurasi!');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Masuk akun dengan email & kata sandi
 */
export async function loginWithEmail(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase belum dikonfigurasi!');

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Keluar dari akun Firebase
 */
export async function logoutUser() {
  const auth = getFirebaseAuth();
  if (auth) {
    await signOut(auth);
  }
}

/**
 * Listener perubahan state autentikasi Firebase
 */
export function onAuthChange(callback) {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Mendapatkan pengguna saat ini
 */
export function getCurrentUser() {
  const auth = getFirebaseAuth();
  return auth?.currentUser || null;
}
