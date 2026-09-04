import React, { useState } from 'react';
import {
  X,
  User,
  Heart,
  Sparkles,
  ShieldCheck,
  Bell,
  Clock,
  LogOut,
  Save,
  CheckCircle2,
  Crown,
  Smile,
  Flame,
  RefreshCw,
  Download,
  Trash2,
} from 'lucide-react';
import { saveUserProfile } from '../data/userProfile';
import {
  checkForAppUpdates,
  isAutoUpdateEnabled,
  setAutoUpdateEnabled,
  APP_VERSION,
} from '../utils/autoUpdateService';

const AVATAR_OPTIONS = ['🌸', '✨', '🍓', '🎀', '👸', '🦄', '💄', '🫧', '🌷', '💎', '🌙', '☀️'];
const SKIN_TYPES = [
  'Normal',
  'Kering (Dry)',
  'Berminyak (Oily)',
  'Kombinasi / Sensitif',
  'Acne-Prone',
];

export default function AccountModal({ isOpen, onClose, userProfile, onUpdateProfile, onLogout, streak = 1, onShowUpdate, onResetAllData }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'skin' | 'settings'
  const [formData, setFormData] = useState({ ...userProfile });
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Sync formData when userProfile prop changes
  React.useEffect(() => {
    if (userProfile) {
      setFormData({ ...userProfile });
    }
  }, [userProfile]);

  // Auto update settings state
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(isAutoUpdateEnabled());
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateStatusMsg, setUpdateStatusMsg] = useState('');

  const handleToggleAutoUpdate = (e) => {
    const val = e.target.checked;
    setAutoUpdateChecked(val);
    setAutoUpdateEnabled(val);
  };

  const handleManualCheckUpdate = async () => {
    setIsCheckingUpdate(true);
    setUpdateStatusMsg('');
    try {
      const result = await checkForAppUpdates({ force: true });
      if (result.updateAvailable) {
        setUpdateStatusMsg(`Pembaruan tersedia: v${result.latestVersion}! 🚀`);
        if (onShowUpdate) {
          onShowUpdate(result);
        }
      } else {
        setUpdateStatusMsg(`Aplikasi sudah versi terbaru (v${APP_VERSION}) 🌸`);
      }
    } catch (err) {
      setUpdateStatusMsg(`Gagal memeriksa pembaruan: ${err.message}`);
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveUserProfile(formData);
    onUpdateProfile(formData);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-xl border border-pink-200/80 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-2xl shadow-md border-2 border-white">
              {formData.avatar || '🌸'}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#3D1F2A] flex items-center gap-1.5">
                {formData.name} <Crown size={15} className="text-amber-500" />
              </h2>
              <p className="text-xs text-slate-500">{formData.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-pink-100 bg-pink-50/40 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={14} /> Profil & Avatar
          </button>
          <button
            onClick={() => setActiveTab('skin')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'skin'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sparkles size={14} /> Tipe Kulit & Goals
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <Bell size={14} /> Preferensi
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Avatar Ikon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => handleChange('avatar', av)}
                      className={`p-2.5 rounded-xl text-xl flex items-center justify-center transition-all border ${
                        formData.avatar === av
                          ? 'bg-pink-100 border-pink-400 scale-110 shadow-sm'
                          : 'bg-white/80 border-slate-100 hover:bg-pink-50'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nama Panggilan
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                  placeholder="Masukkan nama kamu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bio / Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                  placeholder="Bio singkat kamu"
                />
              </div>

              {/* Achievement stats badge */}
              <div className="p-4 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center font-bold">
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#3D1F2A]">Status Streak Saat Ini</p>
                    <p className="text-xs text-amber-700">{streak} Hari Konsisten Skincare 🔥</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Aktif
                </span>
              </div>
            </div>
          )}

          {activeTab === 'skin' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tipe Kulit
                </label>
                <select
                  value={formData.skinType}
                  onChange={(e) => handleChange('skinType', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                >
                  {SKIN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Fokus Perawatan Utama
                </label>
                <input
                  type="text"
                  value={formData.primaryConcern}
                  onChange={(e) => handleChange('primaryConcern', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                  placeholder="Contoh: Eksfoliasi lipatan, mencerahkan kulit"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Produk Skincare Favorit
                </label>
                <input
                  type="text"
                  value={formData.favoriteProduct}
                  onChange={(e) => handleChange('favoriteProduct', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm text-[#3D1F2A]"
                  placeholder="Contoh: Sonik Scents (Toner Merah)"
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/90 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3D1F2A]">Notifikasi Pengingat Desktop</p>
                  <p className="text-[11px] text-slate-500">Pop-up pengingat di pojok Windows saat jam skincare</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.notificationsEnabled}
                  onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-4 bg-white/90 rounded-2xl border border-pink-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#3D1F2A]">Efek Suara & Confetti</p>
                  <p className="text-[11px] text-slate-500">Animasi perayaan saat rutinitas 100% selesai</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.soundEffectsEnabled}
                  onChange={(e) => handleChange('soundEffectsEnabled', e.target.checked)}
                  className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                />
              </div>

              {/* Pembaruan Aplikasi & Auto Update Card */}
              <div className="p-4 bg-linear-to-br from-pink-50/70 to-white rounded-2xl border border-pink-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-pink-100 text-[#D06885] flex items-center justify-center font-bold text-xs">
                      ✦
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3D1F2A] flex items-center gap-1.5">
                        <span>Pembaruan Aplikasi</span>
                        <span className="text-[10px] font-mono bg-pink-100 text-[#9B4B62] px-1.5 py-0.5 rounded-md font-bold">
                          v{APP_VERSION}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500">Auto-update APK Android & Desktop</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoUpdateChecked}
                      onChange={handleToggleAutoUpdate}
                      className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-pink-100">
                  <p className="text-[11px] text-slate-500">
                    {autoUpdateChecked ? 'Otomatis cek versi baru saat aplikasi dibuka' : 'Auto update dinonaktifkan'}
                  </p>
                  <button
                    type="button"
                    onClick={handleManualCheckUpdate}
                    disabled={isCheckingUpdate}
                    className="px-3 py-1.5 rounded-xl bg-white border border-pink-200 text-[#D06885] hover:bg-pink-50 text-xs font-bold shadow-2xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw size={12} className={isCheckingUpdate ? 'animate-spin' : ''} />
                    <span>{isCheckingUpdate ? 'Memeriksa...' : 'Cek Sekarang'}</span>
                  </button>
                </div>

                {updateStatusMsg && (
                  <p className="text-[11px] font-semibold text-pink-700 bg-pink-50 p-2 rounded-xl border border-pink-100 animate-fade-in">
                    {updateStatusMsg}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2.5 rounded-xl border border-pink-200 text-slate-600 hover:bg-pink-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={14} /> Keluar / Kembali ke Beranda
                </button>
                {onResetAllData && (
                  <button
                    type="button"
                    onClick={onResetAllData}
                    className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} /> Kosongkan Semua Data & Reset Akun
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Success toast message */}
          {isSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-bounce-in">
              <CheckCircle2 size={16} /> Profil berhasil disimpan dengan indah! ✨
            </div>
          )}

          {/* Save Button */}
          <div className="pt-2 flex justify-end gap-2 border-t border-pink-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-all"
            >
              Tutup
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Save size={14} /> Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
