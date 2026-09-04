import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import ProgressBar from './components/ProgressBar';
import RoutineList from './components/RoutineList';
import TonerToggle from './components/TonerToggle';
import WeatherAlert from './components/WeatherAlert';
import StreakCounter from './components/StreakCounter';
import QuickModeToggle from './components/QuickModeToggle';
import ProductShelfModal from './components/ProductShelfModal';
import DailyHistoryModal, { recordDayActivity } from './components/DailyHistoryModal';
import DailyQuote from './components/DailyQuote';
import ExfoliationCalendar from './components/ExfoliationCalendar';
import ClockWidget from './components/ClockWidget';
import TitleBar from './components/TitleBar';
import ThreeAtmosphereCanvas from './components/ThreeAtmosphereCanvas';
import ThreeSkincareBottle from './components/ThreeSkincareBottle';
import ThreeCelebrationOrb from './components/ThreeCelebrationOrb';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AccountModal from './components/AccountModal';
import { getMergedSkincareData, modeConfig } from './data/skincareData';
import { isExfoliatingDay, getCurrentDateString } from './utils/dateHelper';
import { initNotificationService, checkAndSendRoutineReminders } from './utils/notificationService';
import { getSavedUserProfile, saveUserProfile } from './data/userProfile';
import { Package, Calendar as CalendarIcon, Sunrise, Sun, Sunset, Moon, User as UserIcon, Home, Globe, CheckCircle2, Flame, RotateCcw, Sparkles } from 'lucide-react';
import { calculateStreak, STREAK_STORAGE_KEY } from './components/StreakCounter';
import { useLanguage } from './i18n/LanguageContext';

const STORAGE_KEY = 'ceceyori_checked_items';
const TONER_STORAGE_KEY = 'ceceyori_toner_enabled';
const COMPLETION_STORAGE_KEY = 'ceceyori_daily_completion';
const MODE_STORAGE_KEY = 'ceceyori_mode';
const QUICK_MODE_STORAGE_KEY = 'ceceyori_quick_mode';
const ORDER_STORAGE_KEY = 'ceceyori_routine_order';
const VIEW_STATE_KEY = 'ceceyori_view_state';

const MODES = ['pagi', 'siang', 'sore', 'malam'];

function sortBySavedOrder(items, orderIds = []) {
  if (!orderIds.length) return items;
  const map = new Map(items.map((item) => [item.id, item]));
  const sorted = [];
  for (const id of orderIds) {
    if (map.has(id)) {
      sorted.push(map.get(id));
      map.delete(id);
    }
  }
  for (const item of map.values()) sorted.push(item);
  return sorted;
}

function getAutoMode() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'pagi';
  if (h >= 11 && h < 15) return 'siang';
  if (h >= 15 && h < 19) return 'sore';
  return 'malam'; // 19:00 - 04:59
}

/* ── Live Clock Header Widget ── */
function LiveClock({ mode }) {
  const { lang } = useLanguage();
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const locale = lang === 'en' ? 'en-US' : 'id-ID';
  const timeStr = time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const getDotColor = () => {
    switch(mode) {
      case 'pagi': return 'bg-amber-400';
      case 'siang': return 'bg-sky-400';
      case 'sore': return 'bg-rose-400';
      case 'malam': default: return 'bg-violet-400';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${getDotColor()}`} />
      <span className="font-mono font-semibold text-sm text-[#3D1F2A] tracking-widest">{timeStr}</span>
      <span className="text-slate-400 text-xs capitalize hidden md:inline">· {dateStr}</span>
    </div>
  );
}

export default function App() {
  const { lang, toggleLang, t, isEn } = useLanguage();

  // ── State: Navigation View ('landing' | 'auth' | 'dashboard') ──
  const [viewState, setViewState] = useState(() => {
    return localStorage.getItem(VIEW_STATE_KEY) || 'dashboard';
  });

  // ── State: User Profile & Modals ──
  const [userProfile, setUserProfile] = useState(() => getSavedUserProfile());
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ── State: Mode (Pagi / Siang / Sore / Malam) ──
  const [mode, setMode] = useState(() => getAutoMode());
  const [manualMode, setManualMode] = useState(false);

  // ── State: Quick/Full Routine ──
  const [routineMode, setRoutineMode] = useState(() => {
    const saved = localStorage.getItem(QUICK_MODE_STORAGE_KEY);
    return saved ?? 'full';
  });

  // ── State: Toner (Hanya aktif Rabu & Sabtu malam) ──
  const [tonerEnabled, setTonerEnabled] = useState(() => {
    if (!isExfoliatingDay()) return false;
    const saved = localStorage.getItem(TONER_STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // ── State: Checked items ──
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // ── State: Daily completion flag ──
  const [todayCompleted, setTodayCompleted] = useState(() => {
    const today = getCurrentDateString();
    const saved = localStorage.getItem(COMPLETION_STORAGE_KEY);
    return saved === today;
  });

  // ── State: Live Streak Calculation ──
  const [currentStreak, setCurrentStreak] = useState(() => {
    try {
      const history = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '[]');
      return calculateStreak(history);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      const history = JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '[]');
      setCurrentStreak(calculateStreak(history));
    } catch {}
  }, [checkedItems, todayCompleted]);

  // ── State: Modals ──
  const [showProductShelf, setShowProductShelf] = useState(false);
  const [showDailyHistory, setShowDailyHistory] = useState(false);

  // ── State: Custom Item Order ──
  const [customOrder, setCustomOrder] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  // ── Save view state ──
  useEffect(() => {
    localStorage.setItem(VIEW_STATE_KEY, viewState);
  }, [viewState]);

  // ── Auto-Switch Routine Mode Every Minute ──
  useEffect(() => {
    const interval = setInterval(() => {
      const expectedMode = getAutoMode();
      if (!manualMode) {
        setMode((prev) => (prev !== expectedMode ? expectedMode : prev));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [manualMode]);

  // ── Native Desktop Notification Reminder Service ──
  useEffect(() => {
    initNotificationService();
    checkAndSendRoutineReminders();
    const notifInterval = setInterval(() => {
      checkAndSendRoutineReminders();
    }, 60000);
    return () => clearInterval(notifInterval);
  }, []);

  // ── Save Checked Items & Mode ──
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem(TONER_STORAGE_KEY, JSON.stringify(tonerEnabled));
  }, [tonerEnabled]);

  useEffect(() => {
    localStorage.setItem(QUICK_MODE_STORAGE_KEY, routineMode);
  }, [routineMode]);

  useEffect(() => {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(customOrder));
  }, [customOrder]);

  // ── Get Active Skincare Data ──
  const skincareData = getMergedSkincareData();
  const baseRoutine = skincareData[mode] || skincareData.sore;
  const currentConfig = modeConfig[mode] || modeConfig.sore;

  // Filter items (Quick vs Full, Toner Merah conditions)
  const getActiveItems = useCallback(() => {
    let items = routineMode === 'quick' ? baseRoutine.quick : baseRoutine.full;
    if (mode === 'malam' && tonerEnabled && isExfoliatingDay()) {
      const hasToner = items.some((i) => i.id === 'toner');
      if (!hasToner && baseRoutine.tonerItem) {
        items = [baseRoutine.tonerItem, ...items];
      }
    } else {
      items = items.filter((i) => i.id !== 'toner');
    }
    return sortBySavedOrder(items, customOrder[mode] || []);
  }, [mode, routineMode, tonerEnabled, customOrder, baseRoutine]);

  const activeItems = getActiveItems();
  const currentChecked = checkedItems[mode] || [];
  const checkedCount = activeItems.filter((item) => currentChecked.includes(item.id)).length;
  const progress = activeItems.length > 0 ? (checkedCount / activeItems.length) * 100 : 0;

  // ── Toggle Item ──
  const handleToggle = (id) => {
    setCheckedItems((prev) => {
      const currentList = prev[mode] || [];
      const updated = currentList.includes(id)
        ? currentList.filter((item) => item !== id)
        : [...currentList, id];
      
      const newChecked = { ...prev, [mode]: updated };

      if (updated.length > 0) {
        recordDayActivity(getCurrentDateString(), updated, activeItems, mode);
      }

      // 100% completion celebration
      if (updated.length === activeItems.length && activeItems.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D06885', '#9B4B62', '#FBBF24', '#F472B6'],
        });
      }

      return newChecked;
    });
  };

  // ── Reorder Items ──
  const handleReorder = (newItems) => {
    const newOrderIds = newItems.map((item) => item.id);
    setCustomOrder((prev) => ({ ...prev, [mode]: newOrderIds }));
  };

  // ── Reset Checklist ──
  const handleReset = () => {
    if (window.confirm(`Reset checklist untuk rutinitas ${currentConfig.label}?`)) {
      setCheckedItems((prev) => ({ ...prev, [mode]: [] }));
    }
  };

  // ── Complete Day Streak ──
  const handleCompleteDay = () => {
    const today = getCurrentDateString();
    localStorage.setItem(COMPLETION_STORAGE_KEY, today);
    setTodayCompleted(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FF6B6B', '#FFA07A', '#FFD700', '#FF69B4'],
    });
  };

  // ── Handle Navigation & Auth ──
  const handleEnterDashboard = () => {
    setViewState('dashboard');
  };

  const handleLogout = () => {
    setShowAccountModal(false);
    setViewState('landing');
  };

  const handleLoginSuccess = (updatedProfile) => {
    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setShowAuthModal(false);
    setViewState('dashboard');
  };

  // ══════════════════════════════════════════════
  // RENDER: LANDING PAGE VIEW
  // ══════════════════════════════════════════════
  if (viewState === 'landing') {
    return (
      <div className="min-h-screen bg-[#FDF5F7] font-sans">
        <TitleBar />
        <LandingPage
          mode={mode}
          userProfile={userProfile}
          onEnterApp={handleEnterDashboard}
        />
        <AuthModal
          isOpen={showAuthModal}
          userProfile={userProfile}
          mode={mode}
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setShowAuthModal(false)}
        />
      </div>
    );
  }

  // ══════════════════════════════════════════════
  // RENDER: MAIN TRACKER DASHBOARD
  // ══════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#FDF5F7] text-[#3D1F2A] flex flex-col selection:bg-pink-200 selection:text-pink-900 animate-fade-in">
      {/* Native Desktop Window Frame */}
      <TitleBar />

      {/* ══════════════════════════════════════════
          TOP NAVIGATION BAR
      ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          TOP NAVIGATION BAR (DESKTOP)
      ══════════════════════════════════════════ */}
      <nav className="hidden lg:block sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-pink-100/80 px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Landing Page Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewState('landing')}
              className="p-2 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
              title={t('homeTooltip', 'Kembali ke Landing Page Beranda')}
            >
              <Home size={18} />
            </button>

            <span className="font-display text-[#3D1F2A] font-bold text-lg tracking-tight select-none flex items-center gap-1.5">
              <span>Glow</span>
              <span className="text-[#D06885]">✦</span>
            </span>
          </div>

          {/* Center: Live clock + 4-Mode Segmented Switcher */}
          <div className="flex items-center gap-3 flex-1 justify-center max-w-2xl">
            <LiveClock mode={mode} />
            
            {/* 4 Mode Segmented Switcher */}
            <div className="flex items-center bg-pink-50/80 p-1 rounded-full border border-pink-100 shadow-inner">
              {MODES.map((m) => {
                const conf = modeConfig[m];
                const isActive = mode === m;
                const modeLabel = t(`modes.${m}.label`, conf.label);
                return (
                  <button
                    key={m}
                    onClick={() => { setManualMode(true); setMode(m); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap
                      ${isActive
                        ? `${conf.badgeColor} shadow-sm scale-105 font-bold`
                        : 'text-slate-500 hover:text-slate-800'
                      }`}>
                    <span>{conf.icon}</span>
                    <span>{modeLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Quick/Full Toggle + Language Switcher + History + Reset + Shelf + Account */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <QuickModeToggle mode={routineMode} onToggle={setRoutineMode} compact />
            
            {/* 🌐 Language Switcher (ID / EN) */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-pink-50/90 border border-pink-200 text-xs font-bold text-[#8B3E53] hover:bg-pink-100 hover:scale-105 active:scale-95 transition-all shadow-2xs"
              title={t('nav.languageToggleTooltip', 'Ganti Bahasa / Switch Language')}
            >
              <Globe size={13} className="text-[#D06885]" />
              <span className="font-mono text-[11px] font-bold">{lang.toUpperCase()}</span>
            </button>

            {/* Riwayat / History Button */}
            <button
              onClick={() => setShowDailyHistory(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
              title={t('nav.historyTooltip', 'Lihat Riwayat Skincare Harian')}>
              <CalendarIcon size={14} /> <span>{t('nav.history', 'Riwayat')}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="text-xs font-medium text-pink-400 border border-dashed border-pink-200
                rounded-full px-3 py-1.5 hover:border-[#D06885] hover:text-[#D06885] transition-all duration-200"
              title={t('nav.resetTooltip', 'Reset checklist')}>
              🔄 {t('nav.reset', 'Reset')}
            </button>
            
            {/* Product Shelf Button */}
            <button
              onClick={() => setShowProductShelf(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-medium hover:bg-pink-200 transition-colors"
              title={t('nav.shelfTooltip', 'Kelola Lemari Skincare')}>
              <Package size={14} /> <span>{t('nav.shelf', 'Shelf')}</span>
            </button>

            {/* Account Profile Button */}
            <button
              onClick={() => setShowAccountModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-bold text-[#3D1F2A] hover:bg-pink-50 shadow-2xs transition-all"
              title={t('profileTooltip', 'Profil & Akun Pengguna')}>
              <span>{userProfile?.avatar || '🌸'}</span>
              <span>{userProfile?.name?.split(' ')[0] || 'User'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          TOP NAVIGATION BAR & MODE TABS (MOBILE)
      ══════════════════════════════════════════ */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-pink-100/90 shadow-2xs transition-all">
        {/* Top Mobile Bar: Brand, Streak Flame, Language & Profile */}
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewState('landing')}
              className="p-1.5 rounded-xl text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all"
              title={t('homeTooltip', 'Kembali ke Beranda')}
            >
              <Home size={17} />
            </button>
            <span className="font-display text-[#3D1F2A] font-bold text-base tracking-tight flex items-center gap-1">
              <span>Glow</span>
              <span className="text-[#D06885]">✦</span>
            </span>
          </div>

          {/* Center: Streak Pill Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs border ${
            currentStreak > 0
              ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          }`}>
            <Flame size={13} className={currentStreak > 0 ? 'text-amber-500 fill-amber-400' : 'text-slate-400'} />
            <span className="font-mono">{currentStreak}</span>
            <span className="text-[10px] uppercase font-semibold">{isEn ? 'Days' : 'Hari'}</span>
          </div>

          {/* Right: Language toggle & Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-[#8B3E53] active:scale-95 transition-all shadow-2xs"
            >
              <Globe size={12} className="text-[#D06885]" />
              <span className="font-mono text-[10px]">{lang.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setShowAccountModal(true)}
              className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center text-sm shadow-2xs active:scale-95 transition-all"
              title={t('profileTooltip', 'Profil Pengguna')}
            >
              {userProfile?.avatar || '🌸'}
            </button>
          </div>
        </div>

        {/* Second Row: 4 Mode Horizontal Pill Switcher */}
        <div className="px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {MODES.map((m) => {
            const conf = modeConfig[m];
            const isActive = mode === m;
            const modeLabel = t(`modes.${m}.label`, conf.label);
            return (
              <button
                key={m}
                onClick={() => { setManualMode(true); setMode(m); }}
                className={`flex-1 min-w-[76px] py-1.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1 whitespace-nowrap active:scale-95
                  ${isActive
                    ? `${conf.badgeColor} shadow-xs font-bold ring-1 ring-pink-300/60`
                    : 'bg-pink-50/50 text-slate-500 border border-pink-100/60'
                  }`}
              >
                <span className="text-xs">{conf.icon}</span>
                <span className="text-[11px]">{modeLabel}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════════ */}
      <section className={`relative overflow-hidden transition-all duration-700 shadow-md bg-gradient-to-br ${currentConfig.gradient}`}>

        {/* 🌸 Three.js 3D Celestial Canvas (Matahari / Awan+Matahari / Sunset / Bulan+Bintang) */}
        <ThreeAtmosphereCanvas mode={mode} />

        {/* Decorative ambient blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute top-8 right-1/3 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-7 sm:py-10 lg:py-14 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Hero text */}
            <div className="max-w-xl">
              <p className="text-white/80 text-xs uppercase tracking-[0.25em] font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                <span>{currentConfig.icon}</span> {t('hero.routineHeader', 'Skincare Rutin')} {t(`modes.${mode}.label`, currentConfig.label)} ({t(`modes.${mode}.timeRange`, baseRoutine.timeRange)})
              </p>
              <h1 className="font-display text-white font-bold leading-tight mb-3 sm:mb-4 text-3xl sm:text-4xl lg:text-5xl">
                {t(`modes.${mode}.heroTitle`, currentConfig.heroTitle)}
              </h1>
              <p className="text-white/85 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 max-w-md">
                {t(`modes.${mode}.heroSubtitle`, currentConfig.heroSubtitle)}
              </p>

              {/* Status pill */}
              <div className="inline-flex items-center bg-white/25 backdrop-blur-sm
                rounded-full px-4 sm:px-5 py-2 sm:py-2.5 border border-white/35 cursor-default select-none shadow-sm">
                <span className="text-white text-xs font-semibold">
                  {checkedCount}/{activeItems.length} {t('hero.productsDone', 'produk selesai')} ({Math.round(progress)}%)
                </span>
                <span className="ml-2.5 sm:ml-3 w-5 h-5 rounded-full bg-white/30 flex items-center justify-center text-xs text-white">
                  ✓
                </span>
              </div>
            </div>

            {/* Right: Floating stats */}
            <div className="hidden lg:flex flex-col gap-3 items-end">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl px-8 py-5 border border-white/30 text-center min-w-[170px] shadow-lg">
                <p className="font-display text-white text-5xl font-bold">{Math.round(progress)}%</p>
                <p className="text-white/80 text-xs mt-1 uppercase tracking-wider font-semibold">{t('hero.progressTitle', 'Progress Rutinitas')}</p>
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="h-1.5 bg-white rounded-full animate-progress" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20 shadow-md">
                <div className="flex gap-1 justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-xl transition-all duration-300
                      ${i < Math.ceil((progress / 100) * 5) ? 'text-yellow-300 drop-shadow' : 'text-white/30'}`}>★</span>
                  ))}
                </div>
                <p className="text-white/70 text-xs mt-1 text-center font-medium">{t('hero.ratingTitle', 'Rating harian kamu')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-32 lg:pb-12">
        
        {/* Main Checklist: Displayed FIRST on mobile (order-1 lg:order-2) */}
        <section className="order-1 lg:order-2 lg:col-span-8">
          <RoutineList
            title={t(`modes.${mode}.routineTitle`, baseRoutine.title)}
            items={activeItems}
            checkedItems={checkedItems[mode] || []}
            onToggle={handleToggle}
            onReorder={handleReorder}
            mode={mode}
            routineMode={routineMode}
          />
        </section>

        {/* Sidebar Widgets: Displayed SECOND on mobile (order-2 lg:order-1) */}
        <aside className="order-2 lg:order-1 lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-20 h-fit">
          {/* Redundant clock hidden on mobile, shown on desktop */}
          <div className="hidden lg:block">
            <ClockWidget mode={mode} />
          </div>
          
          <ProgressBar
            variant="sidebar"
            progress={progress}
            total={activeItems.length}
            checked={checkedCount}
            mode={mode}
          />

          {/* 🧴 3D Interactive Skincare Serum Bottle */}
          <ThreeSkincareBottle progress={progress} mode={mode} />
          
          {/* Toner toggle (show when in malam mode or on exfoliation day) */}
          {mode === 'malam' && (
            <TonerToggle
              enabled={tonerEnabled}
              onToggle={() => setTonerEnabled(prev => !prev)}
            />
          )}

          {/* Exfoliation calendar (show when in malam mode) */}
          {mode === 'malam' && (
            <ExfoliationCalendar tonerEnabled={tonerEnabled} />
          )}

          {/* Weather Alert (active in day modes: pagi, siang, sore) */}
          {mode !== 'malam' && <WeatherAlert />}
          
          <DailyQuote mode={mode} />

          {/* 💎 3D Interactive Glow Crystal Orb with Levels & Fortunes */}
          <ThreeCelebrationOrb streak={todayCompleted ? 1 : 0} mode={mode} />
          
          {/* Strict Consecutive Streak Counter */}
          <StreakCounter
            mode={mode}
            progress={progress}
            checkedCount={checkedCount}
            totalCount={activeItems.length}
            todayCompleted={todayCompleted}
            onComplete={handleCompleteDay}
          />
        </aside>
      </main>

      {/* ══════════════════════════════════════════
          FLOATING MOBILE BOTTOM NAVIGATION DOCK
      ══════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-3 inset-x-3 z-40 bg-white/92 backdrop-blur-xl border border-pink-200/80 rounded-2xl shadow-xl px-3 py-2 flex items-center justify-between">
        {/* Toggle Routine Mode (3-Step / Lengkap) */}
        <button
          onClick={toggleRoutineMode}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
            routineMode === 'express'
              ? 'text-[#D06885] bg-pink-50'
              : 'text-slate-600 hover:text-pink-600'
          }`}
          title={routineMode === 'express' ? t('routine.expressMode', 'Mode Cepat') : t('routine.fullMode', 'Mode Lengkap')}
        >
          <Sparkles size={18} className={routineMode === 'express' ? 'text-[#D06885] fill-pink-300' : 'text-slate-400'} />
          <span>{routineMode === 'express' ? '3-Step' : (isEn ? 'Full' : 'Lengkap')}</span>
        </button>

        {/* Lemari / Shelf */}
        <button
          onClick={() => setShowProductShelf(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-600 hover:text-pink-600 active:scale-95 transition-all"
        >
          <Package size={18} className="text-slate-400" />
          <span>{t('nav.shelf', 'Shelf')}</span>
        </button>

        {/* Quick Check/Complete Floating Button (Smooth Scroll to Top) */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="relative -top-5 w-12 h-12 rounded-full bg-linear-to-tr from-[#D06885] to-[#E8829D] text-white shadow-lg shadow-pink-500/30 flex items-center justify-center border-2 border-white active:scale-95 transition-all cursor-pointer"
          title={t('scrollToTop', 'Ke Atas')}
        >
          <CheckCircle2 size={24} />
        </button>

        {/* Riwayat / History */}
        <button
          onClick={() => setShowDailyHistory(true)}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-600 hover:text-pink-600 active:scale-95 transition-all"
        >
          <CalendarIcon size={18} className="text-slate-400" />
          <span>{t('nav.history', 'Riwayat')}</span>
        </button>

        {/* Reset Hari Ini */}
        <button
          onClick={handleReset}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-bold text-slate-600 hover:text-rose-600 active:scale-95 transition-all"
          title={t('nav.reset', 'Reset')}
        >
          <RotateCcw size={18} className="text-slate-400" />
          <span>{t('nav.reset', 'Reset')}</span>
        </button>
      </nav>

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}
      {/* Account Profile Modal */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        userProfile={userProfile}
        onUpdateProfile={(p) => setUserProfile(p)}
        onLogout={handleLogout}
        streak={todayCompleted ? 2 : 1}
      />

      {/* Product Shelf Management Modal */}
      <ProductShelfModal
        isOpen={showProductShelf}
        onClose={() => setShowProductShelf(false)}
        onUpdate={() => setCheckedItems((prev) => ({ ...prev }))}
        routineMode={mode}
      />

      {/* Daily History Modal */}
      <DailyHistoryModal
        isOpen={showDailyHistory}
        onClose={() => setShowDailyHistory(false)}
      />

    </div>
  );
}