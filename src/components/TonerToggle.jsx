import React from 'react';
import { Sparkles, Lock, Package, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function TonerToggle({ enabled, onToggle, scheduledProducts = [], onOpenShelf }) {
  const { t, isEn } = useLanguage();

  const logicalDate = new Date();
  if (logicalDate.getHours() < 5) logicalDate.setDate(logicalDate.getDate() - 1);
  const currentDayIndex = logicalDate.getDay();

  // Filter products scheduled for today
  const productsToday = scheduledProducts.filter((p) => {
    const days = Array.isArray(p.scheduledDays)
      ? p.scheduledDays
      : (p.isConditional ? [3, 6] : []);
    return days.includes(currentDayIndex);
  });

  const hasAnyScheduled = scheduledProducts.length > 0;
  const isScheduledToday = productsToday.length > 0;

  const handleToggle = () => {
    if (!isScheduledToday) return;
    onToggle?.();
  };

  // Case 1: Empty schedule (no periodic products defined by user)
  if (!hasAnyScheduled) {
    return (
      <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-white/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100/80 text-slate-400 flex items-center justify-center text-xl flex-shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-[#3D1F2A]">
                  {isEn ? 'Periodic Care' : 'Produk Berkala'}
                </h3>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  {isEn ? 'Not Set' : 'Belum Diatur'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEn ? 'No periodic products scheduled' : 'Belum ada produk berkala dijadwalkan'}
              </p>
            </div>
          </div>

          {onOpenShelf && (
            <button
              onClick={onOpenShelf}
              type="button"
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#D06885] bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-all cursor-pointer flex-shrink-0"
            >
              {isEn ? '+ Schedule' : '+ Jadwalkan'}
            </button>
          )}
        </div>
      </div>
    );
  }

  const productNames = productsToday.map((p) => p.name).join(', ');

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-5 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-white/60">
      {/* Top row: Title + Switch */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-all duration-300 ${
              isScheduledToday && enabled
                ? 'bg-rose-100/80 text-rose-600 ring-2 ring-rose-300/50'
                : !isScheduledToday
                ? 'bg-slate-100/80 text-slate-300'
                : 'bg-slate-100/80 text-slate-400'
            }`}
          >
            {isScheduledToday ? '🧪' : <Lock size={18} className="text-slate-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-sm ${isScheduledToday ? 'text-[#3D1F2A]' : 'text-slate-400'}`}>
                {isScheduledToday
                  ? productNames
                  : (isEn ? 'Periodic Care' : 'Produk Berkala')}
              </h3>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                {isScheduledToday
                  ? (isEn ? `${productsToday.length} Active` : `${productsToday.length} Aktif`)
                  : (isEn ? 'Off-Schedule' : 'Di Luar Jadwal')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isScheduledToday
                ? (isEn ? 'Scheduled for today' : 'Terjadwal untuk hari ini')
                : (isEn ? 'Locked today based on your custom schedule' : 'Terkunci hari ini sesuai jadwal pilihanmu')}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          type="button"
          aria-label="Toggle Periodic Products"
          disabled={!isScheduledToday}
          title={
            !isScheduledToday
              ? (isEn ? 'No periodic products scheduled for today' : 'Tidak ada produk berkala untuk hari ini')
              : ''
          }
          className={`w-12 h-6 rounded-full transition-all duration-300 relative focus:outline-none flex-shrink-0 p-0.5 ${
            !isScheduledToday
              ? 'bg-slate-200/60 cursor-not-allowed opacity-60'
              : enabled
              ? 'bg-[#D06885] shadow-lg shadow-blush-500/30 cursor-pointer'
              : 'bg-slate-200/80 hover:bg-slate-300 cursor-pointer'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-transform duration-300 shadow-sm ${
              enabled && isScheduledToday ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Schedule status alert */}
      <div
        className={`rounded-xl px-3 py-2 text-xs flex items-center gap-2 border ${
          isScheduledToday
            ? enabled
              ? 'bg-rose-50/80 border-rose-100/80 text-rose-700 backdrop-blur-sm'
              : 'bg-amber-50/80 border-amber-100/80 text-amber-700 backdrop-blur-sm'
            : 'bg-slate-50/80 border-slate-100/80 text-slate-400 backdrop-blur-sm'
        }`}
      >
        {isScheduledToday ? (
          enabled ? (
            <Sparkles size={14} className="text-rose-500" />
          ) : (
            <span className="text-xs">⏸️</span>
          )
        ) : (
          <Lock size={14} className="text-slate-400" />
        )}
        <span className="font-medium">
          {isScheduledToday
            ? enabled
              ? (isEn
                  ? `✨ Active in tonight's checklist: ${productNames}`
                  : `✨ Aktif di checklist malam ini: ${productNames}`)
              : (isEn
                  ? 'Paused — toggle switch to include in checklist'
                  : 'Dijeda — geser saklar untuk memasukkan ke checklist')
            : (isEn
                ? '🔒 No periodic products scheduled for today'
                : '🔒 Tidak ada jadwal produk berkala hari ini')}
        </span>
      </div>
    </div>
  );
}
