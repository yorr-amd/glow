import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Globe,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Droplets,
  ShieldCheck,
  Flame,
  Star,
  Clock,
  Layers,
  Heart,
} from 'lucide-react';
import { DEFAULT_USER_PROFILE } from '../data/userProfile';
import { createAccount } from '../services/db';
import { saveCustomProducts } from '../data/skincareData';
import { useLanguage } from '../i18n/LanguageContext';

const AVATARS = ['🌸', '✨', '🍓', '🎀', '👸', '🦄', '💄', '🫧', '🌷', '💎', '🌙', '☀️'];

const SKIN_TYPE_KEYS = [
  { id: 'Normal', key: 'normal', icon: '✨' },
  { id: 'Kering (Dry)', key: 'dry', icon: '💧' },
  { id: 'Berminyak (Oily)', key: 'oily', icon: '🌿' },
  { id: 'Kombinasi / Sensitif', key: 'combo', icon: '🌸' },
  { id: 'Acne-Prone', key: 'acne', icon: '🛡️' },
];

const GOAL_KEYS = [
  { id: 'brightening', icon: '✨' },
  { id: 'barrier', icon: '🛡️' },
  { id: 'hydration', icon: '💧' },
  { id: 'smooth', icon: '🌸' },
  { id: 'acne', icon: '🌿' },
  { id: 'antiaging', icon: '⏳' },
  { id: 'soothing', icon: '🫧' },
];

// Helper to generate curated starter products based on skin type
export function generateStarterProducts(skinType) {
  const isAcne = skinType === 'Acne-Prone';
  const isDry = skinType.includes('Kering') || skinType === 'Dry';
  const isOily = skinType.includes('Berminyak') || skinType === 'Oily';

  return {
    pagi: [
      {
        id: `start_p1_${Date.now()}`,
        name: isAcne ? 'Salicylic Acid Gentle Cleanser' : (isDry ? 'Hydrating Milk Cleanser' : 'Gentle Foaming Cleanser'),
        desc: 'Membersihkan kotoran dan sebum tanpa merusak kelembapan alami kulit.',
        category: 'face',
        pao: '12M',
        isEssential: true,
        scheduleType: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: `start_p2_${Date.now()}`,
        name: isOily ? 'Oil-Free Gel Moisturizer' : (isDry ? 'Barrier Repair Rich Cream' : 'Daily Hydrating Moisturizer'),
        desc: 'Mengunci kelembapan kulit dan menjaga skin barrier sepanjang hari.',
        category: 'face',
        pao: '12M',
        isEssential: true,
        scheduleType: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: `start_p3_${Date.now()}`,
        name: 'Broad-Spectrum Sunscreen SPF 50+ PA++++',
        desc: 'Melindungi kulit dari paparan radiasi UV A, UV B, dan polusi luar ruangan.',
        category: 'face',
        pao: '12M',
        isEssential: true,
        scheduleType: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      },
    ],
    malam: [
      {
        id: `start_m1_${Date.now()}`,
        name: 'Micellar Water / Cleansing Balm',
        desc: 'Double cleansing untuk mengangkat sisa sunscreen dan polusi seharian.',
        category: 'face',
        pao: '12M',
        isEssential: true,
        scheduleType: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: `start_m2_${Date.now()}`,
        name: isDry ? 'Ceramide Deep Recovery Cream' : 'Night Soothing Moisturizer',
        desc: 'Nutrisi malam saat tidur agar kulit bangun dalam keadaan kenyal & segar.',
        category: 'face',
        pao: '12M',
        scheduleType: 'daily',
        scheduledDays: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        id: `start_m3_${Date.now()}`,
        name: 'Exfoliating Peeling Toner (AHA/BHA)',
        desc: 'Eksfoliasi sel kulit mati di lipatan kulit. Digunakan berkala pada malam terjadwal.',
        category: 'body',
        pao: '12M',
        scheduleType: 'custom_days',
        scheduledDays: [3, 6], // Rabu & Sabtu malam
      },
    ],
  };
}

export default function OnboardingWizard({
  userProfile = null,
  isNewAccount = true,
  onComplete,
  onCancel,
}) {
  const { lang, toggleLang, t, isEn } = useLanguage();

  // Wizard state: 1 to 6 (1: Name/Avatar, 2: Skin Type, 3: Goals, 4: Habits/Times, 5: Shelf Choice, 6: Ready/Pass)
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState('forward'); // 'forward' | 'backward'

  // Form State
  const [name, setName] = useState(userProfile?.name || '');
  const [avatar, setAvatar] = useState(userProfile?.avatar || '🌸');
  const [tagline, setTagline] = useState(userProfile?.tagline || '');
  const [skinType, setSkinType] = useState(userProfile?.skinType || 'Normal');
  const [goals, setGoals] = useState(
    Array.isArray(userProfile?.skinGoals) && userProfile.skinGoals.length > 0
      ? userProfile.skinGoals
      : ['brightening', 'barrier']
  );
  const [routineMode, setRoutineMode] = useState('full'); // 'full' | 'quick'
  const [shelfPreference, setShelfPreference] = useState('starter_kit'); // 'clean_slate' | 'starter_kit'
  const [createdProfileData, setCreatedProfileData] = useState(null);

  // Trigger confetti on final step
  useEffect(() => {
    if (currentStep === 6) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D06885', '#F59E0B', '#E8829D', '#F472B6', '#FBBF24'],
      });
    }
  }, [currentStep]);

  const goToNext = () => {
    if (currentStep < 5) {
      setDirection('forward');
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 5) {
      handlePrepareProfile();
    }
  };

  const goToBack = () => {
    if (currentStep > 1) {
      setDirection('backward');
      setCurrentStep((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const toggleGoal = (goalId) => {
    setGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handlePrepareProfile = () => {
    const finalName = name.trim() || (isEn ? 'Glow Beauty' : 'Sahabat Glow');
    const newId = isNewAccount || !userProfile?.id
      ? `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      : userProfile.id;

    const goalLabels = goals.map((g) => t(`onboarding.step3.goals.${g}`) || g);

    const newProfile = {
      ...DEFAULT_USER_PROFILE,
      ...(userProfile || {}),
      id: newId,
      name: finalName,
      avatar,
      skinType,
      tagline: tagline.trim() || (isEn ? 'Skincare Journey & Radiant Glow ✨' : 'Perjalanan Glowing & Skin Barrier Sehat ✨'),
      skinGoals: goalLabels.length > 0 ? goalLabels : ['Cerah Alami & Glowing', 'Skin Barrier Kuat'],
      memberSince: new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
      isRegistered: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    setCreatedProfileData(newProfile);
    setDirection('forward');
    setCurrentStep(6);
  };

  const handleFinalSubmit = async () => {
    if (!createdProfileData) return;

    // 1. Save profile into multi-account DB
    const saved = await createAccount(createdProfileData);

    // 2. If user opted for starter kit, populate initial products
    if (shelfPreference === 'starter_kit') {
      const starterKit = generateStarterProducts(createdProfileData.skinType);
      saveCustomProducts(starterKit, saved.id);
    }

    // 3. Callback to switch to dashboard
    onComplete(saved, { routineMode });
  };

  const handleQuickGuest = async () => {
    const guestId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const guestProfile = {
      ...DEFAULT_USER_PROFILE,
      id: guestId,
      name: isEn ? 'Glow Friend' : 'Pengguna Glow',
      avatar: '🌸',
      skinType: 'Normal',
      tagline: isEn ? 'Skincare Journey ✨' : 'Perjalanan Glowing ✨',
      skinGoals: ['Cerah Alami & Glowing', 'Skin Barrier Kuat'],
      memberSince: new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
      isRegistered: true,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    const saved = await createAccount(guestProfile);
    onComplete(saved, { routineMode: 'full' });
  };

  // Animation class based on step direction
  const animationClass = direction === 'forward' ? 'animate-step-right' : 'animate-step-left';

  return (
    <div className="min-h-screen bg-[#FDF5F7] text-[#3D1F2A] flex flex-col justify-between overflow-x-hidden relative selection:bg-pink-200 selection:text-pink-900">
      
      {/* 🌸 Ambient Fluid Atmospheric Background Orbs */}
      <div className="fixed -top-32 -right-32 w-96 h-96 rounded-full bg-linear-to-bl from-pink-300/35 via-rose-200/25 to-purple-200/20 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-32 -left-32 w-96 h-96 rounded-full bg-linear-to-tr from-amber-200/25 via-pink-200/30 to-purple-300/20 blur-3xl pointer-events-none" />

      {/* ══════════════════════════════════════════
          TOP HEADER: Minimal, Clean, Stepper
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 px-6 sm:px-12 py-5 flex items-center justify-between pt-safe backdrop-blur-xs">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-display font-bold text-xl text-[#3D1F2A] tracking-tight">
            Glow <span className="text-[#D06885]">✦</span>
          </span>
        </div>

        {/* Stepper Dots (1 to 5) */}
        {currentStep <= 5 && (
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-500 ${
                  s === currentStep
                    ? 'w-8 bg-linear-to-r from-[#D06885] to-[#9B4B62] shadow-xs'
                    : s < currentStep
                    ? 'w-2.5 bg-pink-300/80'
                    : 'w-2 bg-pink-200/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Right Actions: Lang Switcher & Cancel */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 border border-pink-200/80 text-xs font-bold text-[#8B3E53] hover:bg-pink-100 transition-all shadow-2xs cursor-pointer"
            title="Switch Language"
          >
            <Globe size={13} className="text-[#D06885]" />
            <span className="font-mono text-[11px] uppercase">{lang}</span>
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              type="button"
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer px-2 py-1"
            >
              {t('onboarding.backToHome')}
            </button>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════
          CENTER CONTENT: Expansive Cardless Questions
      ══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto px-6 sm:px-8 py-8 relative z-10">
        
        {/* ── STEP 1: NAMA & AVATAR ── */}
        {currentStep === 1 && (
          <div key="step-1" className={`space-y-8 ${animationClass}`}>
            <div className="text-center space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.step1.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.step1.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.step1.subtitle')}
              </p>
            </div>

            {/* Expansive Underline Name Input */}
            <div className="max-w-md mx-auto pt-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('onboarding.step1.namePlaceholder')}
                autoFocus
                className="w-full text-center text-2xl sm:text-3xl font-display font-bold text-[#3D1F2A] placeholder:text-pink-300 bg-transparent border-b-2 border-pink-200 focus:border-[#D06885] focus:outline-none transition-all py-3 px-4"
              />
            </div>

            {/* Avatar Selector */}
            <div className="space-y-3 text-center pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('onboarding.step1.avatarLabel')}
              </label>
              <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 cursor-pointer ${
                      avatar === av
                        ? 'bg-white shadow-md ring-3 ring-[#D06885] scale-110'
                        : 'bg-white/60 hover:bg-white/90 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Tagline / Affirmation Input */}
            <div className="max-w-md mx-auto pt-2">
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={t('onboarding.step1.taglinePlaceholder')}
                className="w-full text-center text-xs text-slate-500 placeholder:text-slate-300 bg-transparent border-b border-pink-100 focus:border-pink-300 focus:outline-none transition-all py-2 px-3"
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: TIPE KULIT ── */}
        {currentStep === 2 && (
          <div key="step-2" className={`space-y-8 ${animationClass}`}>
            <div className="text-center space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.step2.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.step2.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.step2.subtitle')}
              </p>
            </div>

            {/* Skin Types Interactive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto pt-2">
              {SKIN_TYPE_KEYS.map((item) => {
                const isSelected = skinType === item.id;
                const typeName = t(`onboarding.step2.types.${item.key}.name`) || item.id;
                const typeDesc = t(`onboarding.step2.types.${item.key}.desc`) || '';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSkinType(item.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 flex items-start gap-3.5 cursor-pointer relative ${
                      isSelected
                        ? 'bg-white/95 shadow-md ring-2 ring-[#D06885] border-transparent scale-[1.01]'
                        : 'bg-white/50 hover:bg-white/80 border border-pink-100/80 hover:border-pink-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors ${
                        isSelected ? 'bg-pink-100/90 text-[#D06885]' : 'bg-pink-50/60 text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 pr-6">
                      <h3 className="font-bold text-sm text-[#3D1F2A] mb-0.5">{typeName}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">{typeDesc}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#D06885] text-white flex items-center justify-center shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: TARGET & MASALAH KULIT ── */}
        {currentStep === 3 && (
          <div key="step-3" className={`space-y-8 ${animationClass}`}>
            <div className="text-center space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.step3.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.step3.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.step3.subtitle')}
              </p>
            </div>

            {/* Goals Multi-Select Cloud Pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto pt-4">
              {GOAL_KEYS.map((goal) => {
                const isSelected = goals.includes(goal.id);
                const label = t(`onboarding.step3.goals.${goal.id}`) || goal.id;

                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={`px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-linear-to-r from-[#D06885] to-[#9B4B62] text-white shadow-md shadow-pink-500/25 scale-[1.03]'
                        : 'bg-white/70 hover:bg-white text-slate-600 border border-pink-100 hover:border-pink-300 shadow-2xs'
                    }`}
                  >
                    <span>{goal.icon}</span>
                    <span>{label}</span>
                    {isSelected && <Check size={14} className="ml-1" strokeWidth={2.5} />}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-slate-400 font-sans">
              {goals.length} {isEn ? 'goals selected' : 'target dipilih'}
            </p>
          </div>
        )}

        {/* ── STEP 4: WAKTU RUTINITAS & MODE ── */}
        {currentStep === 4 && (
          <div key="step-4" className={`space-y-8 ${animationClass}`}>
            <div className="text-center space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.step4.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.step4.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.step4.subtitle')}
              </p>
            </div>

            {/* 4 Atmospheric Phases Showcase */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-white/60 border border-amber-200/60 text-center space-y-1.5">
                <span className="text-2xl">☀️</span>
                <h4 className="font-bold text-xs text-amber-900">{t('onboarding.step4.phases.pagi.title')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('onboarding.step4.phases.pagi.desc')}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/60 border border-sky-200/60 text-center space-y-1.5">
                <span className="text-2xl">🌤️</span>
                <h4 className="font-bold text-xs text-sky-900">{t('onboarding.step4.phases.siang.title')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('onboarding.step4.phases.siang.desc')}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/60 border border-rose-200/60 text-center space-y-1.5">
                <span className="text-2xl">🌇</span>
                <h4 className="font-bold text-xs text-rose-900">{t('onboarding.step4.phases.sore.title')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('onboarding.step4.phases.sore.desc')}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/60 border border-purple-200/60 text-center space-y-1.5">
                <span className="text-2xl">🌙</span>
                <h4 className="font-bold text-xs text-purple-900">{t('onboarding.step4.phases.malam.title')}</h4>
                <p className="text-[11px] text-slate-500 leading-snug">{t('onboarding.step4.phases.malam.desc')}</p>
              </div>
            </div>

            {/* Routine Mode Selector (Full vs Quick) */}
            <div className="max-w-md mx-auto pt-2 space-y-2">
              <label className="block text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                {t('onboarding.step4.modeLabel')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoutineMode('full')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routineMode === 'full'
                      ? 'bg-pink-100 text-[#D06885] ring-2 ring-[#D06885] shadow-xs'
                      : 'bg-white/60 text-slate-500 hover:bg-white'
                  }`}
                >
                  ✨ {t('onboarding.step4.modeFull')}
                </button>
                <button
                  type="button"
                  onClick={() => setRoutineMode('quick')}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routineMode === 'quick'
                      ? 'bg-pink-100 text-[#D06885] ring-2 ring-[#D06885] shadow-xs'
                      : 'bg-white/60 text-slate-500 hover:bg-white'
                  }`}
                >
                  ⚡ {t('onboarding.step4.modeQuick')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: LEMARI SKINCARE AWAL ── */}
        {currentStep === 5 && (
          <div key="step-5" className={`space-y-8 ${animationClass}`}>
            <div className="text-center space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.step5.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.step5.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.step5.subtitle')}
              </p>
            </div>

            {/* Starter Choice: Clean Slate vs Starter Kit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto pt-2">
              <button
                type="button"
                onClick={() => setShelfPreference('clean_slate')}
                className={`p-5 rounded-2xl text-left transition-all duration-300 relative cursor-pointer ${
                  shelfPreference === 'clean_slate'
                    ? 'bg-white shadow-md ring-2 ring-[#D06885] scale-[1.02]'
                    : 'bg-white/50 hover:bg-white/80 border border-pink-100'
                }`}
              >
                <div className="text-3xl mb-3">🧼</div>
                <h3 className="font-bold text-sm text-[#3D1F2A] mb-1">
                  {t('onboarding.step5.cleanSlateTitle')}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('onboarding.step5.cleanSlateDesc')}
                </p>
                {shelfPreference === 'clean_slate' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#D06885] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShelfPreference('starter_kit')}
                className={`p-5 rounded-2xl text-left transition-all duration-300 relative cursor-pointer ${
                  shelfPreference === 'starter_kit'
                    ? 'bg-white shadow-md ring-2 ring-[#D06885] scale-[1.02]'
                    : 'bg-white/50 hover:bg-white/80 border border-pink-100'
                }`}
              >
                <div className="text-3xl mb-3">🧴</div>
                <h3 className="font-bold text-sm text-[#3D1F2A] mb-1">
                  {t('onboarding.step5.starterKitTitle')}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('onboarding.step5.starterKitDesc')}
                </p>
                {shelfPreference === 'starter_kit' && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#D06885] text-white flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 6: READY TO GLOW / CELEBRATION ── */}
        {currentStep === 6 && createdProfileData && (
          <div key="step-6" className="space-y-8 animate-step-fade text-center">
            <div className="space-y-3">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-pink-100/90 text-[#D06885] border border-pink-200/60">
                {t('onboarding.ready.badge')}
              </span>
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[#3D1F2A] leading-tight">
                {t('onboarding.ready.title')}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto font-sans leading-relaxed">
                {t('onboarding.ready.subtitle')}
              </p>
            </div>

            {/* Aesthetic Glassmorphic Member ID Pass */}
            <div className="max-w-md mx-auto p-6 sm:p-7 rounded-3xl bg-linear-to-br from-white/90 via-pink-50/80 to-rose-100/60 border border-white/60 shadow-xl relative overflow-hidden text-left space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-pink-200/60">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{createdProfileData.avatar}</span>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#3D1F2A]">
                      {createdProfileData.name}
                    </h3>
                    <p className="text-[10px] text-[#D06885] font-mono tracking-wider">
                      {createdProfileData.id.slice(0, 14)}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-100 text-[#D06885] border border-pink-200">
                  {t('onboarding.ready.memberCard')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {t('onboarding.skinType', 'Tipe Kulit')}
                  </span>
                  <span className="font-semibold text-slate-700">{createdProfileData.skinType}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                    {isEn ? 'Routine Style' : 'Gaya Rutinitas'}
                  </span>
                  <span className="font-semibold text-slate-700 capitalize">{routineMode} Mode</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  {t('onboarding.skinGoals', 'Target Kulit')}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {createdProfileData.skinGoals.slice(0, 3).map((g, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-pink-700 border border-pink-200/70"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-4 rounded-2xl font-display font-bold text-base text-white bg-linear-to-r from-[#D06885] to-[#9B4B62] shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t('onboarding.ready.enterApp')}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════
          BOTTOM BAR: Floaty Navigation Controls
      ══════════════════════════════════════════ */}
      {currentStep <= 5 && (
        <footer className="sticky bottom-0 z-40 px-6 sm:px-12 py-5 pb-safe backdrop-blur-xs flex items-center justify-between max-w-3xl w-full mx-auto">
          {/* Back or Skip */}
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-white/60 transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
              <span>{t('onboarding.back')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleQuickGuest}
              className="text-xs font-semibold text-slate-400 hover:text-[#D06885] transition-colors cursor-pointer"
            >
              {t('onboarding.skipGuest')}
            </button>
          )}

          {/* Forward / Next Button */}
          <button
            type="button"
            onClick={goToNext}
            disabled={currentStep === 1 && !name.trim()}
            className="flex items-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-linear-to-r from-[#D06885] to-[#9B4B62] shadow-md shadow-pink-500/25 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span>{t('onboarding.next')}</span>
            <ChevronRight size={16} />
          </button>
        </footer>
      )}

    </div>
  );
}
