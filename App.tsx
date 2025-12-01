
import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { View, Theme, Shift, Settings, Notification, NotificationType } from './types';
import Header from './components/Header';
import { ClockView, CalendarView, SettingsView } from './components/Views';
import { Toast } from './components/UI';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Clock);
  const [theme, setTheme] = useLocalStorage<Theme>('theme', Theme.Dark); // Default to Dark
  const [shifts, setShifts] = useLocalStorage<Shift[]>('time-tracker-shifts', []);
  
  // Notification State
  const [notification, setNotification] = useState<Notification | null>(null);
  
  // Initialize settings with default Hour Types
  const [settings, setSettings] = useLocalStorage<Settings>('time-tracker-settings', {
    categories: ['Programado', 'DRP', 'Traslado', 'Guardia'],
    hourTypes: [
      { id: '1', name: 'Normal', price: 10 },
      { id: '2', name: 'Especial', price: 15 },
      { id: '3', name: 'Extra', price: 20 },
    ],
    downloadFormat: 'txt',
  });

  // Ensure default hourTypes exist for older local storage versions
  useEffect(() => {
    if (!settings.hourTypes || settings.hourTypes.length === 0) {
      setSettings(prev => ({
        ...prev,
        hourTypes: [
          { id: '1', name: 'Normal', price: 10 },
          { id: '2', name: 'Especial', price: 15 },
          { id: '3', name: 'Extra', price: 20 },
        ]
      }));
    }
  }, [settings.hourTypes, setSettings]);

  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;
    setTheme(newTheme);
  };

  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (theme === Theme.Dark) {
      document.documentElement.classList.add('dark');
      metaThemeColor?.setAttribute("content", "#111111"); // Actualiza barra a negro
    } else {
      document.documentElement.classList.remove('dark');
      metaThemeColor?.setAttribute("content", "#f3f4f6"); // Actualiza barra a gris claro
    }
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case View.Calendar:
        return <CalendarView shifts={shifts} setShifts={setShifts} hourTypes={settings.hourTypes} settings={settings} notify={notify} />;
      case View.Settings:
        return <SettingsView settings={settings} setSettings={setSettings} shifts={shifts} setShifts={setShifts} notify={notify} />;
      case View.Clock:
      default:
        return <ClockView shifts={shifts} setShifts={setShifts} categories={settings.categories} hourTypes={settings.hourTypes} notify={notify} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300 selection:bg-yellow-500 selection:text-black">
      <Header 
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <main className="container mx-auto p-2 sm:p-4 lg:p-6 pb-20 max-w-4xl">
        {renderView()}
      </main>
      <Toast notification={notification} onClose={() => setNotification(null)} />
    </div>
  );
};

export default App;
