import { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function TitleBar({ mode = 'sore' }) {
  const { t } = useLanguage();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Detect Tauri environment
    if (typeof window !== 'undefined' && (window.__TAURI_INTERNALS__ || window.__TAURI__)) {
      setIsDesktop(true);

      // Check maximize state
      import('@tauri-apps/api/window').then(({ getCurrentWindow }) => {
        const appWindow = getCurrentWindow();
        appWindow.isMaximized().then(setIsMaximized).catch(() => {});
        
        // Listen to resize to update maximize icon
        const unlisten = appWindow.onResized(() => {
          appWindow.isMaximized().then(setIsMaximized).catch(() => {});
        });

        return () => {
          unlisten.then((fn) => fn());
        };
      }).catch(() => {});
    } else if (window.electronAPI) {
      setIsDesktop(true);
    }
  }, []);

  const handleMinimize = async () => {
    try {
      if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().minimize();
      } else if (window.electronAPI?.minimize) {
        window.electronAPI.minimize();
      }
    } catch (err) {
      console.warn('Minimize error:', err);
    }
  };

  const handleMaximize = async () => {
    try {
      if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().toggleMaximize();
        const max = await getCurrentWindow().isMaximized();
        setIsMaximized(max);
      } else if (window.electronAPI?.maximize) {
        window.electronAPI.maximize();
        setIsMaximized((prev) => !prev);
      }
    } catch (err) {
      console.warn('Maximize error:', err);
    }
  };

  const handleClose = async () => {
    try {
      if (window.__TAURI_INTERNALS__ || window.__TAURI__) {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
      } else if (window.electronAPI?.close) {
        window.electronAPI.close();
      }
    } catch (err) {
      console.warn('Close error:', err);
    }
  };

  // If in pure web browser, don't show the frameless titlebar or keep a slim decorative bar
  if (!isDesktop) {
    return null;
  }

  const getBorderColor = () => {
    switch (mode) {
      case 'pagi': return 'border-amber-100/80';
      case 'siang': return 'border-sky-100/80';
      case 'sore': return 'border-rose-100/80';
      case 'malam': default: return 'border-violet-100/80';
    }
  };

  return (
    <div
      data-tauri-drag-region
      className={`h-9 w-full bg-white/80 backdrop-blur-md border-b ${getBorderColor()} select-none flex items-center justify-between px-3 text-xs z-50 sticky top-0 transition-colors duration-300`}
    >
      {/* Left: Drag Region with Logo & Title */}
      <div data-tauri-drag-region className="flex items-center gap-2 cursor-default flex-1 h-full">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blush-400 to-rose-400 flex items-center justify-center text-white shadow-xs pointer-events-none">
          <Sparkles size={11} />
        </div>
        <span className="font-display font-semibold text-[#8B3E53] tracking-wide text-xs pointer-events-none">
          {t('appTitle', 'Glow ✦ Skincare Companion')}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-pink-50 border border-pink-200 text-[#D06885] pointer-events-none">
          v1.1.1
        </span>
      </div>

      {/* Center: Draggable area */}
      <div data-tauri-drag-region className="flex-1 h-full cursor-move" />

      {/* Right: Custom Aesthetic Window Controls */}
      <div className="flex items-center gap-1 z-50">
        {/* Minimize */}
        <button
          onClick={handleMinimize}
          title="Minimize"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-amber-700 hover:bg-amber-100/80 active:scale-95 transition-all duration-150"
        >
          <Minus size={13} strokeWidth={2.2} />
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={handleMaximize}
          title={isMaximized ? 'Restore' : 'Maximize'}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-sky-700 hover:bg-sky-100/80 active:scale-95 transition-all duration-150"
        >
          {isMaximized ? (
            <Copy size={12} strokeWidth={2.2} />
          ) : (
            <Square size={11} strokeWidth={2.2} />
          )}
        </button>

        {/* Close */}
        <button
          onClick={handleClose}
          title="Close"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-700 hover:bg-rose-100 active:scale-95 transition-all duration-150 ml-0.5"
        >
          <X size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  );
}
