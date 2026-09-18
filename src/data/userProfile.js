import { getCurrentUser } from '../services/firebase';
import { saveCloudUserProfile } from '../services/firestoreService';
import {
  getActiveAccountId,
  setActiveAccountId,
  getCachedAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  exportAccountData,
  importAccountData,
  DEFAULT_PROFILE,
} from '../services/db';

/**
 * 🌸 User Profile State & Helper for Glow Tracker
 * Mengelola profil pengguna yang terhubung langsung ke GlowDatabase.
 */
export const PROFILE_STORAGE_KEY = 'glow_user_profile';

export const DEFAULT_USER_PROFILE = {
  ...DEFAULT_PROFILE,
  isRegistered: false,
};

export function getSavedUserProfile(targetUserId = null) {
  try {
    const activeId = targetUserId || getActiveAccountId();
    const accounts = getCachedAccounts();
    if (activeId) {
      const found = accounts.find((acc) => acc.id === activeId);
      if (found && found.name && found.name.trim()) {
        return { ...DEFAULT_USER_PROFILE, ...found, isRegistered: true };
      }
    } else if (accounts.length > 0) {
      const first = accounts.find((acc) => acc.name && acc.name.trim());
      if (first) {
        setActiveAccountId(first.id);
        return { ...DEFAULT_USER_PROFILE, ...first, isRegistered: true };
      }
    }
  } catch (e) {
    console.error('Failed to load user profile:', e);
  }
  return null;
}

export function saveUserProfile(profile, targetUserId = null) {
  try {
    const activeId = targetUserId || profile.id || getActiveAccountId();

    let savedData;
    if (activeId) {
      savedData = {
        ...DEFAULT_USER_PROFILE,
        ...profile,
        id: activeId,
        isRegistered: true,
      };
      updateAccount(activeId, savedData);
    } else {
      savedData = {
        ...DEFAULT_USER_PROFILE,
        ...profile,
        isRegistered: true,
      };
      createAccount(savedData);
    }

    // Cloud Firestore synchronization if logged in
    const user = getCurrentUser();
    if (user?.uid) {
      saveCloudUserProfile(user.uid, savedData).catch(() => {});
    }

    return savedData;
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

/**
 * Menghapus akun pengguna tertentu atau membersihkan session aktif
 */
export async function clearUserProfile(targetUserId = null) {
  try {
    const activeId = targetUserId || getActiveAccountId();
    if (activeId) {
      await deleteAccount(activeId);
    } else {
      setActiveAccountId(null);
    }
    return true;
  } catch (e) {
    console.error('Failed to clear user profile:', e);
    return false;
  }
}

export { exportAccountData, importAccountData };
