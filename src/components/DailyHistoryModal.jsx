import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Award,
  Flame,
  Star,
  Clock,
  Heart,
  FileText,
  Save,
} from 'lucide-react';
import { modeConfig } from '../data/skincareData';

export const DAILY_HISTORY_KEY = 'ceceyori_daily_history';

export const getDailyHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(DAILY_HISTORY_KEY) || '{}');
  } catch {
    return {};
  }
};

export const saveDailyHistory = (history) => {
  localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
};

export const recordDayActivity = (dateStr, checkedIds, allItems, mode) => {
  const history = getDailyHistory();
  const existing = history[dateStr] || {
    date: dateStr,
    timestamp: Date.now(),
    modesCompleted: [],
    itemsChecked: [],
    note: '',
  };

  const combinedItems = Array.from(new Set([...(existing.itemsChecked || []), ...checkedIds]));
  const modes = new Set(existing.modesCompleted || []);
  if (checkedIds.length > 0) {
    modes.add(mode);
  }

  history[dateStr] = {
    ...existing,
    date: dateStr,
    timestamp: existing.timestamp || Date.now(),
    modesCompleted: Array.from(modes),
    itemsChecked: combinedItems,
    totalCount: combinedItems.length,
  };

  saveDailyHistory(history);
  return history;
};

export default function DailyHistoryModal({ isOpen, onClose }) {
  const [history, setHistory] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteInput, setNoteInput] = useState('');
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'stats'

  useEffect(() => {
    if (isOpen) {
      const data = getDailyHistory();
      setHistory(data);
      const keys = Object.keys(data).sort().reverse();
      if (keys.length > 0) {
        setSelectedDate(keys[0]);
        setNoteInput(data[keys[0]]?.note || '');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const dates = Object.keys(history).sort().reverse();
  const totalDays = dates.length;
  const totalCompletedModes = Object.values(history).reduce(
    (acc, cur) => acc + (cur.modesCompleted?.length || 0),
    0
  );

  const selectedData = selectedDate ? history[selectedDate] : null;

  const handleSaveNote = () => {
    if (!selectedDate) return;
    const updated = {
      ...history,
      [selectedDate]: {
        ...history[selectedDate],
        note: noteInput,
      },
    };
    setHistory(updated);
    saveDailyHistory(updated);
  };

  const handleDeleteEntry = (date) => {
    if (window.confirm(`Hapus catatan skincare tanggal ${date}?`)) {
      const updated = { ...history };
      delete updated[date];
      setHistory(updated);
      saveDailyHistory(updated);
      if (selectedDate === date) {
        const remaining = Object.keys(updated).sort().reverse();
        setSelectedDate(remaining[0] || null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl border border-pink-200/80 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-purple-500/10 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-xl shadow-md border-2 border-white">
              📅
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#3D1F2A] flex items-center gap-1.5">
                Riwayat & Jurnal Glowing Cece 🌸
              </h2>
              <p className="text-xs text-slate-500">
                Catatan jejak konsistensi dan progres perawatan kulitmu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-pink-50/50 border-b border-pink-100">
          <div className="bg-white/80 rounded-2xl p-3 text-center border border-pink-100 shadow-2xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Hari</p>
            <p className="font-display text-xl font-bold text-[#D06885]">{totalDays} Hari</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-3 text-center border border-pink-100 shadow-2xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Sesi Selesai</p>
            <p className="font-display text-xl font-bold text-purple-600">{totalCompletedModes} Sesi</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-3 text-center border border-pink-100 shadow-2xs">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Konsistensi</p>
            <p className="font-display text-xl font-bold text-amber-500 flex items-center justify-center gap-0.5">
              <Sparkles size={14} /> {totalDays > 0 ? '100%' : '0%'}
            </p>
          </div>
        </div>

        {/* Main Content: Split List & Detail */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-pink-100">
          
          {/* Left Column: Date List */}
          <div className="md:col-span-5 p-4 overflow-y-auto space-y-2 max-h-[360px]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Daftar Tanggal
            </p>

            {dates.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Belum ada riwayat tercatat. Mulai centang rutinitas hari ini! 🌸
              </div>
            ) : (
              dates.map((date) => {
                const item = history[date];
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setNoteInput(item.note || '');
                    }}
                    className={`w-full p-3 rounded-2xl text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-pink-100/80 border-pink-400 shadow-xs'
                        : 'bg-white/60 border-slate-100 hover:bg-pink-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#3D1F2A]">{date}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {item.modesCompleted?.map((m) => (
                          <span
                            key={m}
                            className="text-[9px] px-1.5 py-0.5 rounded-full bg-white font-semibold text-slate-600 border border-slate-100"
                          >
                            {modeConfig[m]?.icon} {modeConfig[m]?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-400" />
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Day Detail */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-4 max-h-[360px]">
            {selectedData ? (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#3D1F2A]">
                      Detail: {selectedData.date}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {selectedData.itemsChecked?.length || 0} produk berhasil diaplikasikan
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(selectedData.date)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs"
                    title="Hapus catatan tanggal ini"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Sesi Selesai Badges */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Sesi Waktu Tercatat
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedData.modesCompleted?.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200 flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{modeConfig[m]?.icon}</span>
                        <span>Rutin {modeConfig[m]?.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Catatan Jurnal Pribadi */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Catatan Kondisi Kulit
                  </label>
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Contoh: Kulit terasa halus setelah pakai toner merah, bangun pagi terasa kenyal..."
                    className="w-full p-3 rounded-2xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-xs text-[#3D1F2A]"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveNote}
                      className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-[#D06885] hover:bg-[#9B4B62] transition-all flex items-center gap-1 shadow-2xs"
                    >
                      <Save size={12} /> Simpan Catatan
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs">
                Pilih tanggal di sebelah kiri untuk melihat detail catatan skincare.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-pink-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#D06885] to-[#9B4B62] shadow-sm hover:shadow-md transition-all"
          >
            Tutup Riwayat
          </button>
        </div>

      </div>
    </div>
  );
}
