export const defaultSkincareData = {
  pagi: {
    title: "Rutin Pagi (Start Fresh & Glowing ☀️)",
    timeRange: "05:00 - 10:59",
    tagline: "Siapkan kulit fresh & terlindungi sebelum beraktivitas! 🌸",
    full: [
      { id: "p1", name: "Vaseline Soft & Glow", desc: "Body lotion SPF 20 untuk badan", desc_en: "SPF 20 body lotion for daily body protection", category: "body", pao: "12M", isEssential: true, tip: "Oleskan merata ke tangan dan kaki sebelum berangkat ✨", tip_en: "Apply evenly to arms and legs before heading out ✨" },
      { id: "p2", name: "Pond's", desc: "Cuci muka segar bangun tidur", desc_en: "Gentle refreshing face cleanser after waking up", category: "face", pao: "12M", isEssential: true, tip: "Cuci muka dengan air sejuk & busa lembut biar kulit bangun segar ✨", tip_en: "Wash face with cool water & gentle foam for a fresh start ✨" },
      { id: "p3", name: "Originote Gel", desc: "Moisturizer ringan untuk hidrasi", desc_en: "Lightweight moisturizer for daily hydration", category: "face", pao: "12M", isEssential: true, tip: "Pakai tipis-tipis biar cepat meresap sebelum beraktivitas", tip_en: "Apply a thin layer for fast absorption before daily activities" },
      { id: "p4", name: "Lip Serum", desc: "Nutrisi & dasar bibir lembap", desc_en: "Nourishing lip serum for soft & supple lips", category: "lip", pao: "6M", isEssential: false, tip: "Oles tipis biar bibir tetap kenyal seharian 💋", tip_en: "Swipe lightly to keep lips plump all day long 💋" },
      { id: "p5", name: "Liptint", desc: "Warna bibir segar untuk hari-hari kamu", desc_en: "Fresh lip tint for your everyday glow", category: "decorative", pao: "12M", isEssential: false, tip: "Satu sapuan di tengah bibir, blend ke luar biar natural 💄", tip_en: "Dab in the center of lips and blend outward naturally 💄" }
    ],
    quick: ["p1", "p2", "p3"]
  },
  siang: {
    title: "Rutin Siang (Recharge & Touch-up 🌤️)",
    timeRange: "11:00 - 14:59",
    tagline: "Segarkan wajah dan touch-up di tengah terik matahari! ☀️",
    full: [
      { id: "si1", name: "Vaseline Soft & Glow", desc: "Lembapkan kulit tangan di ruangan ber-AC", desc_en: "Hydrates hands and arms in air-conditioned rooms", category: "body", pao: "12M", isEssential: true, tip: "Oleskan di tangan & siku biar nggak kering kena AC kampus ✨", tip_en: "Reapply on hands & elbows to prevent dryness from AC ✨" },
      { id: "si2", name: "Pond's", desc: "Segarkan wajah dari minyak & kantuk", desc_en: "Refreshes skin from midday oil and tiredness", category: "face", pao: "12M", isEssential: true, tip: "Cuci muka atau basuh air bersih saat jam istirahat", tip_en: "Wash face or splash clean water during midday break" },
      { id: "si3", name: "Originote Gel", desc: "Moisturizer ringan touch-up siang", desc_en: "Lightweight moisturizer for midday touch-up", category: "face", pao: "12M", isEssential: true, tip: "Tipis aja, cukup untuk jaga kelembapan di siang hari", tip_en: "A thin layer is enough to maintain daytime hydration" },
      { id: "si4", name: "Lip Serum", desc: "Jaga kelembapan bibir siang hari", desc_en: "Maintains lip hydration throughout the day", category: "lip", pao: "6M", isEssential: false, tip: "Oles sebelum liptint biar bibir makin lembap 💋", tip_en: "Apply before lip tint to keep lips hydrated 💋" },
      { id: "si5", name: "Liptint", desc: "Touch-up warna bibir segar", desc_en: "Touch-up fresh lip color after lunch", category: "decorative", pao: "12M", isEssential: false, tip: "Bikin bibir fresh lagi sehabis makan siang / ngopi ☕", tip_en: "Freshens up lips after lunch or coffee ☕" },
      { id: "si6", name: "Hanasui", desc: "Setting spray / finishing touch siang", desc_en: "Midday facial setting spray & finishing mist", category: "face", pao: "12M", isEssential: false, tip: "Semprot merata dari jarak 20cm biar makeup tahan lama ✨", tip_en: "Mist evenly from 20cm away to keep makeup in place ✨" }
    ],
    quick: ["si1", "si2", "si3"]
  },
  sore: {
    title: "Rutin Sore (Pre-Nongkrong 🌇)",
    timeRange: "15:00 - 18:59",
    tagline: "Skincare sebentar sebelum nongkrong biar makin glowing di jalan! 💃",
    full: [
      { id: "s1", name: "Vaseline Soft & Glow", desc: "Body lotion SPF 20 sebelum keluar", desc_en: "SPF 20 body lotion before heading out", category: "body", pao: "12M", isEssential: true, tip: "Oles merata di tangan, kaki, leher — jangan lupa SPF 20-nya ☀️", tip_en: "Apply evenly to exposed arms, legs, and neck ☀️" },
      { id: "s2", name: "Pond's", desc: "Cuci muka bersih habis beraktivitas", desc_en: "Cleanses away dust & oil after afternoon activities", category: "face", pao: "12M", isEssential: true, tip: "Basahin wajah, busain cleanser, pijat 30 detik, bilas air hangat ✨", tip_en: "Lather cleanser gently for 30s and rinse with lukewarm water ✨" },
      { id: "s3", name: "Originote Gel", desc: "Moisturizer adem sebelum nongkrong", desc_en: "Cooling soothing moisturizer before hangout", category: "face", pao: "12M", isEssential: true, tip: "Ambil seujung jari, ratakan ke wajah & leher sambil dipijat lembut", tip_en: "Smooth gently across face and neck with light upward motions" },
      { id: "s4", name: "Lip Serum", desc: "Nutrisi bibir biar enggak kusam", desc_en: "Lip nourishment to prevent dryness and dullness", category: "lip", pao: "6M", isEssential: false, tip: "Tetes tipis di bibir, biarkan meresap sebelum liptint", tip_en: "Let it absorb for a minute before applying lip color" },
      { id: "s5", name: "Liptint", desc: "Pemanis bibir pas nongkrong", desc_en: "Charming lip tint accent for evening hangouts", category: "decorative", pao: "12M", isEssential: false, tip: "Satu sapuan di tengah bibir, blend ke luar — jangan terlalu tebal 💄", tip_en: "Apply lightly in the center and blend outwards 💄" },
      { id: "s6", name: "Hanasui", desc: "Setting spray biar makeup tahan seharian", desc_en: "Setting spray to lock makeup in place all evening", category: "face", pao: "12M", isEssential: false, tip: "Semprot dari jarak 20cm setelah semua skincare/makeup — tahan lama ✨", tip_en: "Spritz from 20cm after skincare/makeup for lasting glow ✨" }
    ],
    quick: ["s1", "s2", "s3"]
  },
  malam: {
    title: "Rutin Malam (Glow While You Sleep 🌙)",
    timeRange: "19:00 - 04:59",
    tagline: "Setelah capek seharian, saatnya manjain kulit biar besok makin cerah! 💆",
    full: [
      { id: "m1", name: "Vaseline Soft & Glow", desc: "Kunci kelembapan badan sebelum tidur", desc_en: "Locks in deep body hydration before sleep", category: "body", pao: "12M", isEssential: true, tip: "Kunci kelembapan badan setelah mandi malam ✨", tip_en: "Locks in deep hydration after nighttime shower ✨" },
      { id: "m2", name: "Pond's", desc: "Cuci muka bersih sebelum tidur", desc_en: "Deep gentle facial cleanser before bedtime", category: "face", pao: "12M", isEssential: true, tip: "Cuci muka bersih biar pori-pori bebas napas semalaman", tip_en: "Wash face thoroughly so pores can breathe freely overnight" },
      { id: "m3", name: "Originote Gel", desc: "Moisturizer malam untuk hidrasi optimal", desc_en: "Night moisturizer for optimal overnight hydration", category: "face", pao: "12M", isEssential: true, tip: "Lapisan tipis merata, biarkan meresap sebelum tidur", tip_en: "Apply a gentle even layer to restore hydration while sleeping" },
      { id: "m4", name: "Micellar Water", desc: "Angkat sisa makeup & kotoran (pakai kapas)", desc_en: "Removes makeup & dirt impurities with cotton pad", category: "face", pao: "6M", isEssential: true, tip: "Tuang ke kapas secukupnya, usap lembut tanpa digosok keras ✨", tip_en: "Pour onto cotton pad and wipe gently without harsh rubbing ✨" },
      { id: "m5", name: "Lip Mask", desc: "Masker bibir semalaman biar lembap & kenyal", desc_en: "Overnight lip mask for ultra soft & plump lips", category: "lip", pao: "12M", isEssential: false, tip: "Oles tebal kayak masker di bibir, biarkan bekerja semalaman 💋", tip_en: "Apply a generous layer like a mask and let it work overnight 💋" },
      { id: "m6", name: "Sonik Scents Toner Merah", desc: "Eksfoliasi lipatan (khusus Rabu & Sabtu)", desc_en: "Body fold exfoliation (Wednesday & Saturday only)", category: "body", pao: "6M", isEssential: false, isConditional: true, tip: "Hanya Rabu & Sabtu: oles di lipatan, diamkan 5–10 menit lalu bilas 🧪", tip_en: "Wed & Sat only: apply to body folds, leave for 5–10 min, then rinse 🧪" }
    ],
    quick: ["m1", "m2", "m3", "m4"]
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

const CUSTOM_PRODUCTS_KEY = 'ceceyori_custom_products';
const DELETED_PRODUCTS_KEY = 'ceceyori_deleted_products';

export const getCustomProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const getDeletedProducts = () => {
  try {
    return JSON.parse(localStorage.getItem(DELETED_PRODUCTS_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveCustomProducts = (products) => {
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(products));
};

export const saveDeletedProducts = (deleted) => {
  localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
};

export const deleteProductFromMode = (mode, id) => {
  const custom = getCustomProducts();
  const deleted = getDeletedProducts();

  // Remove from custom list if present
  if (custom[mode]) {
    custom[mode] = custom[mode].filter(item => item.id !== id);
    saveCustomProducts(custom);
  }

  // Mark as deleted so default item won't appear
  if (!deleted[mode]) deleted[mode] = [];
  if (!deleted[mode].includes(id)) {
    deleted[mode].push(id);
    saveDeletedProducts(deleted);
  }
};

export const restoreDefaultProducts = (mode) => {
  const custom = getCustomProducts();
  const deleted = getDeletedProducts();

  if (mode) {
    delete custom[mode];
    delete deleted[mode];
  } else {
    for (const m of ['pagi', 'siang', 'sore', 'malam']) {
      delete custom[m];
      delete deleted[m];
    }
  }

  saveCustomProducts(custom);
  saveDeletedProducts(deleted);
};

export const getMergedSkincareData = () => {
  const customProducts = getCustomProducts();
  const deletedProducts = getDeletedProducts();
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

export const getPAOStatus = (pao) => {
  if (!pao) return { label: '—', color: 'bg-slate-100 text-slate-500 border-slate-200' };
  
  const match = pao.match(/(\d+)([MY])/);
  if (!match) return { label: pao, color: 'bg-slate-100 text-slate-500 border-slate-200' };
  
  const value = parseInt(match[1]);
  const unit = match[2];
  const months = unit === 'Y' ? value * 12 : value;
  
  const openedKey = `ceceyori_opened_${pao}`;
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

export const resetPAOTimer = (pao) => {
  const openedKey = `ceceyori_opened_${pao}`;
  localStorage.setItem(openedKey, new Date().toISOString().split('T')[0]);
};