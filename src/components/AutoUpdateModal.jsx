import { useState } from 'react';
import { Sparkles, Download, X, CheckCircle2, ArrowRight, Smartphone, Monitor, AlertCircle } from 'lucide-react';
import { triggerAutoInstall, setDismissedVersion, formatFileSize, getAppPlatform } from '../utils/autoUpdateService';
import { useLanguage } from '../i18n/LanguageContext';

export default function AutoUpdateModal({ isOpen, onClose, updateInfo }) {
  const { lang } = useLanguage();
  const isEn = lang === 'en';

  const [installStatus, setInstallStatus] = useState('idle'); // 'idle' | 'downloading' | 'started' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [dontRemind, setDontRemind] = useState(false);

  if (!isOpen || !updateInfo) return null;

  const platform = updateInfo.platform || getAppPlatform();
  const isDesktop = platform === 'desktop';

  const handleStartUpdate = async () => {
    try {
      setInstallStatus('downloading');
      setErrorMessage('');

      const result = await triggerAutoInstall(updateInfo);

      if (result && result.success) {
        setInstallStatus('started');
      } else {
        throw new Error(result?.message || 'Gagal memulai pembaruan');
      }
    } catch (err) {
      console.error('Update trigger error:', err);
      setInstallStatus('error');
      setErrorMessage(err.message || 'Terjadi kendala saat mengunduh');
    }
  };

  const handleDismiss = () => {
    if (dontRemind && updateInfo.latestVersion) {
      setDismissedVersion(updateInfo.latestVersion);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 max-w-md w-full border border-pink-200/90 shadow-2xl relative overflow-hidden animate-scale-in">
        {/* Decorative background glow */}
        <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full bg-pink-300/25 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-14 w-40 h-40 rounded-full bg-rose-200/30 blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-pink-50 transition-colors"
          title={isEn ? 'Close' : 'Tutup'}
        >
          <X size={18} />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#D06885] to-[#E8829D] text-white flex items-center justify-center shadow-md shadow-pink-400/30">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-[#D06885]">
                {isDesktop
                  ? (isEn ? 'Desktop Update Available' : 'Pembaruan Desktop Tersedia')
                  : (isEn ? 'New Update Available' : 'Pembaruan Baru Tersedia')}
              </span>
            </div>
            <h3 className="font-display text-[#3D1F2A] font-bold text-xl leading-snug">
              Glow v{updateInfo.latestVersion}
            </h3>
          </div>
        </div>

        {/* Version comparison card */}
        <div className="bg-pink-50/70 border border-pink-100/90 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">
              {isEn ? 'Current Version' : 'Versi Kamu'}
            </p>
            <p className="font-mono text-xs font-bold text-slate-600">v{updateInfo.currentVersion}</p>
          </div>

          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#D06885] shadow-2xs">
            <ArrowRight size={14} />
          </div>

          <div className="text-center">
            <p className="text-[10px] uppercase font-bold text-[#D06885]">
              {isEn ? 'Latest Version' : 'Versi Baru'}
            </p>
            <p className="font-mono text-xs font-extrabold text-[#9B4B62]">v{updateInfo.latestVersion}</p>
          </div>

          {(isDesktop ? (updateInfo.winSize || updateInfo.apkSize) : updateInfo.apkSize) && (
            <div className="border-l border-pink-200/80 pl-3 text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">
                {isDesktop ? (isEn ? 'Installer' : 'Windows') : 'APK Size'}
              </p>
              <p className="font-mono text-xs font-semibold text-slate-700">
                {formatFileSize(isDesktop ? (updateInfo.winSize || updateInfo.apkSize) : updateInfo.apkSize)}
              </p>
            </div>
          )}
        </div>

        {/* Release Notes / Changelog */}
        {updateInfo.releaseNotes && (
          <div className="mb-5">
            <p className="text-xs font-bold text-[#3D1F2A] mb-1.5 flex items-center gap-1">
              {isDesktop ? <Monitor size={13} className="text-[#D06885]" /> : <Smartphone size={13} className="text-[#D06885]" />}
              <span>{isEn ? "What's New in this Version:" : 'Catatan Pembaruan:'}</span>
            </p>
            <div className="bg-white/80 border border-pink-100 rounded-xl p-3 max-h-36 overflow-y-auto text-xs text-slate-600 leading-relaxed font-sans scrollbar-thin">
              <pre className="font-sans whitespace-pre-wrap">{updateInfo.releaseNotes}</pre>
            </div>
          </div>
        )}

        {/* Status indicator when triggered */}
        {installStatus === 'downloading' && (
          <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-center gap-3 animate-pulse">
            <Download size={20} className="text-amber-600 animate-bounce" />
            <div className="text-xs text-amber-800">
              <p className="font-bold">
                {isDesktop
                  ? (isEn ? 'Updating Glow Desktop...' : 'Memperbarui Glow Desktop...')
                  : (isEn ? 'Starting Download...' : 'Memulai Pengunduhan...')}
              </p>
              <p className="text-[11px] text-amber-700">
                {isDesktop
                  ? (isEn
                      ? 'Downloading update package or Windows setup installer.'
                      : 'Sedang mengunduh paket pembaruan Windows atau file setup installer.')
                  : (isEn
                      ? 'Downloading APK in background. An install prompt will appear once complete.'
                      : 'Mengunduh APK di latar belakang. Jendela pemasangan akan muncul otomatis setelah selesai.')}
              </p>
            </div>
          </div>
        )}

        {installStatus === 'started' && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div className="text-xs text-emerald-800">
              <p className="font-bold">
                {isDesktop
                  ? (isEn ? 'Update Ready!' : 'Pembaruan Siap!')
                  : (isEn ? 'Download In Progress!' : 'Pengunduhan Berjalan!')}
              </p>
              <p className="text-[11px] text-emerald-700">
                {isDesktop
                  ? (isEn
                      ? 'Update installed or setup file downloaded. Relaunch or run setup to finish.'
                      : 'Pembaruan telah siap atau file setup telah diunduh. Muat ulang aplikasi atau jalankan setup.')
                  : (isEn
                      ? 'Check your device notification tray to install the update.'
                      : 'Periksa bilah notifikasi HP kamu atau tunggu sesaat untuk memasang pembaruan.')}
              </p>
            </div>
          </div>
        )}

        {installStatus === 'error' && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle size={16} className="text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {installStatus !== 'started' ? (
            <button
              onClick={handleStartUpdate}
              disabled={installStatus === 'downloading'}
              className="w-full py-3 px-4 rounded-xl bg-linear-to-r from-[#D06885] to-[#9B4B62] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              <Download size={16} />
              <span>
                {isDesktop
                  ? (isEn ? 'Update Now (Windows)' : 'Perbarui Sekarang (Windows)')
                  : (isEn ? 'Update Now (1-Tap Auto Update)' : 'Perbarui Otomatis Sekarang (1-Klik)')}
              </span>
            </button>
          ) : (
            <button
              onClick={handleDismiss}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
            >
              {isEn ? 'Understood' : 'Mengerti'}
            </button>
          )}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-1.5 text-slate-500 text-[11px] cursor-pointer">
              <input
                type="checkbox"
                checked={dontRemind}
                onChange={(e) => setDontRemind(e.target.checked)}
                className="rounded text-[#D06885] focus:ring-pink-400"
              />
              <span>{isEn ? 'Skip this version' : 'Jangan ingatkan versi ini lagi'}</span>
            </label>

            <button
              onClick={handleDismiss}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-pink-50 transition-colors"
            >
              {isEn ? 'Later' : 'Nanti Saja'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
