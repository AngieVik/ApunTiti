import React, { useState, useEffect } from 'react'; // <--- AQUÍ FALTABA useEffect
import { View, Theme } from '../types';
import { ClockIcon, CalendarIcon, CogIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  // Yellow theme active state
  const activeClasses = 'bg-yellow-500 text-black shadow-inner font-bold';
  const inactiveClasses = 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 px-2 py-2 rounded-lg transition-all duration-200 w-full sm:w-auto ${isActive ? activeClasses : inactiveClasses}`}
      aria-label={label}
    >
      <span className="flex items-center justify-center">{icon}</span>
      {label && <span className="hidden sm:inline">{label}</span>}
    </button>
  );
};


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, theme, toggleTheme }) => {
  // CORRECCIÓN AQUÍ: Añadido setLiveTime dentro de los corchetes
  const [liveTime, setLiveTime] = useState(new Date());

  // NUEVO: El efecto para actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white/90 dark:bg-black/90 backdrop-blur-md p-2 shadow-xl sticky top-0 z-50 border-b border-yellow-500/20">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Date and Time Stacked - Left Aligned */}
        <div className="flex flex-col justify-center items-start mr-4">
             <p className="text-[10px] sm:text-[12px] md:text-[14px] font-medium text-yellow-600 dark:text-yellow-500 uppercase tracking-widest leading-tight">
                {liveTime.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' })}
            </p>
            <h2 className="text-[12px] sm:text-[14px] md:text-[16px] font-mono font-black text-gray-900 dark:text-white leading-tight">
                {liveTime.toLocaleTimeString()}
            </h2>
        </div>

        <nav className="flex-1 flex justify-center items-center gap-2">
          <div className="flex items-center gap-1">
            <NavButton label="" icon={<ClockIcon className="w-6 h-6" />} isActive={currentView === View.Clock} onClick={() => setCurrentView(View.Clock)} />
            <NavButton label="" icon={<CalendarIcon className="w-6 h-6" />} isActive={currentView === View.Calendar} onClick={() => setCurrentView(View.Calendar)} />
            <NavButton label="" icon={<CogIcon className="w-6 h-6" />} isActive={currentView === View.Settings} onClick={() => setCurrentView(View.Settings)} />
          </div>
        </nav>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-yellow-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-200 border border-transparent dark:border-yellow-500/50 flex items-center justify-center"
          aria-label="Cambiar tema"
        >
          {theme === Theme.Light ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;