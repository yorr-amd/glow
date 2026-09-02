/**
 * 🌸 User Profile State & Helper for Cece Yori Glow Tracker
 */
const PROFILE_STORAGE_KEY = 'ceceyori_user_profile';

export const DEFAULT_USER_PROFILE = {
  name: 'Yori',
  avatar: '🌸',
  tagline: 'Mahasiswi MI & Skincare Enthusiast 💖',
  skinType: 'Kombinasi / Sensitif',
  skinTone: 'Fair Warm Dewy',
  primaryConcern: 'Eksfoliasi Lipatan & Mencerahkan Kulit',
  skinGoals: ['Glass Skin Alami', 'Tekstur Halus', 'Bebas Kusam', 'Skin Barrier Sehat'],
  favoriteProduct: 'Sonik Scents (Toner Merah)',
  memberSince: 'Agustus 2026',
  notificationsEnabled: true,
  dailyReminderMorning: '07:00',
  dailyReminderNight: '19:00',
  soundEffectsEnabled: true,
};

export function getSavedUserProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load user profile:', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save user profile:', e);
  }
}
