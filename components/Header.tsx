
import React from 'react';

interface HeaderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export const Header: React.FC<HeaderProps> = ({ icon, title, description }) => {
  return (
    <header className="text-center py-6 border-b border-slate-700/50">
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
