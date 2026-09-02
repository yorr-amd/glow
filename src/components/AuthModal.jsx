import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, User, Lock, ChevronLeft } from 'lucide-react';

export default function AuthModal({ isOpen, userProfile, onLoginSuccess, onBackToLanding, mode = 'sore' }) {
  if (!isOpen) return null;

  const [enteredName, setEnteredName] = useState(userProfile?.name || 'Cece Yori');
  const [isNewUserMode, setIsNewUserMode] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (enteredName.trim()) {
      onLoginSuccess({
        ...userProfile,
        name: enteredName.trim(),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl w-full max-w-md p-8 shadow-2xl space-y-6 animate-scale-in relative overflow-hidden">
        
        {/* Ambient Top Blob */}
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-400/20 blur-2xl pointer-events-none" />

        {/* Back button to Landing */}
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-all"
        >
          <ChevronLeft size={16} /> Kembali ke Beranda
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white text-3xl flex items-center justify-center mx-auto shadow-md border-2 border-white animate-bounce-in">
            {userProfile?.avatar || '🌸'}
          </div>
          <h2 className="font-display font-bold text-2xl text-[#3D1F2A]">
            Selamat Datang di Glow Tracker
          </h2>
          <p className="text-xs text-slate-500">
            {isNewUserMode ? 'Masukkan nama profil skincare kamu' : 'Masuk untuk membuka checklist rutinitas harianmu'}
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Pengguna
            </label>
            <div className="relative">
              <input
                type="text"
                value={enteredName}
                onChange={(e) => setEnteredName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white/90 text-sm font-semibold text-[#3D1F2A]"
                placeholder="Nama kamu..."
                required
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-pink-400" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-md hover:shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Masuk sebagai {enteredName || 'Cece'} 🌸</span>
          </button>
        </form>

        {/* Security badge */}
        <div className="pt-2 border-t border-pink-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          <span>Data tersimpan aman di perangkat lokal native</span>
        </div>

      </div>
    </div>
  );
}
