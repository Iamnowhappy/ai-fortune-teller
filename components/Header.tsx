import React from 'react';
import { HomeIcon } from './icons';

interface HeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ icon, title, description, onBack }) => {
  return (
    <header className="relative text-center py-6 border-b border-slate-700/50 w-full">
      {onBack && (
        <button 
          onClick={onBack} 
          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-cyan-400 transition-colors duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
          aria-label="홈으로 돌아가기"
        >
          <HomeIcon className="w-8 h-8" />
        </button>
      )}
      <div className="flex items-center justify-center gap-4">
        {icon}
        <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-wider text-white">
          {title}
        </h1>
      </div>
      <p className="mt-3 text-lg text-slate-400">
        {description}
      </p>
    </header>
  );
};