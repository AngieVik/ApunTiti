import React, { useState, useEffect } from "react";
import { View, Theme } from "../types";
import { ClockIcon, CalendarIcon, CogIcon, SunIcon, MoonIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";
import { useAppStore } from "../store/useAppStore";

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  ariaLabel?: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, ariaLabel, icon, isActive, onClick }) => {
  const buttonClasses = `${APP_STYLES.HEADER.navButtonBase} ${
    isActive
      ? APP_STYLES.HEADER.navButtonActive
      : APP_STYLES.HEADER.navButtonInactive
  }`;

  return (
    <button
      onClick={onClick}
      className={buttonClasses}
      aria-label={ariaLabel || label}
    >
      <span className={APP_STYLES.HEADER.navButtonIcon}>{icon}</span>
      {label && (
        <span className={APP_STYLES.HEADER.navButtonLabel}>{label}</span>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={APP_STYLES.HEADER.container}>
      <div className={APP_STYLES.HEADER.innerContainer}>
        {/* Date and Time Stacked - Left Aligned */}
        <div className={APP_STYLES.HEADER.dateTimeWrapper}>
          <p className={APP_STYLES.HEADER.dateText}>
            {liveTime.toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </p>
          <h2 className={APP_STYLES.HEADER.timeText}>
            {liveTime.toLocaleTimeString()}
          </h2>
        </div>

        <nav className={APP_STYLES.HEADER.navContainer}>
          <div className={APP_STYLES.HEADER.navButtonsWrapper}>
            <NavButton
              label=""
              ariaLabel="Reloj"
              icon={<ClockIcon className={APP_STYLES.MODOS.iconMedium} />}
              isActive={currentView === View.Clock}
              onClick={() => setCurrentView(View.Clock)}
            />
            <NavButton
              label=""
              ariaLabel="Calendario"
              icon={<CalendarIcon className={APP_STYLES.MODOS.iconMedium} />}
              isActive={currentView === View.Calendar}
              onClick={() => setCurrentView(View.Calendar)}
            />
            <NavButton
              label=""
              ariaLabel="Ajustes"
              icon={<CogIcon className={APP_STYLES.MODOS.iconMedium} />}
              isActive={currentView === View.Settings}
              onClick={() => setCurrentView(View.Settings)}
            />
          </div>
        </nav>
        <button
          onClick={toggleTheme}
          className={APP_STYLES.HEADER.themeButton}
          aria-label="Cambiar tema"
        >
          {theme === Theme.Light ? (
            <MoonIcon className={APP_STYLES.MODOS.iconMedium} />
          ) : (
            <SunIcon className={APP_STYLES.MODOS.iconMedium} />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
