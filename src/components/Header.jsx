import { useState, useEffect } from 'react';
import { Sunrise, Sun, Sunset, Moon } from 'lucide-react';
import { modeConfig } from '../data/skincareData';

export default function Header({ mode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const config = modeConfig[mode] || modeConfig.sore;

  const timeStr = time.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const dateStr = time.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const getModeIcon = () => {
    switch(mode) {
      case 'pagi': return <Sunrise size={14} className="text-amber-200" />;
      case 'siang': return <Sun size={14} className="text-sky-200" />;
      case 'sore': return <Sunset size={14} className="text-rose-200" />;
      case 'malam': default: return <Moon size={14} className="text-violet-200" />;
    }
  };

  return (
    <header className="relative overflow-hidden rounded-none md:rounded-3xl mb-0">
      <div className={`relative px-7 pt-10 pb-12 bg-gradient-to-br ${config.gradient}`}>

        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/10 blur-sm" />
        <div className="absolute top-8 right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 -left-8 w-44 h-44 rounded-full bg-white/10 blur-sm" />

        {/* Brand name */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <p className="font-display text-white/90 text-xl italic font-semibold tracking-wide">
            Glow ✦
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 flex items-center gap-2">
            {getModeIcon()}
            <span className="text-white font-mono text-sm font-medium tracking-widest">{timeStr}</span>
          </div>
        </div>

        {/* Main hero text */}
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-medium uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
            <span>{config.icon}</span> Rutin {config.label}
          </p>
          <h1 className="font-display text-white text-3xl font-bold leading-tight mb-3">
            {config.heroTitle}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-xs">
            {config.heroSubtitle}
          </p>

          <div className="inline-flex items-center bg-white/25 backdrop-blur-sm rounded-full px-5 py-2">
            <span className="text-white text-xs font-medium capitalize">{dateStr}</span>
          </div>
        </div>
      </div>

      <div className="h-5 rounded-b-[2rem] bg-black/10" />
    </header>
  );
}
