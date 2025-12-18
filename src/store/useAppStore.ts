import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Shift, Settings, Theme, Notification } from "../types";
import { MockSyncService } from "../services/api";

// Define the State and Actions
interface AppState {
  // Data
  shifts: Shift[];
  settings: Settings;
  theme: Theme;
  notification: Notification | null;
  syncStatus: "idle" | "syncing" | "success" | "error";

  // Actions
  setShifts: (shifts: Shift[] | ((prev: Shift[]) => Shift[])) => void;
  addShift: (shift: Shift) => void;
  updateSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setNotification: (notification: Notification | null) => void;
  notify: (message: string, type?: "success" | "error" | "info") => void;
  sync: () => Promise<void>;
}

// Helper to handle function updates (like setState(prev => ...))
const resolveUpdate = <T>(prev: T, update: T | ((prev: T) => T)): T => {
  return typeof update === "function"
    ? (update as (prev: T) => T)(prev)
    : update;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      shifts: [],
      settings: {
        categories: ["Programado", "DRP", "Traslado", "Guardia"],
        hourTypes: [
          { id: "1", name: "Normal", price: 10 },
          { id: "2", name: "Especial", price: 15 },
          { id: "3", name: "Extra", price: 20 },
        ],
        downloadFormat: "txt",
        pushEnabled: false,
      },
      theme: Theme.Dark,
      notification: null,
      syncStatus: "idle",

      // Actions
      setShifts: (update) =>
        set((state) => ({ shifts: resolveUpdate(state.shifts, update) })),

      addShift: (shift) =>
        set((state) => ({
          shifts: [...state.shifts, shift].sort(
            (a, b) =>
              new Date(`${a.date}T${a.startTime}`).getTime() -
              new Date(`${b.date}T${b.startTime}`).getTime()
          ),
        })),

      updateSettings: (update) =>
        set((state) => ({ settings: resolveUpdate(state.settings, update) })),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === Theme.Light ? Theme.Dark : Theme.Light,
        })),

      setNotification: (notification) => set({ notification }),

      notify: (message, type = "success") =>
        set({ notification: { message, type } }),

      sync: async () => {
        set({ syncStatus: "syncing" });
        const state = get();
        try {
          const backup = {
            version: 1,
            date: new Date().toISOString(),
            shifts: state.shifts,
            settings: state.settings,
          };
          const result = await MockSyncService.sync(backup);

          if (result.success) {
            set({ syncStatus: "success" });
            state.notify(result.message, "success");
          } else {
            set({ syncStatus: "error" });
            state.notify(result.message, "error");
          }
        } catch (error) {
          set({ syncStatus: "error" });
          state.notify("Error de conexión", "error");
        } finally {
          setTimeout(() => set({ syncStatus: "idle" }), 3000);
        }
      },
    }),
    {
      name: "apuntiti-storage", // unique name
      storage: createJSONStorage(() => localStorage),
      // We can persist everything, or whitelist. Let's persist everything except notification and syncStatus.
      partialize: (state) => ({
        shifts: state.shifts,
        settings: state.settings,
        theme: state.theme,
      }),
    }
  )
);
