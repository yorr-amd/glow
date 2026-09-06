import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase';

/**
 * 🌸 Cloud Firestore Service for Glow Skincare Tracker
 * Menyediakan sinkronisasi bi-directional antara penyimpanan lokal dan Cloud Firestore.
 */

// ── 1. PROFIL PENGGUNA ──
export async function saveCloudUserProfile(uid, profile) {
  const db = getDb();
  if (!db || !uid) return false;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save user profile to Firestore:', err);
    return false;
  }
}

export async function fetchCloudUserProfile(uid) {
  const db = getDb();
  if (!db || !uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch user profile from Firestore:', err);
    return null;
  }
}

// ── 2. PRODUK SKINCARE (CUSTOM & DELETED) ──
export async function saveCloudProducts(uid, customProducts, deletedProducts) {
  const db = getDb();
  if (!db || !uid) return false;
  try {
    const prodRef = doc(db, 'users', uid, 'productsData', 'catalog');
    await setDoc(prodRef, {
      custom: customProducts || {},
      deleted: deletedProducts || {},
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save products to Firestore:', err);
    return false;
  }
}

export async function fetchCloudProducts(uid) {
  const db = getDb();
  if (!db || !uid) return null;
  try {
    const prodRef = doc(db, 'users', uid, 'productsData', 'catalog');
    const snap = await getDoc(prodRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch products from Firestore:', err);
    return null;
  }
}

// ── 3. RIWAYAT & JURNAL HARIAN ──
export async function saveCloudDailyHistory(uid, dailyHistory) {
  const db = getDb();
  if (!db || !uid) return false;
  try {
    const histRef = doc(db, 'users', uid, 'historyData', 'dailyHistory');
    await setDoc(histRef, {
      entries: dailyHistory || {},
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save daily history to Firestore:', err);
    return false;
  }
}

export async function fetchCloudDailyHistory(uid) {
  const db = getDb();
  if (!db || !uid) return null;
  try {
    const histRef = doc(db, 'users', uid, 'historyData', 'dailyHistory');
    const snap = await getDoc(histRef);
    if (snap.exists()) {
      return snap.data()?.entries || {};
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch daily history from Firestore:', err);
    return null;
  }
}

// ── 4. STREAK HISTORY ──
export async function saveCloudStreakHistory(uid, streakArray) {
  const db = getDb();
  if (!db || !uid) return false;
  try {
    const streakRef = doc(db, 'users', uid, 'streakData', 'streaks');
    await setDoc(streakRef, {
      dates: streakArray || [],
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Failed to save streak to Firestore:', err);
    return false;
  }
}

export async function fetchCloudStreakHistory(uid) {
  const db = getDb();
  if (!db || !uid) return null;
  try {
    const streakRef = doc(db, 'users', uid, 'streakData', 'streaks');
    const snap = await getDoc(streakRef);
    if (snap.exists()) {
      return snap.data()?.dates || [];
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch streak from Firestore:', err);
    return null;
  }
}

// ── 5. MASTER SYNC FUNCTION ──
/**
 * Mengunggah seluruh data lokal pengguna ke Cloud Firestore
 */
export async function uploadLocalDataToCloud(uid) {
  if (!uid) return false;

  try {
    // 1. User Profile
    const localProfile = JSON.parse(localStorage.getItem('ceceyori_user_profile') || 'null');
    if (localProfile) {
      await saveCloudUserProfile(uid, localProfile);
    }

    // 2. Products
    const customProds = JSON.parse(localStorage.getItem('ceceyori_custom_products') || '{}');
    const deletedProds = JSON.parse(localStorage.getItem('ceceyori_deleted_products') || '{}');
    await saveCloudProducts(uid, customProds, deletedProds);

    // 3. Daily History
    const history = JSON.parse(localStorage.getItem('ceceyori_daily_history') || '{}');
    await saveCloudDailyHistory(uid, history);

    // 4. Streaks
    const streaks = JSON.parse(localStorage.getItem('ceceyori_streak_history') || '[]');
    await saveCloudStreakHistory(uid, streaks);

    return true;
  } catch (err) {
    console.error('Error uploading local data to cloud:', err);
    return false;
  }
}

/**
 * Mengunduh seluruh data pengguna dari Cloud Firestore ke penyimpanan lokal
 */
export async function downloadCloudDataToLocal(uid) {
  if (!uid) return null;

  try {
    const [cloudProfile, cloudProducts, cloudHistory, cloudStreak] = await Promise.all([
      fetchCloudUserProfile(uid),
      fetchCloudProducts(uid),
      fetchCloudDailyHistory(uid),
      fetchCloudStreakHistory(uid),
    ]);

    const result = {};

    if (cloudProfile) {
      localStorage.setItem('ceceyori_user_profile', JSON.stringify(cloudProfile));
      result.profile = cloudProfile;
    }

    if (cloudProducts) {
      if (cloudProducts.custom) {
        localStorage.setItem('ceceyori_custom_products', JSON.stringify(cloudProducts.custom));
        result.customProducts = cloudProducts.custom;
      }
      if (cloudProducts.deleted) {
        localStorage.setItem('ceceyori_deleted_products', JSON.stringify(cloudProducts.deleted));
        result.deletedProducts = cloudProducts.deleted;
      }
    }

    if (cloudHistory) {
      localStorage.setItem('ceceyori_daily_history', JSON.stringify(cloudHistory));
      result.dailyHistory = cloudHistory;
    }

    if (cloudStreak) {
      localStorage.setItem('ceceyori_streak_history', JSON.stringify(cloudStreak));
      result.streakHistory = cloudStreak;
    }

    return result;
  } catch (err) {
    console.error('Error downloading cloud data to local:', err);
    return null;
  }
}
