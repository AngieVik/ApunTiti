import React, { useState, useEffect } from "react";
import { View, Theme } from "../types";
import { ClockIcon, CalendarIcon, CogIcon, SunIcon, MoonIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";

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
  const buttonClasses = `${APP_STYLES.HEADER.navButtonBase} ${
    isActive
      ? APP_STYLES.HEADER.navButtonActive
      : APP_STYLES.HEADER.navButtonInactive
  }`;

  return (
    <button onClick={onClick} className={buttonClasses} aria-label={label}>
      <span className={APP_STYLES.HEADER.navButtonIcon}>{icon}</span>
      {label && (
        <span className={APP_STYLES.HEADER.navButtonLabel}>{label}</span>
      )}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  theme,
  toggleTheme,
}) => {
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
              icon={<ClockIcon className="w-6 h-6" />}
              isActive={currentView === View.Clock}
              onClick={() => setCurrentView(View.Clock)}
            />
            <NavButton
              label=""
              icon={<CalendarIcon className="w-6 h-6" />}
              isActive={currentView === View.Calendar}
              onClick={() => setCurrentView(View.Calendar)}
            />
            <NavButton
              label=""
              icon={<CogIcon className="w-6 h-6" />}
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
            <MoonIcon className="w-6 h-6" />
          ) : (
            <SunIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
