
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Language, TranslationKey } from '../lib/i18n';
import { translations } from '../lib/i18n';

type Theme = 'light' | 'dark';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: { [key: string]: string | number }) => string;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'th';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key: TranslationKey, params?: { [key: string]: string | number }): string => {
    let translation = translations[language][key] || translations['en'][key] || String(key);
    if (params) {
      Object.keys(params).forEach(paramKey => {
        const value = params[paramKey];
        translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
      });
    }
    return translation;
  }, [language]);

  const contextValue = useMemo(() => ({
    theme,
    setTheme,
    language,
    setLanguage,
    t
  }), [theme, language, t]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
