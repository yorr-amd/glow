import { Zap, Sparkles } from 'lucide-react';

export default function QuickModeToggle({ mode, onToggle, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center rounded-full border border-pink-100 bg-white/70 p-0.5">
        <button
          type="button"
          onClick={() => onToggle('quick')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
            ${mode === 'quick' ? 'bg-amber-400 text-white shadow-sm' : 'text-slate-500 hover:text-[#D06885]'}`}
        >
          Quick
        </button>
        <button
          type="button"
          onClick={() => onToggle('full')}
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all
            ${mode === 'full' ? 'bg-[#D06885] text-white shadow-sm' : 'text-slate-500 hover:text-[#D06885]'}`}
        >
          Full
        </button>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-white/60">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-amber-100/80 text-amber-600">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[#3D1F2A]">Mode Rutin</h3>
            <p className="text-xs text-slate-400 mt-0.5">Pilih intensitas skincare hari ini</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle('quick')}
          className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200
            ${mode === 'quick'
              ? 'bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-400/30'
              : 'bg-white/80 border border-white/40 text-slate-600 hover:bg-blush-50/50'
            }`}>
          <span className="flex items-center gap-1 mb-1">
            <Zap size={16} />
            <span className="font-bold text-xs uppercase tracking-wider">Quick</span>
          </span>
          <span className="text-[10px] opacity-80">3-4 step essential</span>
        </button>
        
        <button
          onClick={() => onToggle('full')}
          className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200
            ${mode === 'full'
              ? 'bg-gradient-to-br from-blush-400 to-rose-400 text-white shadow-lg shadow-blush-400/30'
              : 'bg-white/80 border border-white/40 text-slate-600 hover:bg-blush-50/50'
            }`}>
          <span className="flex items-center gap-1 mb-1">
            <Sparkles size={16} />
            <span className="font-bold text-xs uppercase tracking-wider">Full</span>
          </span>
          <span className="text-[10px] opacity-80">Lengkap 5-6 step</span>
        </button>
      </div>
      
      <p className="text-xs text-slate-400 mt-3 text-center">
        {mode === 'quick' 
          ? '⚡ Mode hemat waktu: cuma step wajib aja!' 
          : '✨ Full experience: treat kulit maksimal!'}
      </p>
    </div>
  );
}