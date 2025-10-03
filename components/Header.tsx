import React from 'react';
import { LogoutIcon, Squares2x2Icon, UserGroupIcon, ArrowDownTrayIcon } from './icons';

interface HeaderProps {
  onLogout: () => void;
  viewMode: 'card' | 'gallery';
  onViewModeChange: (mode: 'card' | 'gallery') => void;
  showInstallButton: boolean;
  onInstallClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, viewMode, onViewModeChange, showInstallButton, onInstallClick }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              Haraipara Album
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
            {showInstallButton && (
                 <button 
                    onClick={onInstallClick}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
                    aria-label="Add app to home screen"
                >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Add App</span>
                </button>
            )}
            <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex items-center">
                <button 
                    onClick={() => onViewModeChange('card')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                    aria-label="Card View"
                >
                    <Squares2x2Icon className={`w-5 h-5 ${viewMode === 'card' ? 'text-emerald-500' : 'text-slate-500'}`} />
                </button>
                <button 
                    onClick={() => onViewModeChange('gallery')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'gallery' ? 'bg-white dark:bg-slate-800 shadow' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                    aria-label="Gallery View"
                >
                    <UserGroupIcon className={`w-5 h-5 ${viewMode === 'gallery' ? 'text-emerald-500' : 'text-slate-500'}`} />
                </button>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors"
              aria-label="Log out"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;