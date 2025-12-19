import React, { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAnalytics } from "./hooks/useAnalytics";
import { View, Theme } from "./types";
import Header from "./components/Header";
import { useAppStore } from "./store/useAppStore";
import { Toast } from "./components/UI";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { APP_STYLES } from "./theme/styles";

// Lazy load views
const ClockView = React.lazy(() =>
  import("./components/ClockView").then((module) => ({
    default: module.ClockView,
  }))
);
const CalendarView = React.lazy(() =>
  import("./components/CalendarView").then((module) => ({
    default: module.CalendarView,
  }))
);
const SettingsView = React.lazy(() =>
  import("./components/SettingsView").then((module) => ({
    default: module.SettingsView,
  }))
);

// Simple Loading Spinner for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex h-full w-full items-center justify-center p-10">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Clock);

  // Store usage
  const theme = useAppStore((state) => state.theme);
  const notification = useAppStore((state) => state.notification);
  const setNotification = useAppStore((state) => state.setNotification);

  // Analytics
  const { trackEvent } = useAnalytics();
  useEffect(() => {
    trackEvent({ name: "view_change", properties: { view: currentView } });
  }, [currentView, trackEvent]);

  // Theme effect
  useEffect(() => {
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (theme === Theme.Dark) {
      document.documentElement.classList.add("dark");
      metaThemeColor?.setAttribute("content", "#111111");
    } else {
      document.documentElement.classList.remove("dark");
      metaThemeColor?.setAttribute("content", "#f3f4f6");
    }
  }, [theme]);

  const renderView = () => {
    switch (currentView) {
      case View.Calendar:
        return <CalendarView />;
      case View.Settings:
        return <SettingsView />;
      case View.Clock:
      default:
        return <ClockView />;
    }
  };

  return (
    <ErrorBoundary>
      <div className={APP_STYLES.MODOS.appRoot}>
        <Header currentView={currentView} setCurrentView={setCurrentView} />
        <main className={APP_STYLES.MODOS.mainContainer}>
          <Suspense fallback={<LoadingSpinner />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>
        <Toast
          notification={notification}
          onClose={() => setNotification(null)}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
