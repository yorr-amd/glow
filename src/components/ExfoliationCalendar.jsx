import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ExfoliationCalendar({
  tonerEnabled = false,
  scheduledProducts = [],
  onOpenShelf,
}) {
  const { isEn } = useLanguage();

  const logicalDate = new Date();
  if (logicalDate.getHours() < 5) logicalDate.setDate(logicalDate.getDate() - 1);
  const currentDayIndex = logicalDate.getDay();

  // Helper to find products scheduled on a given day index (0=Min..6=Sab)
  const getProductsForDay = (dayIndex) => {
    return scheduledProducts.filter((p) => {
      const days = Array.isArray(p.scheduledDays)
        ? p.scheduledDays
        : (p.isConditional ? [3, 6] : []);
      return days.includes(dayIndex);
    });
  };

  const hasAnyScheduled = scheduledProducts.length > 0;
  const productsToday = getProductsForDay(currentDayIndex);
  const isScheduledToday = productsToday.length > 0;

  const weekDays = [
    { key: 'mon', label: isEn ? 'Mon' : 'Sen', dayIndex: 1 },
    { key: 'tue', label: isEn ? 'Tue' : 'Sel', dayIndex: 2 },
    { key: 'wed', label: isEn ? 'Wed' : 'Rab', dayIndex: 3 },
    { key: 'thu', label: isEn ? 'Thu' : 'Kam', dayIndex: 4 },
    { key: 'fri', label: isEn ? 'Fri' : 'Jum', dayIndex: 5 },
    { key: 'sat', label: isEn ? 'Sat' : 'Sab', dayIndex: 6 },
    { key: 'sun', label: isEn ? 'Sun' : 'Min', dayIndex: 0 },
  ];

  // Active days count across the week
  const activeDaysCount = weekDays.filter((d) => getProductsForDay(d.dayIndex).length > 0).length;

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#D06885]" />
          <h3 className="font-semibold text-sm text-[#3D1F2A]">
            {isEn ? 'Periodic Product Schedule' : 'Jadwal Produk Berkala'}
          </h3>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            hasAnyScheduled
              ? 'text-rose-600 bg-rose-50 border-rose-100'
              : 'text-slate-400 bg-slate-50 border-slate-200'
          }`}
        >
          {hasAnyScheduled
            ? (isEn ? `${activeDaysCount} Days / Week` : `${activeDaysCount} Hari / Minggu`)
            : (isEn ? 'Empty Schedule' : 'Jadwal Kosong')}
        </span>
      </div>

      {/* 7-Day Matrix */}
      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((d) => {
          const isToday = d.dayIndex === currentDayIndex;
          const prods = getProductsForDay(d.dayIndex);
          const isScheduledDay = prods.length > 0;
          const tooltip = isScheduledDay
            ? `${d.label}: ${prods.map((p) => p.name).join(', ')}`
            : `${d.label}: ${isEn ? 'No scheduled products' : 'Tidak ada jadwal'}`;

          return (
            <div
              key={d.key}
              title={tooltip}
              className={`relative flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all duration-300 ${
                isToday ? 'ring-2 ring-[#D06885] ring-offset-1 ring-offset-white' : ''
              } ${
                isScheduledDay
                  ? 'bg-gradient-to-b from-rose-50 to-rose-100/80 text-rose-800 font-bold toner-day-glow'
                  : 'bg-slate-50/80 text-slate-400'
              }`}
            >
              <span className="text-[10px] leading-none uppercase tracking-wide">{d.label}</span>
              <span className="text-sm mt-1 leading-none">
                {isScheduledDay ? '🧪' : '·'}
              </span>
              {isToday && (
                <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-[#D06885]">
                  {isEn ? 'Today' : 'Hari Ini'}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Status & Action */}
      {!hasAnyScheduled ? (
        <div className="mt-3 pt-2 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 mb-2">
            {isEn
              ? 'No periodic products scheduled yet. Set custom usage days (e.g. exfoliating toner, peeling, mask) in Skincare Shelf.'
              : 'Belum ada produk berkala. Atur hari pemakaian khusus (misal: toner eksfoliasi, peeling, masker) di Lemari Skincare.'}
          </p>
          {onOpenShelf && (
            <button
              onClick={onOpenShelf}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#D06885] bg-pink-50 hover:bg-pink-100 border border-pink-200 transition-all cursor-pointer"
            >
              <Plus size={12} />
              <span>{isEn ? 'Schedule in Shelf' : 'Atur di Lemari Skincare'}</span>
            </button>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-slate-400 mt-3 text-center">
          {!isScheduledToday
            ? (isEn
                ? '🔒 Locked today — No periodic products scheduled for today'
                : '🔒 Terkunci hari ini — Tidak ada produk berkala terjadwal hari ini')
            : tonerEnabled
            ? (isEn
                ? `✨ ${productsToday.map((p) => p.name).join(', ')} active in tonight's checklist`
                : `✨ ${productsToday.map((p) => p.name).join(', ')} aktif di checklist malam ini`)
            : (isEn
                ? 'Periodic care is currently OFF — toggle switch above to unlock'
                : 'Produk berkala sedang OFF — aktifkan saklar di atas untuk membuka')}
        </p>
      )}
    </div>
  );
}
