import { useState, useEffect } from 'react';
import { Sun, AlertTriangle, Droplet, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const PEKANBARU_LAT = -0.5167;
const PEKANBARU_LON = 101.4500;

export default function WeatherAlert() {
  const { t } = useLanguage();
  const [uvData, setUvData] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${PEKANBARU_LAT}&longitude=${PEKANBARU_LON}&current_weather=true&daily=uv_index_max&timezone=Asia/Jakarta`
        );
        if (!response.ok) throw new Error('Gagal memuat cuaca');
        const data = await response.json();
        setWeather(data.current_weather);
        setUvData(data.daily?.uv_index_max?.[0] ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 animate-pulse">
        <div className="h-4 bg-pink-100 rounded w-1/3" />
      </div>
    );
  }

  if (error || (!weather && !uvData)) {
    return null;
  }

  const uvIndex = uvData ?? 0;
  const isHighUV = uvIndex >= 6;
  const temp = weather?.temperature ?? 0;
  const windSpeed = weather?.windspeed ?? 0;

  const getUVLevel = (uv) => {
    if (uv >= 11) return { label: t('weather.levels.extreme', 'Ekstrem'), color: 'text-purple-600 bg-purple-50 border-purple-100', icon: '☀️' };
    if (uv >= 8) return { label: t('weather.levels.veryHigh', 'Sangat Tinggi'), color: 'text-red-600 bg-red-50 border-red-100', icon: '🔴' };
    if (uv >= 6) return { label: t('weather.levels.high', 'Tinggi'), color: 'text-orange-600 bg-orange-50 border-orange-100', icon: '🟠' };
    if (uv >= 3) return { label: t('weather.levels.moderate', 'Sedang'), color: 'text-yellow-600 bg-yellow-50 border-yellow-100', icon: '🟡' };
    return { label: t('weather.levels.low', 'Rendah'), color: 'text-green-600 bg-green-50 border-green-100', icon: '🟢' };
  };

  const uvLevel = getUVLevel(uvIndex);

  return (
    <div className="relative bg-white/70 backdrop-blur-md border border-white/40 rounded-2xl p-4 shadow-sm transition-all duration-500 hover:shadow-md">
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${isHighUV ? 'bg-orange-100' : 'bg-sky-100'}`}>
          {uvLevel.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm text-[#3D1F2A]">{t('weather.title', '☀️ UV Index Pekanbaru Hari Ini')}</h3>
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${uvLevel.color}`}>
              {uvLevel.label} ({uvIndex})
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <Sun size={12} /> {temp}°C
            </span>
            <span className="flex items-center gap-1">
              <Droplet size={12} /> {t('weather.wind', 'Angin')} {windSpeed} {t('weather.windUnit', 'km/jam')}
            </span>
          </div>

          {isHighUV && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-50 border border-orange-100 animate-pulse-subtle">
              <AlertTriangle size={16} className="text-orange-500 flex-shrink-0" />
              <p className="text-sm text-orange-700 font-medium">
                {t('weather.warningHigh', 'UV Tinggi saat ini! Jangan lupa aplikasikan sunscreen / body lotion SPF diulang ya! ☀️✨')}
              </p>
            </div>
          )}

          {!isHighUV && uvIndex > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50 border border-green-100">
              <Sparkles size={16} className="text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-700">
                {t('weather.safeUv', 'UV aman buat aktivitas luar. Tetap pakai pelembap & SPF biar glowing terjaga! 💖')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}