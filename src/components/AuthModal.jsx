import { useState } from 'react';
import { Sparkles, ShieldCheck, User, ChevronLeft, Heart } from 'lucide-react';
import { DEFAULT_USER_PROFILE } from '../data/userProfile';
import { useLanguage } from '../i18n/LanguageContext';

const AVATAR_LIST = ['🌸', '✨', '🍓', '🎀', '👸', '🦄', '💄', '🫧', '🌷', '💎', '🌙', '☀️'];
const SKIN_TYPES = [
  'Normal',
  'Kering (Dry)',
  'Berminyak (Oily)',
  'Kombinasi / Sensitif',
  'Acne-Prone',
];

export default function AuthModal({ isOpen, userProfile, onLoginSuccess, onBackToLanding }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [enteredName, setEnteredName] = useState(userProfile?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || '🌸');
  const [selectedSkinType, setSelectedSkinType] = useState(userProfile?.skinType || 'Normal');
  const [enteredTagline, setEnteredTagline] = useState(userProfile?.tagline || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalName = enteredName.trim() || (isEn ? 'Glow Friend' : 'Teman Glow');
    const createdProfile = {
      ...DEFAULT_USER_PROFILE,
      ...userProfile,
      name: finalName,
      avatar: selectedAvatar,
      skinType: selectedSkinType,
      tagline: enteredTagline.trim() || (isEn ? 'Skincare Enthusiast ✨' : 'Perjalanan Glowing ✨'),
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
      <div className="bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl space-y-5 animate-scale-in relative overflow-hidden">
        
        {/* Ambient Top Blob */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-2xl pointer-events-none" />

        {/* Back button to Landing */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <ChevronLeft size={16} /> {isEn ? 'Back to Home' : 'Kembali ke Beranda'}
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-linear-to-tr from-pink-500 to-rose-400 text-white text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white animate-bounce-in">
            {selectedAvatar}
          </div>
          <h2 className="font-display font-bold text-2xl text-[#3D1F2A]">
            {isEn ? 'Create Your Glow Profile' : 'Buat Profil Skincare Kamu'}
          </h2>
          <p className="text-xs text-slate-500">
            {isEn
              ? 'Personalize your routine and track your daily glowing consistency'
              : 'Daftarkan nama dan jenis kulitmu untuk mulai memantau rutinitas harian'}
          </p>
        </div>

        {/* Onboarding / Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isEn ? 'Choose Avatar' : 'Pilih Avatar'}
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
              {isEn ? 'Your Name' : 'Nama Kamu'} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm font-semibold text-[#3D1F2A]"
                placeholder={isEn ? 'e.g. Amanda, Sophia...' : 'Contoh: Amanda, Sarah...'}
                required
              />
              <User size={16} className="absolute left-3.5 top-3 text-pink-400" />
            </div>
          </div>

          {/* Skin Type Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isEn ? 'Skin Type' : 'Tipe Kulit'}
            </label>
            <select
              value={selectedSkinType}
              onChange={(e) => setSelectedSkinType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
            >
              {SKIN_TYPES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Tagline / Bio (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              {isEn ? 'Bio / Skincare Goal (Optional)' : 'Bio Singkat / Target Kulit (Opsional)'}
            </label>
            <input
              type="text"
              value={enteredTagline}
              onChange={(e) => setEnteredTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
              placeholder={isEn ? 'e.g. Glowing & healthy skin barrier ✨' : 'Contoh: Pejuang skin barrier sehat ✨'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-display font-bold text-sm text-white bg-linear-to-r from-[#D06885] to-[#9B4B62] shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles size={16} />
            <span>{isEn ? 'Start Glowing Routine ✨' : '🌸 Mulai Rutinitas Skincare'}</span>
          </button>

          {/* Continue as Guest */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="text-xs font-semibold text-slate-400 hover:text-pink-600 transition-colors cursor-pointer"
            >
              {isEn ? 'Or continue as guest' : 'Atau lanjutkan sebagai tamu'}
            </button>
          </div>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>{isEn ? '100% Offline & Private: Data stored locally' : 'Data tersimpan privat di perangkat lokal Anda'}</span>
        </div>

      </div>
    </div>
  );
}
