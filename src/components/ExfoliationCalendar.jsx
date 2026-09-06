import { Calendar } from 'lucide-react';
import { isExfoliatingDay } from '../utils/dateHelper';
import { useLanguage } from '../i18n/LanguageContext';

export default function ExfoliationCalendar({ tonerEnabled = false }) {
  const { t } = useLanguage();
  const currentDayIndex = new Date().getDay();
  const isScheduledToday = isExfoliatingDay();

  const weekDays = [
    { key: 'mon', label: t('calendar.days.mon', 'Sen'), dayIndex: 1, isTonerDay: false },
    { key: 'tue', label: t('calendar.days.tue', 'Sel'), dayIndex: 2, isTonerDay: false },
    { key: 'wed', label: t('calendar.days.wed', 'Rab'), dayIndex: 3, isTonerDay: true },
    { key: 'thu', label: t('calendar.days.thu', 'Kam'), dayIndex: 4, isTonerDay: false },
    { key: 'fri', label: t('calendar.days.fri', 'Jum'), dayIndex: 5, isTonerDay: false },
    { key: 'sat', label: t('calendar.days.sat', 'Sab'), dayIndex: 6, isTonerDay: true },
    { key: 'sun', label: t('calendar.days.sun', 'Min'), dayIndex: 0, isTonerDay: false },
  ];

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#D06885]" />
          <h3 className="font-semibold text-sm text-[#3D1F2A]">{t('calendar.title', 'Jadwal Toner Merah')}</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
          {t('calendar.badge', 'Rabu & Sabtu')}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {weekDays.map((d) => {
          const isToday = d.dayIndex === currentDayIndex;
          return (
            <div
              key={d.key}
              title={d.isTonerDay ? `${d.label} · ${t('calendar.title', 'Jadwal Toner Merah')}` : d.label}
              className={`relative flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all duration-300
                ${isToday ? 'ring-2 ring-[#D06885] ring-offset-1 ring-offset-white' : ''}
                ${d.isTonerDay
                  ? 'bg-gradient-to-b from-rose-50 to-rose-100/80 text-rose-800 font-bold toner-day-glow'
                  : 'bg-slate-50/80 text-slate-400'
                }`}
            >
              <span className="text-[10px] leading-none uppercase tracking-wide">{d.label}</span>
              <span className="text-sm mt-1 leading-none">{d.isTonerDay ? '🧪' : '·'}</span>
              {isToday && (
                <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-[#D06885]">{t('calendar.today', 'Hari Ini')}</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mt-3 text-center">
        {!isScheduledToday
          ? t('calendar.statusLocked', '🔒 Terkunci — Eksfoliasi hanya aktif Rabu & Sabtu malam')
          : tonerEnabled
            ? t('calendar.statusActive', '✨ Toner Merah aktif di checklist malam ini')
            : t('calendar.statusOff', 'Toner Merah sedang OFF — aktifkan saklar untuk membuka')}
      </p>
    </div>
  );
}
