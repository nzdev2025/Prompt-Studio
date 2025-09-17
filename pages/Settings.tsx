
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import type { Language } from '../lib/i18n';
import { Sun, Moon } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, setTheme, language, setLanguage, t } = useAppContext();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your application preferences.</p>
      </div>
      
      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold border-b border-gray-200 dark:border-gray-700 pb-3">{t('appearance')}</h2>
        
        <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
                <h3 className="font-medium">{t('theme')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('choose_theme')}</p>
            </div>
            <div className="md:col-span-2">
                <div className="flex space-x-2 rounded-lg bg-gray-100 dark:bg-gray-900 p-1">
                    <button onClick={() => setTheme('light')} className={`w-full font-medium py-2.5 text-sm rounded-md transition ${theme === 'light' ? 'bg-white dark:bg-gray-700 shadow' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}>
                       <Sun className="inline-block h-5 w-5 mr-2"/> {t('light_mode')}
                    </button>
                     <button onClick={() => setTheme('dark')} className={`w-full font-medium py-2.5 text-sm rounded-md transition ${theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-800 shadow' : 'hover:bg-white/50 dark:hover:bg-white/10'}`}>
                       <Moon className="inline-block h-5 w-5 mr-2"/> {t('dark_mode')}
                    </button>
                </div>
            </div>
        </div>

        <div className="py-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-1">
                <h3 className="font-medium">{t('language')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('choose_language')}</p>
            </div>
            <div className="md:col-span-2">
                 <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                >
                    <option value="en">{t('english')}</option>
                    <option value="th">{t('thai')}</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
