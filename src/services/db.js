/**
 * 🌸 GlowDatabase - Multi-User IndexedDB Persistence Layer
 *
 * Menyediakan database lokal terstruktur dan terisolasi per akun:
 * - Store 'accounts': Menyimpan akun pengguna (id, username, name, avatar, dll.)
 * - Store 'userData': Menyimpan data spesifik per user (${userId}::${key})
 * - Store 'app_state': Menyimpan konfigurasi global seperti active_user_id
 *
 * Dilengkapi dengan:
 * 1. Synchronous cache fallback agar UI React dapat merender seketika tanpa flicker
 * 2. Migrasi data lama (migrateLegacyDataIfNeeded) agar data pengguna saat ini tidak hilang
 * 3. Fitur Ekspor & Impor (.json) untuk backup data akun antar perangkat
 */

const DB_NAME = 'GlowDatabase';
const DB_VERSION = 1;

export const DEFAULT_PROFILE = {
  name: '',
  avatar: '🌸',
  tagline: 'Skincare Routine & Glowing Journey ✨',
  skinType: 'Normal',
  skinTone: 'Natural Glow',
  primaryConcern: 'Menjaga Skin Barrier Sehat & Kulit Terhidrasi',
  skinGoals: ['Skin Barrier Sehat', 'Tekstur Halus', 'Cerah Alami', 'Bebas Kusam'],
  favoriteProduct: '',
  memberSince: '',
  isRegistered: true,
  notificationsEnabled: true,
  dailyReminderMorning: '07:00',
  dailyReminderNight: '19:00',
  soundEffectsEnabled: true,
};

let dbInstance = null;

/**
 * Inisialisasi koneksi IndexedDB
 */
export function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Object store untuk akun-akun pengguna
      if (!db.objectStoreNames.contains('accounts')) {
        const accountStore = db.createObjectStore('accounts', { keyPath: 'id' });
        accountStore.createIndex('name', 'name', { unique: false });
        accountStore.createIndex('createdAt', 'createdAt', { unique: false });
      }

      // 2. Object store untuk data per user (key format: `${userId}::${dataType}`)
      if (!db.objectStoreNames.contains('userData')) {
        db.createObjectStore('userData');
      }

      // 3. Object store untuk status aplikasi global
      if (!db.objectStoreNames.contains('app_state')) {
        db.createObjectStore('app_state');
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      resolve(null);
    };
  });
}

// ─────────────────────────────────────────────────────────
// 1. ACTIVE USER SESSION MANAGEMENT
// ─────────────────────────────────────────────────────────
const ACTIVE_USER_KEY = 'glow_active_user_id';
const ACCOUNTS_CACHE_KEY = 'glow_accounts_cache';

export function getActiveAccountId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_USER_KEY) || null;
}

export function setActiveAccountId(id) {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_USER_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_USER_KEY);
  }
}

// ─────────────────────────────────────────────────────────
// 2. ACCOUNTS CRUD
// ─────────────────────────────────────────────────────────

export function getCachedAccounts() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setCachedAccounts(accounts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACCOUNTS_CACHE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('Failed to cache accounts:', e);
  }
}

export async function getAllAccounts() {
  const cached = getCachedAccounts();
  const db = await openDB();
  if (!db) return cached;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('accounts', 'readonly');
      const store = tx.objectStore('accounts');
      const request = store.getAll();

      request.onsuccess = () => {
        const accounts = request.result || [];
        setCachedAccounts(accounts);
        resolve(accounts);
      };

      request.onerror = () => resolve(cached);
    } catch {
      resolve(cached);
    }
  });
}

export async function getAccountById(id) {
  if (!id) return null;
  const cached = getCachedAccounts().find((acc) => acc.id === id);
  const db = await openDB();
  if (!db) return cached || null;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction('accounts', 'readonly');
      const store = tx.objectStore('accounts');
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || cached || null);
      request.onerror = () => resolve(cached || null);
    } catch {
      resolve(cached || null);
    }
  });
}

export async function createAccount(profileData) {
  const id = profileData.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const nowStr = new Date().toISOString();

  const account = {
    ...DEFAULT_PROFILE,
    ...profileData,
    id,
    isRegistered: true,
    createdAt: profileData.createdAt || nowStr,
    lastActiveAt: nowStr,
  };

  // 1. Update synchronous cache
  const cached = getCachedAccounts();
  const filtered = cached.filter((a) => a.id !== id);
  filtered.push(account);
  setCachedAccounts(filtered);
  setActiveAccountId(id);

  // 2. Persist in IndexedDB
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(['accounts', 'app_state'], 'readwrite');
      tx.objectStore('accounts').put(account);
      tx.objectStore('app_state').put(id, 'active_user_id');
    } catch (e) {
      console.warn('Failed to write account to IndexedDB:', e);
    }
  }

  return account;
}

export async function updateAccount(id, updates) {
  if (!id) return null;
  const accounts = getCachedAccounts();
  const index = accounts.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updated = {
    ...accounts[index],
    ...updates,
    id,
    lastActiveAt: new Date().toISOString(),
  };

  accounts[index] = updated;
  setCachedAccounts(accounts);

  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction('accounts', 'readwrite');
      tx.objectStore('accounts').put(updated);
    } catch (e) {
      console.warn('Failed to update account in IndexedDB:', e);
    }
  }

  return updated;
}

export async function deleteAccount(id) {
  if (!id) return false;

  // Update cached accounts
  const cached = getCachedAccounts().filter((a) => a.id !== id);
  setCachedAccounts(cached);

  // If deleted account was active, switch to next available account or null
  if (getActiveAccountId() === id) {
    const nextId = cached.length > 0 ? cached[0].id : null;
    setActiveAccountId(nextId);
  }

  // Clear user-specific localStorage cache
  if (typeof window !== 'undefined') {
    const prefix = `glow_user_${id}_`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        localStorage.removeItem(k);
      }
    }
  }

  // Remove from IndexedDB
  const db = await openDB();
  if (db) {
    try {
      const tx = db.transaction(['accounts', 'userData'], 'readwrite');
      tx.objectStore('accounts').delete(id);

      const userStore = tx.objectStore('userData');
      const req = userStore.openCursor();
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (typeof cursor.key === 'string' && cursor.key.startsWith(`${id}::`)) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
    } catch (e) {
      console.warn('Failed to delete account data from IndexedDB:', e);
    }
  }

  return true;
}

// ─────────────────────────────────────────────────────────
// 3. USER-SCOPED DATA STORAGE (PRODUCTS, HISTORY, STREAKS, ETC.)
// ─────────────────────────────────────────────────────────

export function getUserData(userId, key, defaultValue = null) {
  if (!userId || typeof window === 'undefined') return defaultValue;
  try {
    const localKey = `glow_user_${userId}_${key}`;
    const item = localStorage.getItem(localKey);
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch {
    // Ignore JSON error
  }
  return defaultValue;
}

export function setUserData(userId, key, value) {
  if (!userId || typeof window === 'undefined') return;
  const localKey = `glow_user_${userId}_${key}`;

  // 1. Synchronous localStorage cache
  try {
    localStorage.setItem(localKey, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to cache userData ${key}:`, e);
  }

  // 2. Async IndexedDB write
  openDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction('userData', 'readwrite');
      const dbKey = `${userId}::${key}`;
      tx.objectStore('userData').put(value, dbKey);
    } catch (e) {
      console.warn(`Failed to write userData ${key} to IndexedDB:`, e);
    }
  });
}

// ─────────────────────────────────────────────────────────
// 4. LEGACY DATA MIGRATION (Preserve existing user data)
// ─────────────────────────────────────────────────────────
/**
 * Memastikan data pengguna lokal yang sudah ada sebelumnya (seperti rutinitas,
 * streak, riwayat checklist) tidak hilang saat aplikasi diperbarui.
 * Data tersebut akan dimigrasikan ke dalam akun pertama pengguna di IndexedDB.
 */
export async function migrateLegacyDataIfNeeded() {
  if (typeof window === 'undefined') return null;

  const MIGRATION_FLAG = 'glow_v12_migration_done';
  if (localStorage.getItem(MIGRATION_FLAG)) {
    return null;
  }

  try {
    const legacyProfileRaw = localStorage.getItem('ceceyori_user_profile');
    let legacyProfile = null;
    if (legacyProfileRaw) {
      try { legacyProfile = JSON.parse(legacyProfileRaw); } catch { legacyProfile = null; }
    }

    const legacyStreakRaw = localStorage.getItem('ceceyori_streak_history');
    const legacyHistoryRaw = localStorage.getItem('ceceyori_daily_history');
    const legacyCustomProdsRaw = localStorage.getItem('ceceyori_custom_products');
    const legacyDeletedProdsRaw = localStorage.getItem('ceceyori_deleted_products');
    const legacyCheckedRaw = localStorage.getItem('ceceyori_checked_items');

    const hasAnyLegacyData = legacyProfile?.name || legacyStreakRaw || legacyHistoryRaw || legacyCustomProdsRaw;

    if (hasAnyLegacyData) {
      const userName = legacyProfile?.name?.trim() || 'My Skincare Account';
      const userId = `user_${Date.now()}_legacy`;

      const migratedAccount = {
        ...DEFAULT_PROFILE,
        ...(legacyProfile || {}),
        id: userId,
        name: userName,
        isRegistered: true,
        createdAt: legacyProfile?.memberSince || new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      // Simpan akun ke database & cache
      await createAccount(migratedAccount);
      setActiveAccountId(userId);

      // Migrasikan produk custom & deleted
      if (legacyCustomProdsRaw || legacyDeletedProdsRaw) {
        try {
          const custom = legacyCustomProdsRaw ? JSON.parse(legacyCustomProdsRaw) : {};
          const deleted = legacyDeletedProdsRaw ? JSON.parse(legacyDeletedProdsRaw) : {};
          setUserData(userId, 'custom_products', custom);
          setUserData(userId, 'deleted_products', deleted);
        } catch (e) {
          console.warn('Error migrating products:', e);
        }
      }

      // Migrasikan streak
      if (legacyStreakRaw) {
        try {
          const streak = JSON.parse(legacyStreakRaw);
          if (Array.isArray(streak)) {
            setUserData(userId, 'streak_history', streak);
          }
        } catch (e) {
          console.warn('Error migrating streak:', e);
        }
      }

      // Migrasikan riwayat harian
      if (legacyHistoryRaw) {
        try {
          const history = JSON.parse(legacyHistoryRaw);
          setUserData(userId, 'daily_history', history);
        } catch (e) {
          console.warn('Error migrating history:', e);
        }
      }

      // Migrasikan checklist hari ini
      if (legacyCheckedRaw) {
        try {
          const checked = JSON.parse(legacyCheckedRaw);
          setUserData(userId, 'checked_items', checked);
        } catch (e) {
          console.warn('Error migrating checked items:', e);
        }
      }

      console.log('🌸 Legacy user data successfully migrated to account:', userName);
      localStorage.setItem(MIGRATION_FLAG, 'true');
      return migratedAccount;
    }

    localStorage.setItem(MIGRATION_FLAG, 'true');
  } catch (err) {
    console.error('Legacy data migration failed:', err);
  }

  return null;
}

// ─────────────────────────────────────────────────────────
// 5. BACKUP & EXPORT / IMPORT (.json)
// ─────────────────────────────────────────────────────────
/**
 * Mengekspor seluruh data akun (profil, produk custom, riwayat harian, streak)
 * menjadi berkas JSON untuk backup atau transfer ke perangkat lain.
 */
export async function exportAccountData(userId) {
  if (!userId) return null;
  const account = await getAccountById(userId);
  if (!account) return null;

  const exportPayload = {
    version: '1.2.0',
    exportDate: new Date().toISOString(),
    account,
    data: {
      custom_products: getUserData(userId, 'custom_products', {}),
      deleted_products: getUserData(userId, 'deleted_products', {}),
      streak_history: getUserData(userId, 'streak_history', []),
      daily_history: getUserData(userId, 'daily_history', {}),
      routine_order: getUserData(userId, 'routine_order', {}),
      quick_mode: getUserData(userId, 'quick_mode', 'full'),
      checked_items: getUserData(userId, 'checked_items', {}),
    },
  };

  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Mengimpor berkas JSON cadangan ke dalam database aplikasi sebagai akun baru / update
 */
export async function importAccountData(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || !parsed.account || !parsed.account.name) {
      throw new Error('Format berkas cadangan tidak valid (informasi akun tidak ditemukan).');
    }

    // Buat ID baru jika ingin ditambahkan sebagai akun independen
    const newUserId = `user_${Date.now()}_import`;
    const accountToSave = {
      ...DEFAULT_PROFILE,
      ...parsed.account,
      id: newUserId,
      name: parsed.account.name,
      lastActiveAt: new Date().toISOString(),
    };

    await createAccount(accountToSave);
    setActiveAccountId(newUserId);

    if (parsed.data) {
      if (parsed.data.custom_products) setUserData(newUserId, 'custom_products', parsed.data.custom_products);
      if (parsed.data.deleted_products) setUserData(newUserId, 'deleted_products', parsed.data.deleted_products);
      if (parsed.data.streak_history) setUserData(newUserId, 'streak_history', parsed.data.streak_history);
      if (parsed.data.daily_history) setUserData(newUserId, 'daily_history', parsed.data.daily_history);
      if (parsed.data.routine_order) setUserData(newUserId, 'routine_order', parsed.data.routine_order);
      if (parsed.data.quick_mode) setUserData(newUserId, 'quick_mode', parsed.data.quick_mode);
      if (parsed.data.checked_items) setUserData(newUserId, 'checked_items', parsed.data.checked_items);
    }

    return accountToSave;
  } catch (err) {
    console.error('Failed to import account data:', err);
    throw err;
  }
}
