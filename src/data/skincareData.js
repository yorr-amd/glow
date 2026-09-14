import { getActiveAccountId, getUserData, setUserData } from '../services/db';

/**
 * 🌸 Default Skincare Steps & Products for Glow Tracker
 * Menggunakan produk & langkah perawatan esensial standar umum (generic).
 * Setiap pengguna baru dapat mengkustomisasi, mengganti nama, atau menambahkan
 * produk mereka sendiri melalui Rak Produk (Product Shelf).
 */
export const defaultSkincareData = {
  pagi: {
    title: "Rutin Pagi (Start Fresh & Glowing ☀️)",
    timeRange: "05:00 - 10:59",
    tagline: "Siapkan kulit fresh & terlindungi sebelum beraktivitas! 🌸",
    full: [],
    quick: []
  },
  siang: {
    title: "Rutin Siang (Recharge & Touch-up 🌤️)",
    timeRange: "11:00 - 14:59",
    tagline: "Segarkan wajah dan touch-up di tengah terik matahari! ☀️",
    full: [],
    quick: []
  },
  sore: {
    title: "Rutin Sore (Pre-Nongkrong 🌇)",
    timeRange: "15:00 - 18:59",
    tagline: "Skincare sebentar sebelum nongkrong biar makin glowing di jalan! 💃",
    full: [],
    quick: []
  },
  malam: {
    title: "Rutin Malam (Glow While You Sleep 🌙)",
    timeRange: "19:00 - 04:59",
    tagline: "Setelah capek seharian, saatnya manjain kulit biar besok makin cerah! 💆",
    full: [],
    quick: []
  }
};

export const modeConfig = {
  pagi: {
    label: "Pagi",
    icon: "☀️",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    gradient: "from-[#F59E0B] via-[#F97316] to-[#E11D48]",
    heroTitle: "Rise & Shine, Time to Glow ☀️",
    heroSubtitle: "Siapkan kulit fresh & terlindungi sebelum beraktivitas hari ini! 🌸",
    statColor: "text-amber-500",
  },
  siang: {
    label: "Siang",
    icon: "🌤️",
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200",
    gradient: "from-[#0284C7] via-[#0EA5E9] to-[#0D9488]",
    heroTitle: "Midday Fresh & Reapply 🌤️",
    heroSubtitle: "Segarkan wajah dan reapply sunscreen biar kulit tetap terlindungi! ☀️",
    statColor: "text-sky-500",
  },
  sore: {
    label: "Sore",
    icon: "🌇",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-200",
    gradient: "from-[#C97B8E] via-[#B86478] to-[#9B4B62]",
    heroTitle: "Beauty that Begins with You 🌸",
    heroSubtitle: "Skincare sebentar sebelum nongkrong biar makin glowing di jalan 🏍️",
    statColor: "text-rose-500",
  },
  malam: {
    label: "Malam",
    icon: "🌙",
    badgeColor: "bg-violet-100 text-violet-800 border-violet-200",
    gradient: "from-[#7B6C8E] via-[#6A5480] to-[#4E3866]",
    heroTitle: "Glow While You Sleep 🌙",
    heroSubtitle: "Setelah capek di luar, saatnya manjain kulit biar besok makin cerah 💆",
    statColor: "text-violet-500",
  }
};

export const categoryConfig = {
  face: { label: "Wajah", color: "bg-pink-100 text-pink-700 border-pink-200" },
  body: { label: "Badan", color: "bg-sky-100 text-sky-700 border-sky-200" },
  lip:  { label: "Bibir", color: "bg-rose-100 text-rose-700 border-rose-200" },
  decorative: { label: "Decorative", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

const CUSTOM_PRODUCTS_KEY = 'glow_custom_products';
const DELETED_PRODUCTS_KEY = 'glow_deleted_products';

export const getCustomProducts = (userId = null) => {
  const activeId = userId || getActiveAccountId();
  if (activeId) {
    return getUserData(activeId, 'custom_products', {});
  }
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const getDeletedProducts = (userId = null) => {
  const activeId = userId || getActiveAccountId();
  if (activeId) {
    return getUserData(activeId, 'deleted_products', {});
  }
  try {
    return JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveCustomProducts = (products, userId = null) => {
  const activeId = userId || getActiveAccountId();
  if (activeId) {
    setUserData(activeId, 'custom_products', products);
  }
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage quota error
  }
};

export const saveDeletedProducts = (deleted, userId = null) => {
  const activeId = userId || getActiveAccountId();
  if (activeId) {
    setUserData(activeId, 'deleted_products', deleted);
  }
  try {
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
  } catch {
    // Ignore storage quota error
  }
};

export const deleteProductFromMode = (mode, id, userId = null) => {
  const custom = getCustomProducts(userId);
  const deleted = getDeletedProducts(userId);

  // Remove from custom list if present
  if (custom[mode]) {
    custom[mode] = custom[mode].filter(item => item.id !== id);
    saveCustomProducts(custom, userId);
  }

  // Mark as deleted so default item won't appear
  if (!deleted[mode]) deleted[mode] = [];
  if (!deleted[mode].includes(id)) {
    deleted[mode].push(id);
    saveDeletedProducts(deleted, userId);
  }
};

export const restoreDefaultProducts = (mode, userId = null) => {
  const custom = getCustomProducts(userId);
  const deleted = getDeletedProducts(userId);

  if (mode) {
    delete custom[mode];
    delete deleted[mode];
  } else {
    for (const m of ['pagi', 'siang', 'sore', 'malam']) {
      delete custom[m];
      delete deleted[m];
    }
  }

  saveCustomProducts(custom, userId);
  saveDeletedProducts(deleted, userId);
};

export const getMergedSkincareData = (userId = null) => {
  const customProducts = getCustomProducts(userId);
  const deletedProducts = getDeletedProducts(userId);
  const merged = JSON.parse(JSON.stringify(defaultSkincareData));

  for (const mode of ['pagi', 'siang', 'sore', 'malam']) {
    const modeDeleted = deletedProducts[mode] || [];

    // 1. Filter out deleted default items
    merged[mode].full = merged[mode].full.filter(item => !modeDeleted.includes(item.id));

    // 2. Merge custom items / overrides
    if (customProducts[mode]) {
      customProducts[mode].forEach((customItem, index) => {
        if (modeDeleted.includes(customItem.id)) return;
        const existingIndex = merged[mode].full.findIndex(item => item.id === customItem.id);
        if (existingIndex >= 0) {
          merged[mode].full[existingIndex] = { ...merged[mode].full[existingIndex], ...customItem };
        } else {
          const newId = customItem.id || `custom_${mode}_${Date.now()}_${index}`;
          merged[mode].full.push({ ...customItem, id: newId, isCustom: true });
        }
      });
    }
  }

  return merged;
};

export const PAO_COLORS = {
  expired: 'bg-red-100 text-red-700 border-red-200',
  expiring: 'bg-amber-100 text-amber-700 border-amber-200',
  ok: 'bg-green-100 text-green-700 border-green-200',
};

export const getPAOStatus = (pao, userId = null) => {
  if (!pao) return { label: '—', color: 'bg-slate-100 text-slate-500 border-slate-200' };

  const match = pao.match(/(\d+)([MY])/);
  if (!match) return { label: pao, color: 'bg-slate-100 text-slate-500 border-slate-200' };

  const value = parseInt(match[1]);
  const unit = match[2];
  const months = unit === 'Y' ? value * 12 : value;

  const activeId = userId || getActiveAccountId();
  const openedKey = activeId ? `glow_pao_${activeId}_${pao}` : `glow_opened_${pao}`;
  let openedDate = localStorage.getItem(openedKey);

  if (!openedDate) {
    openedDate = new Date().toISOString().split('T')[0];
    localStorage.setItem(openedKey, openedDate);
  }

  const opened = new Date(openedDate);
  const now = new Date();
  const monthsDiff = (now.getFullYear() - opened.getFullYear()) * 12 + (now.getMonth() - opened.getMonth());
  const remaining = months - monthsDiff;

  if (remaining <= 0) {
    return { label: `${pao} (Expired)`, color: PAO_COLORS.expired, remaining: 0 };
  } else if (remaining <= 2) {
    return { label: `${pao} (${remaining}M left)`, color: PAO_COLORS.expiring, remaining };
  } else {
    return { label: `${pao} (${remaining}M)`, color: PAO_COLORS.ok, remaining };
  }
};

export const resetPAOTimer = (pao, userId = null) => {
  const activeId = userId || getActiveAccountId();
  const openedKey = activeId ? `glow_pao_${activeId}_${pao}` : `glow_opened_${pao}`;
  localStorage.setItem(openedKey, new Date().toISOString().split('T')[0]);
};