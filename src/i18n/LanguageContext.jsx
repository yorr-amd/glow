import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);
const LANG_STORAGE_KEY = 'glow_language';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem(LANG_STORAGE_KEY) || 'id';
    } catch {
      return 'id';
    }
  });

  const setLang = useCallback((newLang) => {
    const valid = newLang === 'en' ? 'en' : 'id';
    setLangState(valid);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, valid);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'id' ? 'en' : 'id');
  }, [lang, setLang]);

  // Helper function to resolve nested keys like "hero.progressTitle"
  const t = useCallback((keyPath, fallback = '') => {
    if (!keyPath) return fallback;
    const currentDict = translations[lang] || translations.id;
    const keys = keyPath.split('.');
    let value = currentDict;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Fallback to Indonesian if missing in English
        let fallbackVal = translations.id;
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            return fallback || keyPath;
          }
        }
        return fallbackVal || fallback || keyPath;
      }
    }
    return typeof value === 'string' ? value : (fallback || keyPath);
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang,
    t,
    dict: translations[lang] || translations.id,
    isEn: lang === 'en',
    isId: lang === 'id',
  }), [lang, setLang, toggleLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
