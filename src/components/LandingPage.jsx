import React from 'react';
import ThreeAtmosphereCanvas from './ThreeAtmosphereCanvas';
import { modeConfig } from '../data/skincareData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame,
  Clock,
  Heart,
  Droplets,
  Calendar,
  Lock,
  User,
  Star,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function LandingPage({ mode = 'sore', userProfile, onEnterApp }) {
  const { lang, toggleLang, t, isEn } = useLanguage();
  const currentConfig = modeConfig[mode] || modeConfig.sore;

  return (
    <div className="min-h-screen bg-[#FDF5F7] text-[#3D1F2A] flex flex-col selection:bg-pink-200 selection:text-pink-900 animate-fade-in overflow-x-hidden">
      
      {/* ══════════════════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-pink-100/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🌸</span>
            <span className="font-display font-bold text-xl text-[#3D1F2A] tracking-tight">
              Glow <span className="text-[#D06885]">✦</span>
            </span>
          </div>

          {/* Real-time Status, Language & CTA */}
          <div className="flex items-center gap-3">
            {/* 🌐 Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/80 border border-pink-200 text-xs font-bold text-[#8B3E53] hover:bg-pink-100 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              title={t('nav.languageToggleTooltip', 'Ganti Bahasa / Switch Language')}
            >
              <Globe size={13} className="text-[#D06885]" />
              <span className="font-mono text-[11px] font-bold">{lang.toUpperCase()}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 bg-white/80 border border-pink-200/70 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs">
              <span>{currentConfig.icon}</span>
              <span className="capitalize">{t(`modes.${mode}.label`, currentConfig.label)} Mode</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <button
              onClick={onEnterApp}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-linear-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                {userProfile?.name
                  ? t('landing.enterApp', 'Buka Dashboard')
                  : (isEn ? 'Get Started' : 'Mulai Sekarang')}
              </span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO BANNER WITH 3D CELESTIAL CANVAS
      ══════════════════════════════════════════ */}
      <section className={`relative overflow-hidden transition-all duration-700 shadow-md py-16 md:py-24 bg-gradient-to-br ${currentConfig.gradient}`}>
        
        {/* 🌸 3D Celestial Atmosphere Canvas (Matahari / Awan+Matahari / Sunset / Bulan+Bintang) */}
        <ThreeAtmosphereCanvas mode={mode} />

        {/* Decorative soft ambient circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 text-xs font-semibold tracking-wide">
                <span>{currentConfig.icon}</span>
                <span>Rutinitas Real-time Aktif ({currentConfig.label})</span>
              </div>

              <h1 className="font-display font-bold leading-tight drop-shadow-sm text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {currentConfig.heroTitle}
              </h1>

              <p className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
                {t(`modes.${mode}.heroSubtitle`, currentConfig.heroSubtitle)} {t('landing.tagline', 'Rawat kulitmu secara konsisten dengan panduan skincare berbasis waktu nyata dan teknologi 3D interaktif.')}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={onEnterApp}
                  className="px-8 py-3.5 rounded-2xl font-display font-bold text-sm text-[#3D1F2A] bg-white hover:bg-pink-50 shadow-lg hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-pink-500" />
                  <span>
                    {userProfile?.name
                      ? t('hero.startSkincare', 'Lanjut Rutinitas Skincare 🌸')
                      : (isEn ? 'Get Started (Create Profile) 🌸' : 'Mulai Sekarang (Buat Profil) 🌸')}
                  </span>
                </button>

                {userProfile?.name ? (
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs text-white">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{t('landing.hello', 'Halo')}, <strong>{userProfile.name}</strong> 🌸</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-xs text-white">
                    <span>🌸 <strong>Glow</strong> ✦ {isEn ? 'Personal Skincare Companion' : 'Teman Rutinitas Skincare'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Quick Real-time Snapshot */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 text-white shadow-2xl w-full max-w-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/20">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/80">
                    {t('landing.quickKey', 'Kunci Waktu Hari Ini')}
                  </span>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
                    {mode.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                    <span className="flex items-center gap-2">
                      <Droplets size={14} className="text-sky-300" /> {t('landing.coreProducts', 'Produk Utama')}
                    </span>
                    <span className="font-semibold">Vaseline, Pond's, Originote</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-rose-300" /> {t('landing.redToner', 'Toner Merah')}
                    </span>
                    <span className="font-semibold">{t('landing.redTonerSchedule', 'Rabu & Sabtu Malam 🔒')}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/10">
                    <span className="flex items-center gap-2">
                      <Flame size={14} className="text-amber-300" /> Streak Counter
                    </span>
                    <span className="font-semibold">Menjaga Rutinitas Harian 🔥</span>
                  </div>
                </div>

                <button
                  onClick={onEnterApp}
                  className="w-full py-2.5 rounded-xl bg-white/30 hover:bg-white/40 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buka Lemari Skincare</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE HIGHLIGHTS SECTION
      ══════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D06885] bg-pink-100/80 px-3 py-1 rounded-full">
            Fitur Cerdas & Aesthetic
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#3D1F2A]">
            Didesain Khusus untuk Perjalanan Glowing Cece
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Setiap detail dirancang untuk memastikan kamu tidak pernah melewatkan waktu perawatan kulit terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-xs">
              ☀️
            </div>
            <h3 className="font-display font-bold text-base text-[#3D1F2A]">4-Phase Real-time Sync</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Otomatis menyesuaikan produk dan tema atmosfer sesuai waktu Pagi, Siang, Sore, dan Malam secara sinkron 24 jam.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-xs">
              🔒
            </div>
            <h3 className="font-display font-bold text-base text-[#3D1F2A]">Toner Merah Safety Lock</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Terkunci aman di luar hari Rabu & Sabtu malam untuk melindungi skin barrier dari over-exfoliation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shadow-xs">
              🧴
            </div>
            <h3 className="font-display font-bold text-base text-[#3D1F2A]">3D Interactive Serum</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Botol kaca 3D yang bisa diputar 360° dengan cairan glowing yang naik real-time mengikuti persentase centang kamu.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white/70 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl shadow-xs">
              🔥
            </div>
            <h3 className="font-display font-bold text-base text-[#3D1F2A]">Strict Streak Motivator</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menghitung konsistensi hari berurutan. Api tetap menyala jika kamu konsisten merawat diri setiap hari.
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="mt-auto border-t border-pink-100/80 bg-white/60 backdrop-blur-md py-6 px-6 text-center text-xs text-slate-400">
        <p>
          Glow ✦ Personal Skincare Routine • Crafted with 💖 for Glowing Skin
        </p>
      </footer>

    </div>
  );
}
