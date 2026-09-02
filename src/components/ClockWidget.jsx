import { useState, useEffect } from 'react';
import { Sun, Moon, Sunrise, Sunset, CloudSun } from 'lucide-react';
import { modeConfig } from '../data/skincareData';

export default function ClockWidget({ mode }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
  const dateStr = time.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  const getModeIcon = () => {
    switch(mode) {
      case 'pagi': return <Sunrise size={16} className="text-amber-200" />;
      case 'siang': return <Sun size={16} className="text-sky-200" />;
      case 'sore': return <Sunset size={16} className="text-rose-200" />;
      case 'malam': default: return <Moon size={16} className="text-violet-200" />;
    }
  };

  const getModeGradient = () => {
    switch(mode) {
      case 'pagi': return 'bg-gradient-to-br from-[#F59E0B] to-[#E11D48]';
      case 'siang': return 'bg-gradient-to-br from-[#0284C7] to-[#0D9488]';
      case 'sore': return 'bg-gradient-to-br from-[#C97B8E] to-[#9B4B62]';
      case 'malam': default: return 'bg-gradient-to-br from-[#7B6C8E] to-[#4E3866]';
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 text-white shadow-md ${getModeGradient()}`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="flex items-center gap-2 mb-2">
        {getModeIcon()}
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/80 font-bold">
          Rutin {modeConfig[mode]?.label || mode}
        </span>
      </div>
      <p className="font-mono text-3xl font-bold tracking-widest leading-none">{timeStr}</p>
      <p className="text-white/80 text-xs capitalize mt-2 font-medium">{dateStr}</p>
    </div>
  );
}
