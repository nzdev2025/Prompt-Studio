
import React from 'react';
import { Sun, Moon, Menu, Globe } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';
import type { Language } from '../../lib/i18n';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { theme, setTheme, language, setLanguage, t } = useAppContext();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/50 p-4 z-10">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 dark:text-gray-400 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar (Placeholder) */}
        <div className="hidden md:block relative w-full max-w-xs">
          <input
            type="text"
            placeholder={t('search')}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Right-side Icons */}
        <div className="flex items-center space-x-4 ml-auto">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={theme === 'light' ? t('dark_mode') : t('light_mode')}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center space-x-1"
            aria-label="Toggle Language"
          >
            <Globe className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase">{language}</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
            <img src="https://picsum.photos/100/100" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
