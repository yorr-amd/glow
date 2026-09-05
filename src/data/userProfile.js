/**
 * 🌸 User Profile State & Helper for Glow Tracker
 * Data akun pengguna default dibuat bersih (empty/clean) agar setiap pengguna
 * baru dapat mendaftarkan profil dan namanya sendiri tanpa membawa data lama.
 */
export const PROFILE_STORAGE_KEY = 'ceceyori_user_profile';

export const DEFAULT_USER_PROFILE = {
  name: '',
  avatar: '🌸',
  tagline: 'Skincare Routine & Glowing Journey ✨',
  skinType: 'Normal',
  skinTone: 'Natural Glow',
  primaryConcern: 'Menjaga Skin Barrier Sehat & Kulit Terhidrasi',
  skinGoals: ['Skin Barrier Sehat', 'Tekstur Halus', 'Cerah Alami', 'Bebas Kusam'],
  favoriteProduct: '',
  memberSince: '',
  isRegistered: false,
  notificationsEnabled: true,
  dailyReminderMorning: '07:00',
  dailyReminderNight: '19:00',
  soundEffectsEnabled: true,
};

export function getSavedUserProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.name && parsed.name.trim()) {
        return { ...DEFAULT_USER_PROFILE, ...parsed, isRegistered: true };
      }
    }
  } catch (e) {
    console.error('Failed to load user profile:', e);
  }
  return null;
}

export function saveUserProfile(profile) {
  try {
    const dataToSave = {
      ...DEFAULT_USER_PROFILE,
      ...profile,
      isRegistered: true,
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(dataToSave));
    return dataToSave;
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}

/**
 * Mengosongkan seluruh data pengguna (profil, checklist, riwayat, streak)
 * agar aplikasi kembali bersih seperti baru dipasang pertama kali.
 */
export function clearUserProfile() {
  try {
    const keysToRemove = [
      PROFILE_STORAGE_KEY,
      'ceceyori_view_state',
      'ceceyori_checked_items',
      'ceceyori_streak_history',
      'ceceyori_daily_history',
      'ceceyori_daily_completion',
      'ceceyori_custom_products',
      'ceceyori_deleted_products',
      'ceceyori_routine_order',
      'ceceyori_quick_mode',
      'ceceyori_toner_enabled',
      'ceceyori_notified_today',
      'ceceyori_glow_vibes_count',
      'glow_auto_update_enabled',
      'glow_last_update_check',
      'glow_dismissed_update_version',
    ];

    if (typeof localStorage !== 'undefined') {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('ceceyori_') || k.startsWith('glow_'))) {
          if (!keysToRemove.includes(k) && k !== 'glow_fresh_v113_reset') {
            keysToRemove.push(k);
          }
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
    return true;
  } catch (e) {
    console.error('Failed to clear user profile:', e);
    return false;
  }
}
