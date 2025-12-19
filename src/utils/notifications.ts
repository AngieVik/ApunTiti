export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    if (import.meta.env.DEV) {
      console.warn("This browser does not support desktop notification");
    }
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendLocalNotification = (title: string, body?: string) => {
  if (Notification.permission === "granted") {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: "/icons/pwa-192-192.png", // Ensure this path matches public/icons
          vibrate: [200, 100, 200],
        } as any);
      });
    } else {
      new Notification(title, {
        body,
        icon: "/icons/pwa-192-192.png",
      });
    }
  }
};
