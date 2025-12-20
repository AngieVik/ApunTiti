import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClockView } from "../components/ClockView";
import type { Shift, Settings } from "../types";

// Mock de useAnalytics
vi.mock("../hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackEvent: vi.fn(),
  }),
}));

// Mock del store de Zustand
const mockAddShift = vi.fn();
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
    notes: "Test shift 1",
    hourTypeId: "1",
  },
  {
    id: "2",
    date: "2025-12-18",
    startTime: "18:00",
    endTime: "22:00",
    category: "DRP",
    notes: "Test shift 2",
    hourTypeId: "2",
  },
];

vi.mock("../store/useAppStore", () => ({
  useAppStore: (selector: any) => {
    const state = {
      shifts: mockShifts,
      settings: defaultSettings,
      addShift: mockAddShift,
      notify: mockNotify,
    };
    return selector ? selector(state) : state;
  },
}));

describe("ClockView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render registration form with all fields", () => {
      render(<ClockView />);

      expect(screen.getByText(/registrar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/entrada/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/salida/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tipo de hora/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
    });

    it("should render save button", () => {
      render(<ClockView />);

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      expect(saveButton).toBeInTheDocument();
    });

    it("should render all categories from settings", () => {
      render(<ClockView />);

      // Categories appear multiple times (in select dropdown and possibly summary)
      defaultSettings.categories.forEach((category) => {
        const elements = screen.getAllByText(category);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it("should render all hour types from settings", () => {
      render(<ClockView />);

      defaultSettings.hourTypes.forEach((type) => {
        // Los tipos de hora se renderizan como "Normal (10€)"
        expect(
          screen.getByText(new RegExp(type.name, "i"))
        ).toBeInTheDocument();
      });
    });

    it("should render monthly summary section", () => {
      render(<ClockView />);

      expect(screen.getByText(/resumen/i)).toBeInTheDocument();
    });
  });

  describe("Form Interactions", () => {
    it("should allow user to input date", async () => {
      const user = userEvent.setup();
      render(<ClockView />);

      const dateInput = screen.getByLabelText(/fecha/i) as HTMLInputElement;
      await user.clear(dateInput);
      await user.type(dateInput, "2025-12-20");

      expect(dateInput.value).toBe("2025-12-20");
    });

    it("should allow user to select category", async () => {
      const user = userEvent.setup();
      render(<ClockView />);

      const categorySelect = screen.getByLabelText(
        /categoría/i
      ) as HTMLSelectElement;
      await user.selectOptions(categorySelect, "DRP");

      expect(categorySelect.value).toBe("DRP");
    });

    it("should allow user to input notes", async () => {
      const user = userEvent.setup();
      render(<ClockView />);

      const notesInput = screen.getByLabelText(/notas/i) as HTMLInputElement;
      await user.clear(notesInput);
      await user.type(notesInput, "Important notes");

      expect(notesInput.value).toBe("Important notes");
    });
  });

  describe("Monthly Summary", () => {
    it("should display total hours for current month", () => {
      render(<ClockView />);

      // Shift 1: 09:00-17:00 = 8 horas
      // Shift 2: 18:00-22:00 = 4 horas
      // Total: 12 horas
      expect(screen.getByText(/12\.00h/i)).toBeInTheDocument();
    });

    it("should display total earnings for current month", () => {
      render(<ClockView />);

      // Shift 1: 8h * 10€ = 80€
      // Shift 2: 4h * 15€ = 60€
      // Total: 140€
      expect(screen.getByText(/140\.00€/i)).toBeInTheDocument();
    });

    it("should display shift count", () => {
      render(<ClockView />);

      // 2 shifts en diciembre 2025
      const shiftCountElement = screen.getByText("2");
      expect(shiftCountElement).toBeInTheDocument();
    });

    it("should display category breakdown", () => {
      render(<ClockView />);

      // Categories appear in summary breakdown
      const programadoElements = screen.getAllByText("Programado");
      const drpElements = screen.getAllByText("DRP");

      expect(programadoElements.length).toBeGreaterThan(0);
      expect(drpElements.length).toBeGreaterThan(0);
    });
  });

  describe("Month Navigation", () => {
    it("should render month navigation buttons", () => {
      render(<ClockView />);

      const buttons = screen.getAllByRole("button");
      // Debería haber al menos 3 botones: prev month, next month, guardar
      expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it("should display current month name", () => {
      render(<ClockView />);

      // Debería mostrar el mes actual (Diciembre para los datos de prueba)
      expect(screen.getByText(/diciembre/i)).toBeInTheDocument();
    });

    it("should display year", () => {
      render(<ClockView />);

      expect(screen.getByText(/2025/)).toBeInTheDocument();
    });
  });

  describe("Calculations", () => {
    it("should calculate duration correctly for normal shifts", () => {
      // Esta es implícita en el test de total hours
      render(<ClockView />);

      // 8h + 4h = 12h
      expect(screen.getByText(/12\.00h/i)).toBeInTheDocument();
    });

    it("should calculate earnings correctly", () => {
      render(<ClockView />);

      // 80€ + 60€ = 140€
      expect(screen.getByText(/140\.00€/i)).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have labels for all inputs", () => {
      render(<ClockView />);

      expect(screen.getByLabelText(/fecha/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/entrada/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/salida/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoría/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tipo de hora/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/notas/i)).toBeInTheDocument();
    });

    it("should have accessible save button", () => {
      render(<ClockView />);

      const saveButton = screen.getByRole("button", { name: /guardar/i });
      expect(saveButton).not.toBeDisabled();
    });
  });
});
