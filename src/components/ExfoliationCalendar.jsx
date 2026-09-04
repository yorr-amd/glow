import { Calendar } from 'lucide-react';
import { isExfoliatingDay } from '../utils/dateHelper';

const WEEK_DAYS = [
  { label: 'Sen', full: 'Senin', dayIndex: 1, isTonerDay: false },
  { label: 'Sel', full: 'Selasa', dayIndex: 2, isTonerDay: false },
  { label: 'Rab', full: 'Rabu', dayIndex: 3, isTonerDay: true },
  { label: 'Kam', full: 'Kamis', dayIndex: 4, isTonerDay: false },
  { label: 'Jum', full: 'Jumat', dayIndex: 5, isTonerDay: false },
  { label: 'Sab', full: 'Sabtu', dayIndex: 6, isTonerDay: true },
  { label: 'Min', full: 'Minggu', dayIndex: 0, isTonerDay: false },
];

export default function ExfoliationCalendar({ tonerEnabled = false }) {
  const currentDayIndex = new Date().getDay();
  const isScheduledToday = isExfoliatingDay();

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#D06885]" />
          <h3 className="font-semibold text-sm text-[#3D1F2A]">Jadwal Toner Merah</h3>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
          Rabu & Sabtu
        </span>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {WEEK_DAYS.map((d) => {
          const isToday = d.dayIndex === currentDayIndex;
          return (
            <div
              key={d.label}
              title={d.isTonerDay ? `${d.full} · Jadwal Toner Merah` : d.full}
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
                <span className="mt-1 text-[8px] font-bold uppercase tracking-wider text-[#D06885]">hari ini</span>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-slate-400 mt-3 text-center">
        {!isScheduledToday
          ? '🔒 Terkunci — Eksfoliasi hanya aktif Rabu & Sabtu malam'
          : tonerEnabled
            ? '✨ Toner Merah aktif di checklist malam ini'
            : 'Toner Merah sedang OFF — aktifkan saklar untuk membuka'}
      </p>
    </div>
  );
}
