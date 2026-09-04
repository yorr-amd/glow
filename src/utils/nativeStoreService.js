import { LazyStore } from '@tauri-apps/plugin-store';

/**
 * 🌸 Cece Yori Native Store Service
 * Stores data safely into a native JSON file in the app data directory
 */

let storeInstance = null;

function getStore() {
  if (!storeInstance) {
    try {
      storeInstance = new LazyStore('ceceyori_glow_data.json');
    } catch (err) {
      console.warn('LazyStore not initialized:', err);
    }
  }
  return storeInstance;
}

export async function saveToNativeStore(key, value) {
  try {
    const store = getStore();
    if (store) {
      await store.set(key, value);
      await store.save();
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

export async function getFromNativeStore(key, defaultValue = null) {
  try {
    const store = getStore();
    if (store) {
      const val = await store.get(key);
      if (val !== undefined && val !== null) return val;
    }
  } catch (_e) {
    // Native store unavailable or error, fallback to defaultValue
  }
  return defaultValue;
}
