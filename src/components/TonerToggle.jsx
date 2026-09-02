import React from 'react';
import { Sparkles, Lock } from 'lucide-react';
import { isExfoliatingDay } from '../utils/dateHelper';
import { useLanguage } from '../i18n/LanguageContext';

export default function TonerToggle({ enabled, onToggle }) {
  const { t, isEn } = useLanguage();
  const isScheduledToday = isExfoliatingDay(); // true hanya Rabu (3) & Sabtu (6)

  const handleToggle = () => {
    // Hanya bisa toggle kalau hari ini adalah jadwal toner
    if (!isScheduledToday) return;
    onToggle();
  };

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-white/60">
      {/* Top row: Title + Switch */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300
            ${isScheduledToday && enabled
              ? 'bg-rose-100/80 text-rose-600 ring-2 ring-rose-300/50'
              : !isScheduledToday
                ? 'bg-slate-100/80 text-slate-300'
                : 'bg-slate-100/80 text-slate-400'}`}>
            {isScheduledToday ? '🧪' : <Lock size={18} className="text-slate-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-sm ${isScheduledToday ? 'text-[#3D1F2A]' : 'text-slate-400'}`}>
                {t('toner.title', 'Toner Merah')}
              </h3>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                {isEn ? '2x / Week' : '2x / Minggu'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Sonik Scents ({isEn ? 'Fold Exfoliation' : 'Eksfoliasi Lipatan'})</p>
          </div>
        </div>

        {/* Toggle Switch — disabled kalau bukan hari jadwal */}
        <button
          onClick={handleToggle}
          type="button"
          aria-label="Toggle Toner Merah"
          disabled={!isScheduledToday}
          title={!isScheduledToday ? (isEn ? 'Toner can only be activated on Wednesday & Saturday nights' : 'Toner hanya bisa diaktifkan pada hari Rabu & Sabtu') : ''}
          className={`w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none flex-shrink-0 p-0.5
            ${!isScheduledToday
              ? 'bg-slate-200/60 cursor-not-allowed opacity-60'
              : enabled
                ? 'bg-[#D06885] shadow-lg shadow-blush-500/30 cursor-pointer'
                : 'bg-slate-200/80 hover:bg-slate-300 cursor-pointer'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm
            ${enabled && isScheduledToday ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Schedule status alert */}
      <div className={`rounded-xl px-3 py-2 text-xs flex items-center gap-2 border
        ${isScheduledToday
          ? 'bg-rose-50/80 border-rose-100/80 text-rose-700 backdrop-blur-sm'
          : 'bg-slate-50/80 border-slate-100/80 text-slate-400 backdrop-blur-sm'}`}>
        {isScheduledToday
          ? <Sparkles size={14} className="text-rose-500" />
          : <Lock size={14} className="text-slate-400" />}
        <span className="font-medium">
          {isScheduledToday
            ? (isEn ? 'Tonight is RED TONER NIGHT (Wed & Sat) ✨' : 'Malam ini JADWAL TONER MERAH (Rabu & Sabtu) ✨')
            : (isEn ? '🔒 Toner locked — Schedule: Wed & Sat night only' : '🔒 Toner dikunci — Jadwal: Rabu & Sabtu malam saja')}
        </span>
      </div>
    </div>
  );
}
