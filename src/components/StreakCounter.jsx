import { useState, useEffect } from 'react';
import { Flame, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';
import { getCurrentDateString, getDateDaysAgo } from '../utils/dateHelper';

export const STREAK_STORAGE_KEY = 'ceceyori_streak_history';

export function calculateStreak(history) {
  if (!history || history.length === 0) return 0;

  const today = getCurrentDateString();
  const sortedDates = [...new Set(history)].sort((a, b) => new Date(b) - new Date(a));

  // Streak hanya valid jika hari ini atau kemarin ada aktivitas
  const mostRecent = sortedDates[0];
  const yesterday = getDateDaysAgo(1);

  // Kalau aktivitas terakhir bukan hari ini dan bukan kemarin → streak PUTUS = 0
  if (mostRecent !== today && mostRecent !== yesterday) return 0;

  // Hitung berapa hari berturut-turut dari tanggal paling baru
  let streak = 0;
  let checkDate = mostRecent === today ? today : yesterday;

  for (let i = 0; i < sortedDates.length; i++) {
    if (sortedDates[i] === checkDate) {
      streak++;
      // Mundur 1 hari untuk cek berikutnya
      const [y, m, day] = checkDate.split('-').map(Number);
      const d = new Date(y, m - 1, day - 1);
      checkDate = getCurrentDateString(d);
    } else {
      // Gap → streak putus
      break;
    }
  }

  return streak;
}

export default function StreakCounter({ mode, progress, checkedCount, totalCount, todayCompleted, onComplete }) {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STREAK_STORAGE_KEY) || '[]');
    } catch { return []; }
  });
  const [showHistory, setShowHistory] = useState(false);

  // Auto-record hari ini ke history kalau sudah ada item yang dicentang
  useEffect(() => {
    if (checkedCount > 0) {
      const today = getCurrentDateString();
      if (!history.includes(today)) {
        const newHistory = [...history, today];
        setHistory(newHistory);
        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newHistory));
      }
    }
  }, [checkedCount]);

  const streak = calculateStreak(history);
  const isStreakAlive = streak > 0;
  const hasCheckedSome = checkedCount > 0;
  const today = getCurrentDateString();
  const isTodayRecorded = history.includes(today);

  const handleMarkComplete = () => {
    if (onComplete) onComplete();
    if (!isTodayRecorded) {
      const newHistory = [...history, today];
      setHistory(newHistory);
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newHistory));
    }
  };

  const getStreakDisplay = () => {
    if (!isStreakAlive) return {
      emoji: '🔥',
      iconColor: 'text-slate-400',
      bgColor: 'bg-slate-100',
      text: 'Streak belum aktif — centang produk hari ini! ✨',
    };
    if (streak >= 30) return {
      emoji: '👑',
      iconColor: 'text-amber-500',
      bgColor: 'bg-gradient-to-br from-amber-300 to-orange-400',
      text: `${streak} hari berturut-turut! Luar biasa! 👑`,
    };
    if (streak >= 14) return {
      emoji: '💎',
      iconColor: 'text-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-300 to-violet-400',
      text: `${streak} hari! 2 minggu konsisten! 💎`,
    };
    if (streak >= 7) return {
      emoji: '🏆',
      iconColor: 'text-amber-500',
      bgColor: 'bg-gradient-to-br from-amber-300 to-orange-400',
      text: `Streak ${streak} Hari! Kamu konsisten banget! 🏆`,
    };
    if (streak >= 3) return {
      emoji: '🔥',
      iconColor: 'text-orange-500',
      bgColor: 'bg-gradient-to-br from-orange-300 to-red-400',
      text: `Streak ${streak} Hari! Lanjutkan terus! 🔥`,
    };
    return {
      emoji: '🔥',
      iconColor: 'text-pink-500',
      bgColor: 'bg-gradient-to-br from-pink-200 to-rose-300',
      text: `Streak aktif ${streak} hari! Pertahankan ya! 💪`,
    };
  };

  const display = getStreakDisplay();

  return (
    <div className="space-y-3">
      {/* Main Streak Card */}
      <div className="relative bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm transition-all duration-500 hover:shadow-md overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 opacity-30 blur-xl" />

        <div className="relative flex items-center gap-4">
          {/* Fire Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-all duration-500 ${isStreakAlive ? display.bgColor : 'bg-slate-100'}`}>
            <span className={`drop-shadow-lg transition-all duration-500 ${!isStreakAlive ? 'grayscale opacity-50' : ''}`}>
              {display.emoji}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame
                size={18}
                className={`transition-colors duration-500 ${isStreakAlive ? display.iconColor : 'text-slate-300'}`}
              />
              <span className={`font-bold text-xl transition-colors duration-300 ${isStreakAlive ? 'text-[#3D1F2A]' : 'text-slate-400'}`}>
                {streak} Hari
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-300 ${
                isStreakAlive
                  ? 'bg-blush-100 text-blush-600 border-blush-200'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                {isStreakAlive ? 'Streak Aktif 🔥' : 'Belum Aktif'}
              </span>
            </div>
            <p className={`text-xs leading-relaxed transition-colors duration-300 ${isStreakAlive ? 'text-slate-600' : 'text-slate-400'}`}>
              {display.text}
            </p>
            {!isStreakAlive && (
              <p className="text-[10px] text-slate-400 mt-0.5">
                💡 Skip 1 hari = streak reset ke 0!
              </p>
            )}
          </div>

          {/* Selesaiin Hari Ini Button */}
          {hasCheckedSome && !todayCompleted && !isTodayRecorded && (
            <button
              onClick={handleMarkComplete}
              className="flex-shrink-0 bg-gradient-to-r from-blush-400 to-blush-500 hover:from-blush-500 hover:to-blush-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles size={14} /> Selesaiin!
            </button>
          )}

          {(todayCompleted || isTodayRecorded) && (
            <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={16} className="text-green-600" />
              <span className="text-xs font-semibold text-green-700">Tercatat ✓</span>
            </div>
          )}
        </div>

        {/* Mini Calendar Heatmap */}
        <div className="mt-4 pt-4 border-t border-pink-100 relative">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 font-medium">
              <Calendar size={12} /> 7 Hari Terakhir
            </span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-blush-500 hover:text-blush-600 font-medium text-xs flex items-center gap-1"
            >
              {showHistory ? 'Sembunyikan' : 'Lihat Detail'} <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
          </div>

          <div className={`grid grid-cols-7 gap-1.5 transition-all duration-300 ${showHistory ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {Array.from({ length: 7 }).map((_, i) => {
              const date = getDateDaysAgo(6 - i);
              const isDone = history.includes(date);
              const isToday = date === getCurrentDateString();
              return (
                <div
                  key={date}
                  className={`flex flex-col items-center py-2 px-1 rounded-lg text-center transition-all cursor-default
                    ${isDone ? 'bg-blush-100 border border-blush-200' : 'bg-slate-50 border border-slate-100'}
                    ${isToday ? 'ring-2 ring-blush-400 ring-offset-1' : ''}`}
                  title={date}
                >
                  <span className="text-[10px] leading-none uppercase font-medium text-slate-400">
                    {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short' })}
                  </span>
                  <span className="text-[11px] mt-0.5 leading-none font-bold">
                    {isDone ? '✓' : '—'}
                  </span>
                  <span className="text-[9px] text-slate-400 mt-0.5 leading-none">
                    {new Date(date + 'T00:00:00').getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { days: 1, label: 'Pemula', icon: '🌱', color: 'bg-green-100 text-green-700 border-green-200' },
          { days: 3, label: 'Konsisten', icon: '🔥', color: 'bg-orange-100 text-orange-700 border-orange-200' },
          { days: 7, label: '7 Hari!', icon: '🏆', color: 'bg-amber-100 text-amber-700 border-amber-200' },
          { days: 14, label: '2 Minggu', icon: '💎', color: 'bg-purple-100 text-purple-700 border-purple-200' },
          { days: 30, label: '1 Bulan', icon: '👑', color: 'bg-rose-100 text-rose-700 border-rose-200' },
        ].map((milestone) => (
          <div
            key={milestone.days}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ${
              streak >= milestone.days ? milestone.color : 'bg-slate-50 text-slate-400 border-slate-200 opacity-50'
            }`}
          >
            <span className={streak >= milestone.days ? '' : 'grayscale'}>{milestone.icon}</span>
            <span>{milestone.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}