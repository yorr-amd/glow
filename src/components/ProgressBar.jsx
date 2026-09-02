export default function ProgressBar({ progress, total, checked, mode, variant = 'full' }) {
  const pct = Math.round(progress);

  const getMsg = () => {
    if (pct === 100) return { text: 'Sempurna! Kamu glowing banget! 🎉', stars: 5 };
    if (pct >= 75)   return { text: 'Hampir selesai, semangat! 💪', stars: 4 };
    if (pct >= 50)   return { text: 'Lagi seru nih, terusin! ✨', stars: 3 };
    if (pct >= 25)   return { text: 'Good start, lanjut yuk! 🌱', stars: 2 };
    return             { text: 'Yuk mulai skincare-nya! 🫧', stars: 1 };
  };

  const getGradient = () => {
    switch(mode) {
      case 'pagi': return 'from-[#F59E0B] to-[#E11D48]';
      case 'siang': return 'from-[#0284C7] to-[#0D9488]';
      case 'sore': return 'from-[#E8A0B0] to-[#D07A90]';
      case 'malam': default: return 'from-[#A090C0] to-[#7A6098]';
    }
  };

  const { text, stars } = getMsg();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  if (variant === 'sidebar') {
    return (
      <div className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${getGradient()} shadow-md text-white`}>
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/15 pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r={radius} fill="none" stroke="white" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-white text-xl font-bold leading-none">{pct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm mb-1">{text}</p>
            <p className="text-white/80 text-xs mb-2 font-medium">{checked} dari {total} produk</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < stars ? 'text-yellow-200' : 'text-white/30'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r ${getGradient()} text-white shadow-md`}>
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/15 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-8">
        {/* Big number */}
        <div className="text-center flex-shrink-0">
          <p className="font-display text-white font-bold leading-none" style={{ fontSize: '3.5rem' }}>{pct}%</p>
          <p className="text-white/75 text-xs mt-1 uppercase tracking-widest font-semibold">Progress</p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-white/25 flex-shrink-0" />

        {/* Details */}
        <div className="flex-1">
          <p className="text-white font-semibold text-sm mb-1">{text}</p>
          <p className="text-white/80 text-xs mb-3 font-medium">{checked} dari {total} produk selesai</p>

          {/* Stars */}
          <div className="flex gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`text-base transition-all ${i < stars ? 'text-yellow-200' : 'text-white/30'}`}>★</span>
            ))}
          </div>

          {/* Bar */}
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-white animate-progress"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
