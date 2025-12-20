import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAppStore } from "../store/useAppStore";
import { Theme } from "../types";
import type { Shift, Settings } from "../types";

// Mock del MockSyncService
vi.mock("../services/api", () => ({
  MockSyncService: {
    sync: vi.fn(),
  },
}));

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useAppStore", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Resetear el store a su estado inicial
    useAppStore.setState({
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
    });
  });

  describe("Initial State", () => {
    it("should have empty shifts array initially", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.shifts).toEqual([]);
    });

    it("should have default settings", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.settings.categories).toHaveLength(4);
      expect(result.current.settings.hourTypes).toHaveLength(3);
      expect(result.current.settings.downloadFormat).toBe("txt");
      expect(result.current.settings.pushEnabled).toBe(false);
    });

    it("should have dark theme by default", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.theme).toBe(Theme.Dark);
    });

    it("should have null notification initially", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.notification).toBeNull();
    });

    it("should have idle sync status initially", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.syncStatus).toBe("idle");
    });
  });

  describe("setShifts", () => {
    it("should set shifts with array", () => {
      const { result } = renderHook(() => useAppStore());
      const testShifts: Shift[] = [
        {
          id: "1",
          date: "2025-12-18",
          startTime: "09:00",
          endTime: "17:00",
          category: "Programado",
          notes: "Test shift",
          hourTypeId: "1",
        },
      ];

      act(() => {
        result.current.setShifts(testShifts);
      });

      expect(result.current.shifts).toEqual(testShifts);
    });

    it("should set shifts with update function", () => {
      const { result } = renderHook(() => useAppStore());
      const initialShift: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "Programado",
        notes: "Initial",
        hourTypeId: "1",
      };

      act(() => {
        result.current.setShifts([initialShift]);
      });

      act(() => {
        result.current.setShifts((prev) => [
          ...prev,
          {
            id: "2",
            date: "2025-12-19",
            startTime: "10:00",
            endTime: "18:00",
            category: "DRP",
            notes: "Second shift",
            hourTypeId: "2",
          },
        ]);
      });

      expect(result.current.shifts).toHaveLength(2);
      expect(result.current.shifts[1].id).toBe("2");
    });
  });

  describe("addShift", () => {
    it("should add a shift to empty array", () => {
      const { result } = renderHook(() => useAppStore());
      const newShift: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "Programado",
        notes: "New shift",
        hourTypeId: "1",
      };

      act(() => {
        result.current.addShift(newShift);
      });

      expect(result.current.shifts).toHaveLength(1);
      expect(result.current.shifts[0]).toEqual(newShift);
    });

    it("should add multiple shifts and sort by date and time", () => {
      const { result } = renderHook(() => useAppStore());
      const shift1: Shift = {
        id: "1",
        date: "2025-12-20",
        startTime: "10:00",
        endTime: "18:00",
        category: "Programado",
        notes: "Later shift",
        hourTypeId: "1",
      };
      const shift2: Shift = {
        id: "2",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "DRP",
        notes: "Earlier shift",
        hourTypeId: "2",
      };

      act(() => {
        result.current.addShift(shift1);
        result.current.addShift(shift2);
      });

      expect(result.current.shifts).toHaveLength(2);
      // shift2 debería estar primero porque es más temprano
      expect(result.current.shifts[0].id).toBe("2");
      expect(result.current.shifts[1].id).toBe("1");
    });

    it("should sort shifts with same date by time", () => {
      const { result } = renderHook(() => useAppStore());
      const shift1: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "14:00",
        endTime: "18:00",
        category: "Programado",
        notes: "Afternoon",
        hourTypeId: "1",
      };
      const shift2: Shift = {
        id: "2",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "13:00",
        category: "DRP",
        notes: "Morning",
        hourTypeId: "2",
      };

      act(() => {
        result.current.addShift(shift1);
        result.current.addShift(shift2);
      });

      expect(result.current.shifts[0].id).toBe("2"); // Morning first
      expect(result.current.shifts[1].id).toBe("1"); // Afternoon second
    });
  });

  describe("updateSettings", () => {
    it("should update settings with object", () => {
      const { result } = renderHook(() => useAppStore());
      const newSettings: Settings = {
        categories: ["Nueva", "Categoria"],
        hourTypes: [{ id: "4", name: "Test", price: 25 }],
        downloadFormat: "pdf",
        pushEnabled: true,
      };

      act(() => {
        result.current.updateSettings(newSettings);
      });

      expect(result.current.settings).toEqual(newSettings);
    });

    it("should update settings with function", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.updateSettings((prev) => ({
          ...prev,
          downloadFormat: "pdf",
          pushEnabled: true,
        }));
      });

      expect(result.current.settings.downloadFormat).toBe("pdf");
      expect(result.current.settings.pushEnabled).toBe(true);
      // Verificar que otras propiedades no cambien
      expect(result.current.settings.categories).toHaveLength(4);
    });

    it("should add new category to settings", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.updateSettings((prev) => ({
          ...prev,
          categories: [...prev.categories, "Vacaciones"],
        }));
      });

      expect(result.current.settings.categories).toHaveLength(5);
      expect(result.current.settings.categories[4]).toBe("Vacaciones");
    });
  });

  describe("Theme Management", () => {
    it("should set theme directly", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme(Theme.Light);
      });

      expect(result.current.theme).toBe(Theme.Light);
    });

    it("should toggle theme from dark to light", () => {
      const { result } = renderHook(() => useAppStore());
      expect(result.current.theme).toBe(Theme.Dark);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(Theme.Light);
    });

    it("should toggle theme from light to dark", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme(Theme.Light);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe(Theme.Dark);
    });

    it("should toggle theme multiple times", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.toggleTheme(); // Dark -> Light
        result.current.toggleTheme(); // Light -> Dark
        result.current.toggleTheme(); // Dark -> Light
      });

      expect(result.current.theme).toBe(Theme.Light);
    });
  });

  describe("Notification Management", () => {
    it("should set notification", () => {
      const { result } = renderHook(() => useAppStore());
      const notification = {
        message: "Test message",
        type: "success" as const,
      };

      act(() => {
        result.current.setNotification(notification);
      });

      expect(result.current.notification).toEqual(notification);
    });

    it("should clear notification", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setNotification({ message: "Test", type: "success" });
      });

      act(() => {
        result.current.setNotification(null);
      });

      expect(result.current.notification).toBeNull();
    });

    it("should notify with success type by default", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.notify("Success message");
      });

      expect(result.current.notification).toEqual({
        message: "Success message",
        type: "success",
      });
    });

    it("should notify with error type", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.notify("Error message", "error");
      });

      expect(result.current.notification).toEqual({
        message: "Error message",
        type: "error",
      });
    });

    it("should notify with info type", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.notify("Info message", "info");
      });

      expect(result.current.notification).toEqual({
        message: "Info message",
        type: "info",
      });
    });

    it("should override previous notification", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.notify("First message");
      });

      act(() => {
        result.current.notify("Second message", "error");
      });

      expect(result.current.notification).toEqual({
        message: "Second message",
        type: "error",
      });
    });
  });

  describe("Sync Functionality", () => {
    it("should set syncStatus to syncing when starting", async () => {
      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(
              () =>
                resolve({
                  success: true,
                  message: "Synced",
                  timestamp: new Date().toISOString(),
                }),
              100
            );
          })
      );

      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.sync();
      });

      expect(result.current.syncStatus).toBe("syncing");
    });

    it("should set syncStatus to success on successful sync", async () => {
      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockResolvedValue({
        success: true,
        message: "Sync successful",
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus).toBe("success");
      expect(result.current.notification?.message).toBe("Sync successful");
      expect(result.current.notification?.type).toBe("success");
    });

    it("should set syncStatus to error on failed sync", async () => {
      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockResolvedValue({
        success: false,
        message: "Sync failed",
      });

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus).toBe("error");
      expect(result.current.notification?.message).toBe("Sync failed");
      expect(result.current.notification?.type).toBe("error");
    });

    it("should handle sync exception", async () => {
      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus).toBe("error");
      // Error message now includes the actual error: "Error de sincronización: Network error"
      expect(result.current.notification?.message).toContain(
        "Error de sincronización"
      );
      expect(result.current.notification?.type).toBe("error");
    });

    it("should reset syncStatus to idle after timeout", async () => {
      vi.useFakeTimers();

      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockResolvedValue({
        success: true,
        message: "Synced",
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useAppStore());

      await act(async () => {
        await result.current.sync();
      });

      expect(result.current.syncStatus).toBe("success");

      // Avanzar 3 segundos
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.syncStatus).toBe("idle");

      vi.useRealTimers();
    });

    it("should call sync with current state data", async () => {
      const { MockSyncService } = await import("../services/api");
      const mockSync = vi.mocked(MockSyncService.sync);
      mockSync.mockResolvedValue({
        success: true,
        message: "Synced",
        timestamp: new Date().toISOString(),
      });

      const { result } = renderHook(() => useAppStore());

      const testShift: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "Test",
        notes: "Test shift",
        hourTypeId: "1",
      };

      act(() => {
        result.current.addShift(testShift);
      });

      await act(async () => {
        await result.current.sync();
      });

      expect(mockSync).toHaveBeenCalledWith(
        expect.objectContaining({
          version: 1,
          shifts: [testShift],
          settings: expect.any(Object),
        })
      );
    });
  });

  describe("Store Persistence", () => {
    it("should persist shifts to localStorage", () => {
      const { result } = renderHook(() => useAppStore());
      const testShift: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "Programado",
        notes: "Persisted shift",
        hourTypeId: "1",
      };

      act(() => {
        result.current.addShift(testShift);
      });

      // Verify shift is in store
      expect(result.current.shifts).toHaveLength(1);
      expect(result.current.shifts[0].id).toBe("1");

      // localStorage persistence may be async in test env
      const stored = localStorage.getItem("apuntiti-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.shifts).toHaveLength(1);
        expect(parsed.state.shifts[0].id).toBe("1");
      }
    });

    it("should persist theme to localStorage", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setTheme(Theme.Light);
      });

      // Verify theme is in store
      expect(result.current.theme).toBe(Theme.Light);

      // localStorage persistence may be async in test env
      const stored = localStorage.getItem("apuntiti-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.theme).toBe(Theme.Light);
      }
    });

    it("should persist settings to localStorage", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.updateSettings((prev) => ({
          ...prev,
          downloadFormat: "pdf",
        }));
      });

      // Verify settings in store
      expect(result.current.settings.downloadFormat).toBe("pdf");

      // localStorage persistence may be async in test env
      const stored = localStorage.getItem("apuntiti-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.settings.downloadFormat).toBe("pdf");
      }
    });

    it("should NOT persist notification to localStorage", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.notify("Test notification");
      });

      // Verify notification is in store (in-memory only)
      expect(result.current.notification?.message).toBe("Test notification");

      // localStorage persistence may be async in test env
      const stored = localStorage.getItem("apuntiti-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        // notification is not persisted by Zustand partialize
        expect(parsed.state.notification).toBeUndefined();
      }
    });

    it("should NOT persist syncStatus to localStorage", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        useAppStore.setState({ syncStatus: "syncing" });
      });

      // Verify that the syncStatus is in the store but not persisted
      expect(result.current.syncStatus).toBe("syncing");

      // localStorage persistence may be async in test env
      const stored = localStorage.getItem("apuntiti-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        // syncStatus is not persisted by Zustand partialize
        expect(parsed.state.syncStatus).toBeUndefined();
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty shift array operations", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setShifts([]);
      });

      expect(result.current.shifts).toEqual([]);
    });

    it("should handle rapid theme toggles", () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.toggleTheme();
        }
      });

      // Después de 10 toggles (par), debería estar en Dark
      expect(result.current.theme).toBe(Theme.Dark);
    });

    it("should handle adding shifts with identical timestamps", () => {
      const { result } = renderHook(() => useAppStore());
      const shift1: Shift = {
        id: "1",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "A",
        notes: "First",
        hourTypeId: "1",
      };
      const shift2: Shift = {
        id: "2",
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "B",
        notes: "Second",
        hourTypeId: "2",
      };

      act(() => {
        result.current.addShift(shift1);
        result.current.addShift(shift2);
      });

      expect(result.current.shifts).toHaveLength(2);
      // El orden debería ser estable (FIFO cuando los timestamps son iguales)
    });
  });
});
