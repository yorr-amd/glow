import { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  User,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Lock,
  Check,
  Crown,
  Smile,
} from 'lucide-react';
import { DEFAULT_USER_PROFILE } from '../data/userProfile';
import { useLanguage } from '../i18n/LanguageContext';

const AVATAR_LIST = ['🌸', '✨', '🍓', '🎀', '👸', '🦄', '💄', '🫧', '🌷', '💎', '🌙', '☀️'];

const SKIN_TYPES = [
  { id: 'Normal', labelId: 'Normal', labelEn: 'Normal', descId: 'Seimbang, kenyal & sehat', descEn: 'Balanced, supple & healthy', icon: '✨' },
  { id: 'Kering (Dry)', labelId: 'Kering (Dry)', labelEn: 'Dry Skin', descId: 'Cenderung kaku & butuh hidrasi', descEn: 'Needs deep hydration & barrier care', icon: '💧' },
  { id: 'Berminyak (Oily)', labelId: 'Berminyak (Oily)', labelEn: 'Oily Skin', descId: 'Kontrol sebum & pori-pori', descEn: 'Sebum control & pore care', icon: '🌿' },
  { id: 'Kombinasi / Sensitif', labelId: 'Kombinasi / Sensitif', labelEn: 'Combo / Sensitive', descId: 'Lembut & mudah reaktif', descEn: 'Gentle & calming formulas', icon: '🌸' },
  { id: 'Acne-Prone', labelId: 'Acne-Prone', labelEn: 'Acne-Prone', descId: 'Perawatan jerawat & kemerahan', descEn: 'Acne care & redness relief', icon: '🛡️' },
];

const AVAILABLE_GOALS = [
  { id: 'brightening', labelId: 'Cerah Alami & Glowing', labelEn: 'Radiant Glow' },
  { id: 'barrier', labelId: 'Skin Barrier Kuat', labelEn: 'Strong Barrier' },
  { id: 'hydration', labelId: 'Hidrasi Kenyal Seharian', labelEn: 'Deep Hydration' },
  { id: 'smooth', labelId: 'Tekstur Kulit Lembut', labelEn: 'Smooth Texture' },
  { id: 'acne', labelId: 'Bebas Jerawat & Pori Rapi', labelEn: 'Clear Pores & Anti-Acne' },
  { id: 'antiaging', labelId: 'Awet Muda & Elastis', labelEn: 'Firm & Youthful' },
];

export default function AuthModal({ isOpen, userProfile, onLoginSuccess, onBackToLanding, onClose }) {
  const { lang, t } = useLanguage();
  const isEn = lang === 'en';

  const [step, setStep] = useState(1);
  const [enteredName, setEnteredName] = useState(userProfile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || '🌸');
  const [selectedSkinType, setSelectedSkinType] = useState(userProfile?.skinType || 'Normal');
  const [enteredTagline, setEnteredTagline] = useState(userProfile?.tagline || '');
  const [selectedGoals, setSelectedGoals] = useState(
    Array.isArray(userProfile?.skinGoals) && userProfile.skinGoals.length > 0
      ? userProfile.skinGoals
      : ['Cerah Alami & Glowing', 'Skin Barrier Kuat']
  );

  if (!isOpen) return null;

  const toggleGoal = (goalText) => {
    setSelectedGoals((prev) =>
      prev.includes(goalText)
        ? prev.filter((g) => g !== goalText)
        : [...prev, goalText]
    );
  };

  const handleFinish = () => {
    const finalName = enteredName.trim() || (isEn ? 'Glow Beauty' : 'Sahabat Glow');
    const createdProfile = {
      ...DEFAULT_USER_PROFILE,
      ...userProfile,
      name: finalName,
      avatar: selectedAvatar,
      skinType: selectedSkinType,
      tagline: enteredTagline.trim() || (isEn ? 'Skincare Journey & Radiant Glow ✨' : 'Perjalanan Glowing & Skin Barrier Sehat ✨'),
      skinGoals: selectedGoals.length > 0 ? selectedGoals : ['Cerah Alami & Glowing', 'Skin Barrier Kuat'],
      memberSince: new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
        month: 'long',
        year: 'numeric',
      }).format(new Date()),
      isRegistered: true,
    };
    onLoginSuccess(createdProfile);
  };

  const handleContinueAsGuest = () => {
    const guestProfile = {
      ...DEFAULT_USER_PROFILE,
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
    };
    onLoginSuccess(guestProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-4 animate-scale-in relative overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-gradient-to-br from-pink-400/25 to-purple-400/25 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-gradient-to-tr from-rose-300/20 to-amber-300/20 blur-2xl pointer-events-none" />

        {/* Top Header & Navigation */}
        <div className="flex items-center justify-between relative z-10">
          {onBackToLanding ? (
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} /> {isEn ? 'Back to Home' : 'Kembali'}
            </button>
          ) : (
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
              ✦ Glow Onboarding
            </span>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer font-medium"
            >
              {isEn ? 'Close' : 'Tutup'}
            </button>
          )}
        </div>

        {/* Step Indicator Pills */}
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between gap-1.5 px-1">
            {[
              { num: 1, label: isEn ? 'Profile' : 'Profil' },
              { num: 2, label: isEn ? 'Skin & Goals' : 'Kulit & Target' },
              { num: 3, label: isEn ? 'Routine' : 'Rutinitas' },
              { num: 4, label: isEn ? 'Ready!' : 'Siap Glow!' },
            ].map((s) => (
              <div
                key={s.num}
                onClick={() => {
                  // Allow jumping to completed or next step
                  if (s.num <= step) setStep(s.num);
                }}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all ${
                  step === s.num
                    ? 'bg-pink-100/90 text-[#3D1F2A] shadow-xs border border-pink-300'
                    : step > s.num
                    ? 'bg-pink-50/60 text-pink-700 cursor-pointer'
                    : 'bg-slate-100/60 text-slate-400'
                }`}
              >
                <span>{step > s.num ? '✓' : s.num}.</span>
                <span className="truncate">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Progress Line */}
          <div className="w-full h-1 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#D06885] via-pink-500 to-[#9B4B62] transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Step Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4 relative z-10">

          {/* ──────── STEP 1: PROFIL & AVATAR ──────── */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-pink-500 to-rose-400 text-white text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white animate-bounce-in">
                  {selectedAvatar}
                </div>
                <h3 className="font-display font-bold text-xl text-[#3D1F2A]">
                  {t('onboarding.step1Title', isEn ? 'Create Your Glow Profile' : 'Buat Profil Cantikmu')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('onboarding.step1Subtitle', isEn ? 'Personalize your name and avatar to begin your journey' : 'Personalisasikan nama dan avatar kesayangan untuk memulai')}
                </p>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isEn ? 'Choose Avatar' : 'Pilih Avatar Favorit'}
                </label>
                <div className="flex flex-wrap gap-1.5 justify-center p-2 bg-pink-50/60 border border-pink-100 rounded-2xl">
                  {AVATAR_LIST.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-white shadow-md border border-pink-300 scale-110'
                          : 'hover:bg-white/60'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isEn ? 'Display Name / Nickname' : 'Nama Panggilan Kesayangan'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={enteredName}
                    onChange={(e) => setEnteredName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm font-semibold text-[#3D1F2A]"
                    placeholder={isEn ? 'e.g. Yori, Amanda, Sophia...' : 'Contoh: Yori, Amanda, Sarah...'}
                    required
                  />
                  <User size={16} className="absolute left-3.5 top-3 text-pink-400" />
                </div>
              </div>

              {/* Bio / Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isEn ? 'Skincare Motto / Tagline' : 'Motto / Tagline Skincare Favorit'}
                </label>
                <input
                  type="text"
                  value={enteredTagline}
                  onChange={(e) => setEnteredTagline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                  placeholder={isEn ? 'e.g. Glow while you rest ✨' : 'Contoh: Konsisten merawat skin barrier sehat ✨'}
                />
              </div>
            </div>
          )}

          {/* ──────── STEP 2: TIPE KULIT & SKIN GOALS ──────── */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-2xl">✨</span>
                <h3 className="font-display font-bold text-xl text-[#3D1F2A]">
                  {t('onboarding.step2Title', isEn ? 'Know Your Skin' : 'Kenali Kulit Cantikmu')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('onboarding.step2Subtitle', isEn ? 'Select your skin type and your dream skincare goals' : 'Pilih tipe kulit dan target glowing yang ingin kamu capai')}
                </p>
              </div>

              {/* Skin Type Cards */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('onboarding.skinType', isEn ? 'Skin Type' : 'Tipe Kulit')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SKIN_TYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedSkinType(st.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        selectedSkinType === st.id
                          ? 'bg-pink-50/90 border-pink-400 shadow-xs'
                          : 'bg-white/70 border-pink-100 hover:bg-white hover:border-pink-200'
                      }`}
                    >
                      <span className="text-lg">{st.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#3D1F2A]">
                          {isEn ? st.labelEn : st.labelId}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {isEn ? st.descEn : st.descId}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Goals Multi-select Chips */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t('onboarding.skinGoals', isEn ? 'Skin Goals' : 'Target Kulit Impian')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_GOALS.map((goal) => {
                    const text = isEn ? goal.labelEn : goal.labelId;
                    const isSelected = selectedGoals.includes(text);
                    return (
                      <button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(text)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
                          isSelected
                            ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-xs scale-102'
                            : 'bg-white/80 border-pink-200 text-slate-600 hover:border-pink-300'
                        }`}
                      >
                        {isSelected && <Check size={13} />}
                        <span>{text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ──────── STEP 3: 4 FASE WAKTU & TONER MERAH LOCK ──────── */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center space-y-1">
                <span className="text-2xl">☀️🌙</span>
                <h3 className="font-display font-bold text-xl text-[#3D1F2A]">
                  {t('onboarding.step3Title', isEn ? '4-Phase Routine & Safety Lock' : '4 Fase Skincare & Safety Lock')}
                </h3>
                <p className="text-xs text-slate-500">
                  {t('onboarding.step3Subtitle', isEn ? 'Learn the daily rhythm and exfoliation protection rule' : 'Ketahui ritme perawatan harian dan proteksi eksfoliasi')}
                </p>
              </div>

              {/* 4 Phases Preview */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sun size={14} className="text-amber-500" />
                    <span>{isEn ? 'Morning (05:00 - 10:59)' : 'Pagi (05:00 - 10:59)'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {isEn ? 'Start fresh & UV protection with Sunscreen' : 'Awali hari fresh & lindungi kulit dengan Sunscreen'}
                  </p>
                </div>

                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <CloudSun size={14} className="text-sky-500" />
                    <span>{isEn ? 'Midday (11:00 - 14:59)' : 'Siang (11:00 - 14:59)'}</span>
                  </div>
                  <p className="text-[11px] text-sky-800">
                    {isEn ? 'Reapply protection & refresh hydration' : 'Reapply perlindungan & semprot Face Mist'}
                  </p>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <Sunset size={14} className="text-rose-500" />
                    <span>{isEn ? 'Sunset (15:00 - 18:59)' : 'Sore (15:00 - 18:59)'}</span>
                  </div>
                  <p className="text-[11px] text-rose-800">
                    {isEn ? 'Cleanse daytime dust & double cleansing' : 'Bersihkan debu harian dengan Micellar Water'}
                  </p>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Moon size={14} className="text-purple-500" />
                    <span>{isEn ? 'Night (19:00 - 04:59)' : 'Malam (19:00 - 04:59)'}</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    {isEn ? 'Deep skin repair & nourishing night routine' : 'Regenerasi mendalam & nutrisi kulit malam'}
                  </p>
                </div>
              </div>

              {/* Special Red Toner Safety Rule Card */}
              <div className="p-3.5 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Lock size={16} />
                </div>
                <div className="space-y-0.5 text-xs">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <span>{t('onboarding.safetyLockTitle', 'Proteksi Eksfoliasi 🔒')}</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.2 rounded-md font-semibold">
                      Strict Safety
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {t(
                      'onboarding.safetyLockDesc',
                      'Toner Merah (Sonik Scents) hanya dibuka pada hari Rabu & Sabtu malam demi menjaga skin barrier kamu tetap aman dari over-exfoliasi.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ──────── STEP 4: SIAP GLOWING ──────── */}
          {step === 4 && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 text-white text-4xl flex items-center justify-center mx-auto shadow-xl border-4 border-white animate-bounce-in">
                {selectedAvatar}
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-2xl text-[#3D1F2A] flex items-center justify-center gap-2">
                  <span>{t('onboarding.step4Title', isEn ? "You're Ready to Glow!" : 'Siap Tampil Glowing!')}</span>
                  <Sparkles size={20} className="text-amber-500" />
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {t(
                    'onboarding.step4Subtitle',
                    isEn
                      ? 'Everything is set. Time to love and care for your skin every day'
                      : 'Profil dan jadwalmu sudah siap. Waktunya mencintai dan merawat kulitmu setiap hari!'
                  )}
                </p>
              </div>

              {/* Profile Card Preview */}
              <div className="p-4 bg-white/80 border border-pink-200/80 rounded-2xl shadow-xs text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedAvatar}</span>
                    <div>
                      <div className="font-bold text-sm text-[#3D1F2A] flex items-center gap-1">
                        {enteredName.trim() || (isEn ? 'Glow Beauty' : 'Sahabat Glow')}
                        <Crown size={14} className="text-amber-500" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {enteredTagline || (isEn ? 'Glowing Journey ✨' : 'Perjalanan Glowing ✨')}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700">
                    {selectedSkinType}
                  </span>
                </div>

                <div className="pt-2 border-t border-pink-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Skin Goals
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedGoals.map((g) => (
                      <span key={g} className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-150 font-medium">
                        ✦ {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Motivational Tip */}
              <div className="p-3 bg-pink-50/60 border border-pink-100 rounded-xl text-xs text-pink-900 flex items-center gap-2">
                <Heart size={16} className="text-pink-500 shrink-0" />
                <span>
                  {isEn
                    ? 'Tip: Complete your daily routines to keep your flame streak burning bright! 🔥'
                    : 'Tip: Selesaikan rutinitas setiap hari agar api streak kamu terus menyala terang! 🔥'}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="pt-3 border-t border-pink-100 flex items-center justify-between gap-3 relative z-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-pink-200 text-xs font-bold text-slate-600 hover:bg-pink-50 transition-all flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} />
              <span>{t('onboarding.back', isEn ? 'Back' : 'Kembali')}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="text-xs font-semibold text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"
            >
              {isEn ? 'Continue as Guest' : 'Lanjut sebagai Tamu'}
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                // If on step 1 and name is empty, provide friendly default or allow
                setStep((s) => s + 1);
              }}
              className="ml-auto px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t('onboarding.next', isEn ? 'Continue' : 'Lanjut')}</span>
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="ml-auto px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-lg hover:shadow-xl active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Sparkles size={14} />
              <span>{t('onboarding.finish', isEn ? 'Start Glowing Now ✨' : '🌸 Mulai Glowing Sekarang')}</span>
            </button>
          )}
        </div>

        {/* Security badge */}
        <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>{isEn ? '100% Offline & Private: All data stored locally' : 'Data tersimpan privat di perangkat lokal Anda'}</span>
        </div>

      </div>
    </div>
  );
}
