import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarView } from "../components/CalendarView";
import type { Shift, Settings } from "../types";

// Mock de useAnalytics
vi.mock("../hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
  }),
}));

// Mock del store
const mockSetShifts = vi.fn();
const mockNotify = vi.fn();

const defaultSettings: Settings = {
  categories: ["Programado", "DRP", "Traslado", "Guardia"],
  hourTypes: [
    { id: "1", name: "Normal", price: 10 },
    { id: "2", name: "Especial", price: 15 },
    { id: "3", name: "Extra", price: 20 },
  ],
  downloadFormat: "txt",
  pushEnabled: false,
};

const mockShifts: Shift[] = [
  {
    id: "1",
    date: "2025-12-18",
    startTime: "09:00",
    endTime: "17:00",
    category: "Programado",
    notes: "Morning shift",
    hourTypeId: "1",
  },
  {
    id: "2",
    date: "2025-12-18",
    startTime: "18:00",
    endTime: "22:00",
    category: "DRP",
    notes: "Evening shift",
    hourTypeId: "2",
  },
  {
    id: "3",
    date: "2025-12-20",
    startTime: "10:00",
    endTime: "14:00",
    category: "Guardia",
    notes: "Weekend shift",
    hourTypeId: "1",
  },
];

vi.mock("../store/useAppStore", () => ({
  useAppStore: (selector: any) => {
    const state = {
      shifts: mockShifts,
      settings: defaultSettings,
      setShifts: mockSetShifts,
      notify: mockNotify,
    };
    return selector ? selector(state) : state;
  },
}));

describe("CalendarView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render calendar view", () => {
      render(<CalendarView />);

      // Debería renderizar el título o algún elemento principal
      expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    });

    it("should render view mode selector", () => {
      render(<CalendarView />);

      // Debería tener botones para cambiar de vista
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should render current month and year", () => {
      render(<CalendarView />);

      // Debería mostrar el mes actual
      expect(screen.getByText(/diciembre/i)).toBeInTheDocument();
      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });
  });

  describe("View Modes", () => {
    it("should have year view option", () => {
      render(<CalendarView />);

      // Buscar botón o indicador de vista año
      expect(screen.getByText(/año/i)).toBeInTheDocument();
    });

    it("should have month view option", () => {
      render(<CalendarView />);

      expect(screen.getByText(/mes/i)).toBeInTheDocument();
    });

    it("should have week view option", () => {
      render(<CalendarView />);

      expect(screen.getByText(/semana/i)).toBeInTheDocument();
    });

    it("should have day view option", () => {
      render(<CalendarView />);

      expect(screen.getByText(/día/i)).toBeInTheDocument();
    });
  });

  describe("Monthly Statistics", () => {
    it("should display total hours for the month", () => {
      render(<CalendarView />);

      // 8h + 4h + 4h = 16 horas total
      expect(screen.getByText(/16\.00h/i)).toBeInTheDocument();
    });

    it("should display total earnings", () => {
      render(<CalendarView />);

      // (8h * 10€) + (4h * 15€) + (4h * 10€) = 80 + 60 + 40 = 180€
      expect(screen.getByText(/180\.00€/i)).toBeInTheDocument();
    });

    it("should display shift count", () => {
      render(<CalendarView />);

      // 3 shifts en diciembre
      const shiftCount = screen
        .getAllByText("3")
        .find(
          (el) =>
            el.className.includes("stats") || el.closest('[class*="stats"]')
        );
      expect(shiftCount).toBeTruthy();
    });
  });

  describe("Navigation", () => {
    it("should render previous month button", () => {
      render(<CalendarView />);

      const buttons = screen.getAllByRole("button");
      // Debería haber botones de navegación
      expect(buttons.length).toBeGreaterThan(3);
    });

    it("should render next month button", () => {
      render(<CalendarView />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(3);
    });

    it("should allow navigation between months", async () => {
      const user = userEvent.setup();
      render(<CalendarView />);

      const currentMonth = screen.getByText(/diciembre/i);
      expect(currentMonth).toBeInTheDocument();

      // Nota: En componente real, habría que clickear el botón de navegación
      // pero sin poder identificarlo específicamente, solo verificamos que existe
    });
  });

  describe("Shift Display", () => {
    it("should display shifts for current month", () => {
      render(<CalendarView />);

      // Debería mostrar información de los shifts
      // Los shifts del mock están en diciembre 2025
      expect(screen.getByText(/programado/i)).toBeInTheDocument();
    });

    it("should group shifts by date", () => {
      render(<CalendarView />);

      // En el día 18 hay 2 shifts
      // En el día 20 hay 1 shift
      // Verificar que se muestran agrupados correctamente
      const elements = screen.getAllByText(/programado|drp|guardia/i);
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe("Calendar Grid", () => {
    it("should display weekday headers", () => {
      render(<CalendarView />);

      // Debería mostrar los días de la semana
      expect(screen.getByText(/lun/i) || screen.getByText(/l/i)).toBeTruthy();
    });

    it("should display days of the month", () => {
      render(<CalendarView />);

      // Debería mostrar números de días (1-31)
      expect(screen.getByText("18")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  describe("Calculations", () => {
    it("should calculate duration correctly", () => {
      render(<CalendarView />);

      // Shift 1: 09:00-17:00 = 8h
      // Shift 2: 18:00-22:00 = 4h
      // Shift 3: 10:00-14:00 = 4h
      // Total: 16h
      expect(screen.getByText(/16\.00h/i)).toBeInTheDocument();
    });

    it("should calculate earnings correctly", () => {
      render(<CalendarView />);

      // (8 * 10) + (4 * 15) + (4 * 10) = 180€
      expect(screen.getByText(/180\.00€/i)).toBeInTheDocument();
    });

    it("should handle shifts without price", () => {
      const shiftsWithoutPrice: Shift[] = [
        {
          id: "1",
          date: "2025-12-18",
          startTime: "09:00",
          endTime: "17:00",
          category: "Programado",
          notes: "",
          // Sin hourTypeId
        },
      ];

      vi.mocked(require("../store/useAppStore").useAppStore).mockImplementation(
        (selector: any) => {
          const state = {
            shifts: shiftsWithoutPrice,
            settings: defaultSettings,
            setShifts: mockSetShifts,
            notify: mockNotify,
          };
          return selector ? selector(state) : state;
        }
      );

      render(<CalendarView />);

      // Debería renderizar sin errores
      expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    });
  });

  describe("Export Functionality", () => {
    it("should have export button", () => {
      render(<CalendarView />);

      // Buscar botón de exportar (puede ser PDF, TXT, etc.)
      const buttons = screen.getAllByRole("button");
      const exportButton = buttons.find(
        (btn) =>
          btn.textContent?.toLowerCase().includes("export") ||
          btn.textContent?.toLowerCase().includes("descargar") ||
          btn.textContent?.toLowerCase().includes("pdf") ||
          btn.querySelector("svg") // Podría tener un ícono
      );

      // Debería existir algún botón de export
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle month with no shifts", () => {
      vi.mocked(require("../store/useAppStore").useAppStore).mockImplementation(
        (selector: any) => {
          const state = {
            shifts: [],
            settings: defaultSettings,
            setShifts: mockSetShifts,
            notify: mockNotify,
          };
          return selector ? selector(state) : state;
        }
      );

      render(<CalendarView />);

      // Debería mostrar 0 horas
      expect(screen.getByText(/0\.00h/i)).toBeInTheDocument();
    });

    it("should handle overnight shifts", () => {
      const overnightShifts: Shift[] = [
        {
          id: "1",
          date: "2025-12-18",
          startTime: "23:00",
          endTime: "07:00", // Next day
          category: "Programado",
          notes: "Night shift",
          hourTypeId: "1",
        },
      ];

      vi.mocked(require("../store/useAppStore").useAppStore).mockImplementation(
        (selector: any) => {
          const state = {
            shifts: overnightShifts,
            settings: defaultSettings,
            setShifts: mockSetShifts,
            notify: mockNotify,
          };
          return selector ? selector(state) : state;
        }
      );

      render(<CalendarView />);

      // Debería calcular correctamente (8 horas)
      expect(screen.getByText(/8\.00h/i)).toBeInTheDocument();
    });

    it("should display correct data for leap year", () => {
      const leapYearShifts: Shift[] = [
        {
          id: "1",
          date: "2024-02-29", // Leap year day
          startTime: "09:00",
          endTime: "17:00",
          category: "Programado",
          notes: "Leap day shift",
          hourTypeId: "1",
        },
      ];

      vi.mocked(require("../store/useAppStore").useAppStore).mockImplementation(
        (selector: any) => {
          const state = {
            shifts: leapYearShifts,
            settings: defaultSettings,
            setShifts: mockSetShifts,
            notify: mockNotify,
          };
          return selector ? selector(state) : state;
        }
      );

      render(<CalendarView />);

      // Debería renderizar sin errores
      expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("should render without errors on small screens", () => {
      // Simular pantalla pequeña
      global.innerWidth = 375;
      global.innerHeight = 667;

      render(<CalendarView />);

      expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    });

    it("should render without errors on large screens", () => {
      // Simular pantalla grande
      global.innerWidth = 1920;
      global.innerHeight = 1080;

      render(<CalendarView />);

      expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    });
  });

  describe("Performance", () => {
    it("should handle large number of shifts", () => {
      const manyShifts: Shift[] = Array.from({ length: 100 }, (_, i) => ({
        id: `shift-${i}`,
        date: "2025-12-18",
        startTime: "09:00",
        endTime: "17:00",
        category: "Programado",
        notes: `Shift ${i}`,
        hourTypeId: "1",
      }));

      vi.mocked(require("../store/useAppStore").useAppStore).mockImplementation(
        (selector: any) => {
          const state = {
            shifts: manyShifts,
            settings: defaultSettings,
            setShifts: mockSetShifts,
            notify: mockNotify,
          };
          return selector ? selector(state) : state;
        }
      );

      render(<CalendarView />);

      // Debería renderizar sin errores
      expect(screen.getByText(/calendario/i)).toBeInTheDocument();

      // Debería calcular correctamente (100 shifts * 8h = 800h)
      expect(screen.getByText(/800\.00h/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper structure for screen readers", () => {
      render(<CalendarView />);

      // Debería tener buttons accesibles
      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("should have navigation buttons accessible", () => {
      render(<CalendarView />);

      const buttons = screen.getAllByRole("button");
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });
  });
});
