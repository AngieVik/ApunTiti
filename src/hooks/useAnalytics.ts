import { useCallback } from "react";

// Define typed events for better DX
type AnalyticsEvent =
  | { name: "view_change"; properties: { view: string } }
  | {
      name: "save_shift";
      properties: { category: string; type?: string; duration: number };
    }
  | { name: "delete_shift"; properties: { id: string } }
  | { name: "export_data"; properties: { format: string; scope: string } }
  | { name: "theme_toggle"; properties: { theme: string } };

export const useAnalytics = () => {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    // In a real app, this would send data to GA4, Mixpanel, etc.
    // For now, we log to console in development or store in a local debug buffer
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${event.name}`, event.properties);
    }
  }, []);

  return { trackEvent };
};
