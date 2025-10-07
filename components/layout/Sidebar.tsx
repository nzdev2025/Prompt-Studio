
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FileText, Bot, TestTube, Download, Settings, X } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { t } = useAppContext();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/templates', icon: Bot, label: t('templates') },
    { href: '/caps', icon: FolderKanban, label: t('caps') },
    { href: '/sandbox', icon: TestTube, label: t('sandbox') },
    { href: '/export', icon: Download, label: t('export') },
    { href: '/settings', icon: Settings, label: t('settings') },
  ];

  const NavItem = ({ href, icon: Icon, label }: typeof navItems[0]) => (
    <NavLink
      to={href}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-500 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`
      }
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </NavLink>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 bg-white dark:bg-gray-800 shadow-lg lg:shadow-none z-30 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary-500 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">{t('app_title')}</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
           {/* Placeholder for user info or upgrade CTA */}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
