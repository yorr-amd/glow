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
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem('ceceyori_view_state');
    localStorage.removeItem('ceceyori_checked_items');
    localStorage.removeItem('ceceyori_streak_history');
    localStorage.removeItem('ceceyori_daily_history');
    localStorage.removeItem('ceceyori_daily_completion');
    localStorage.removeItem('ceceyori_custom_products');
    localStorage.removeItem('ceceyori_deleted_products');
    localStorage.removeItem('ceceyori_routine_order');
    localStorage.removeItem('ceceyori_quick_mode');
    return true;
  } catch (e) {
    console.error('Failed to clear user profile:', e);
    return false;
  }
}
