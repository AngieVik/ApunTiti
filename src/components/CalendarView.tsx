import React, { useState, useMemo, useCallback } from "react";
import { generatePDF } from "../utils/pdfGenerator";
import { useAnalytics } from "../hooks/useAnalytics";
import { Shift } from "../types";
import { Card, Button, Input, Select, ConfirmDialog } from "./UI";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";
import { toLocalISOString, calculateDuration } from "../utils/time";
import { MONTH_NAMES_ES } from "../constants/app";
import { useAppStore } from "../store/useAppStore";
import {
  CalendarYearView,
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarRangeView,
} from "./calendar";

// --- HELPER FUNCTIONS ---

/**
 * Gets the number of days in a specific month
 * @param year - The year
 * @param month - The month (0-indexed, 0 = January)
 * @returns Number of days in the month
 */
const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

/**
 * Gets the day of week for the first day of a month
 * @param year - The year
 * @param month - The month (0-indexed, 0 = January)
 * @returns Day of week (0 = Sunday, 6 = Saturday)
 */
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

// --- COMPONENT ---

type CalendarViewType = "year" | "month" | "week" | "day";

export const CalendarView: React.FC = () => {
  // Store
  const shifts = useAppStore((state) => state.shifts);
  const setShifts = useAppStore((state) => state.setShifts);
  const settings = useAppStore((state) => state.settings);
  const notify = useAppStore((state) => state.notify);

  const { hourTypes } = settings;

  const { trackEvent } = useAnalytics();
  const [viewType, setViewType] = useState<CalendarViewType>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const shiftsByDate = useMemo(() => {
    return shifts.reduce((acc, shift) => {
      (acc[shift.date] = acc[shift.date] || []).push(shift);
      return acc;
    }, {} as Record<string, Shift[]>);
  }, [shifts]);

  // --- RANGE VIEW CALCULATIONS (moved out of renderRangeView to fix hooks error) ---
  const rangeDays = useMemo(() => {
    if (!rangeStart || !rangeEnd) return [];

    const start = new Date(rangeStart).getTime();
    const end = new Date(rangeEnd).getTime();
    const dayMilliseconds = 24 * 60 * 60 * 1000;
    const diffDays = Math.ceil(Math.abs((end - start) / dayMilliseconds)) + 1;

    const d_arr = [];
    for (let i = 0; i < diffDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      d_arr.push(d);
    }
    return d_arr;
  }, [rangeStart, rangeEnd]);

  const rangeTotals = useMemo(() => {
    let totalRangeHours = 0;
    let totalRangeMoney = 0;

    rangeDays.forEach((d) => {
      const dateStr = toLocalISOString(d);
      const dayShifts = shiftsByDate[dateStr] || [];
      dayShifts.forEach((s) => {
        const duration = calculateDuration(s.startTime, s.endTime);
        totalRangeHours += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          totalRangeMoney += duration * price;
        }
      });
    });

    return { totalRangeHours, totalRangeMoney };
  }, [rangeDays, shiftsByDate, hourTypes]);

  const handleViewChange = useCallback((type: CalendarViewType) => {
    setViewType(type);
    setRangeStart("");
    setRangeEnd("");
  }, []);

  const handlePrev = useCallback(() => {
    const newDate = new Date(currentDate);
    if (viewType === "year") newDate.setFullYear(year - 1);
    if (viewType === "month") newDate.setMonth(month - 1);
    if (viewType === "week") newDate.setDate(newDate.getDate() - 7);
    if (viewType === "day") newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  }, [currentDate, viewType]);

  const handleNext = useCallback(() => {
    const newDate = new Date(currentDate);
    if (viewType === "year") newDate.setFullYear(year + 1);
    if (viewType === "month") newDate.setMonth(month + 1);
    if (viewType === "week") newDate.setDate(newDate.getDate() + 7);
    if (viewType === "day") newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  }, [currentDate, viewType]);

  const handleDayClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setCurrentDate(date);
      setRangeStart("");
      setRangeEnd("");
      if (viewType !== "day") setViewType("day");
    },
    [viewType]
  );

  const handleRangeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeStart(e.target.value);
    if (e.target.value) setSelectedDate(null);
  };

  const handleRangeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeEnd(e.target.value);
    if (e.target.value) setSelectedDate(null);
  };

  const confirmDelete = useCallback((id: string) => {
    setShiftToDelete(id);
    setIsConfirmOpen(true);
  }, []);

  const handleDelete = () => {
    if (shiftToDelete) {
      setShifts((prev) => prev.filter((s) => s.id !== shiftToDelete));
      setShiftToDelete(null);
      setIsConfirmOpen(false);
      notify("Registro eliminado", "info");
    }
  };

  const openEditModal = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setIsEditOpen(true);
  }, []);

  const handleUpdateShift = useCallback(
    (updatedShift: Shift) => {
      setShifts((prev) =>
        prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
      );
      setIsEditOpen(false);
      setEditingShift(null);
      notify("Registro actualizado", "success");
    },
    [setShifts, notify]
  );

  // --- HELPER FUNCTIONS ---

  const getFilteredShiftsAndTitle = () => {
    let filteredShifts = shifts;
    let title = "Todos los registros";

    if (rangeStart && rangeEnd) {
      filteredShifts = shifts.filter(
        (s) => s.date >= rangeStart && s.date <= rangeEnd
      );
      title = `Registro Rango ${rangeStart} a ${rangeEnd}`;
    } else if (viewType === "year") {
      filteredShifts = shifts.filter(
        (s) => new Date(s.date).getFullYear() === year
      );
      title = `Registro Anual ${year}`;
    } else if (viewType === "month") {
      filteredShifts = shifts.filter((s) => {
        const d = new Date(s.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });
      title = `Registro Mensual ${MONTH_NAMES_ES[month]} ${year}`;
    } else if (viewType === "day") {
      filteredShifts = shifts.filter(
        (s) => s.date === toLocalISOString(currentDate)
      );
      title = `Registro Diario ${toLocalISOString(currentDate)}`;
    }
    return { filteredShifts, title };
  };

  const handleSave = () => {
    const { filteredShifts, title } = getFilteredShiftsAndTitle();

    if (settings.downloadFormat === "pdf") {
      generatePDF(filteredShifts, title, hourTypes);
      notify("PDF descargado", "success");
      trackEvent({
        name: "export_data",
        properties: { format: "pdf", scope: title },
      });
    } else {
      handleDownloadTxt(filteredShifts, title);
      trackEvent({
        name: "export_data",
        properties: { format: "txt", scope: title },
      });
    }
  };

  const handleDownloadTxt = (filteredShifts: Shift[], title: string) => {
    // ... existing text generation logic ...
    const header = `${title}\nGenerado: ${new Date().toLocaleString()}\n\nFecha       | Hora E. | Hora S. | Cat.        | Tipo      | Valor   | Notas\n------------------------------------------------------------------------------\n`;
    const body = filteredShifts
      .map((s) => {
        let typeName = "Sin tipo";
        let price = 0;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          typeName = hType ? hType.name : "N/A";
          price = hType ? hType.price : 0;
        }

        const duration = calculateDuration(s.startTime, s.endTime);
        const total = (duration * price).toFixed(2);
        const valStr = s.hourTypeId ? `${total}€` : "N/A";
        return `${s.date}  | ${s.startTime}   | ${
          s.endTime
        }   | ${s.category.padEnd(11)} | ${typeName.padEnd(
          9
        )} | ${valStr.padEnd(6)} | ${s.notes}`;
      })
      .join("\n");

    const element = document.createElement("a");
    const file = new Blob([header + body], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    notify("TXT descargado", "success");
  };

  return (
    <div id="calendar-container" className={APP_STYLES.CALENDARIO.container}>
      {/* BARRA DE CONTROLES UNIFICADA Y RESPONSIVE EN 1 SOLA FILA */}
      <Card className={APP_STYLES.CALENDARIO.controlsCard}>
        {/* overflow-x-auto permite scroll en móviles muy pequeños, pero en general todo cabe en una fila */}
        <div className={APP_STYLES.CALENDARIO.controlsInner}>
          {/* GRUPO 1: Botones de Vista - Flex-none para que no se aplasten */}
          <div className={APP_STYLES.CALENDARIO.viewButtonsGroup}>
            {["year", "month", "week", "day"].map((type) => (
              <button
                key={type}
                onClick={() => handleViewChange(type as CalendarViewType)}
                className={`${APP_STYLES.CALENDARIO.viewButton} ${
                  viewType === type
                    ? APP_STYLES.CALENDARIO.viewButtonActive
                    : APP_STYLES.CALENDARIO.viewButtonInactive
                }`}
              >
                {type === "year" && "Año"}
                {type === "month" && "Mes"}
                {type === "week" && "Sem"}
                {type === "day" && "Día"}
              </button>
            ))}
          </div>

          {/* GRUPO 2: Selectores de Fecha - Estilo exacto a UI.tsx pero inline */}
          <div className={APP_STYLES.CALENDARIO.dateSelectorsGroup}>
            <input
              type="date"
              value={rangeStart}
              onChange={handleRangeStartChange}
              className={APP_STYLES.CALENDARIO.dateInput}
            />
            <input
              type="date"
              value={rangeEnd}
              onChange={handleRangeEndChange}
              className={APP_STYLES.CALENDARIO.dateInput}
            />
          </div>
        </div>
      </Card>

      <div className={APP_STYLES.CALENDARIO.printHeader}>
        <h1 className={APP_STYLES.CALENDARIO.printTitle}>Reporte de Turnos</h1>
        <p className={APP_STYLES.CALENDARIO.printSubtitle}>
          Generado el {new Date().toLocaleDateString()}
        </p>
      </div>

      <Card id="printable-area" className={APP_STYLES.CALENDARIO.printableCard}>
        {!rangeStart || !rangeEnd ? (
          <div className={APP_STYLES.CALENDARIO.navigationHeader}>
            <Button
              onClick={handlePrev}
              variant="secondary"
              className={APP_STYLES.CALENDARIO.navButton}
            >
              <ChevronLeftIcon className={APP_STYLES.MODOS.iconContent} />
            </Button>
            <h2 className={APP_STYLES.CALENDARIO.navTitle}>
              {viewType === "year" && year}
              {viewType === "month" && `${MONTH_NAMES_ES[month]} ${year}`}
              {viewType === "week" &&
                `Semana ${currentDate.getDate()} - ${MONTH_NAMES_ES[month]}`}
              {viewType === "day" && currentDate.toLocaleDateString()}
            </h2>
            <Button
              onClick={handleNext}
              variant="secondary"
              className={APP_STYLES.CALENDARIO.navButton}
            >
              <ChevronRightIcon className={APP_STYLES.MODOS.iconContent} />
            </Button>
          </div>
        ) : null}

        {rangeStart && rangeEnd ? (
          <CalendarRangeView
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            rangeDays={rangeDays}
            shiftsByDate={shiftsByDate}
            totalRangeHours={rangeTotals.totalRangeHours}
            totalRangeMoney={rangeTotals.totalRangeMoney}
            onDayClick={handleDayClick}
          />
        ) : (
          <>
            {viewType === "year" && (
              <CalendarYearView
                year={year}
                currentMonth={month}
                shifts={shifts}
                hourTypes={hourTypes}
                onMonthClick={(monthIndex: number) => {
                  setCurrentDate(new Date(year, monthIndex, 1));
                  handleViewChange("month");
                }}
              />
            )}
            {viewType === "month" && (
              <CalendarMonthView
                year={year}
                month={month}
                selectedDate={selectedDate}
                shiftsByDate={shiftsByDate}
                hourTypes={hourTypes}
                onDayClick={handleDayClick}
                getDaysInMonth={getDaysInMonth}
                getFirstDayOfMonth={getFirstDayOfMonth}
              />
            )}
            {viewType === "week" && (
              <CalendarWeekView
                currentDate={currentDate}
                shiftsByDate={shiftsByDate}
                hourTypes={hourTypes}
                onDayClick={handleDayClick}
              />
            )}
            {viewType === "day" && (
              <CalendarDayView
                currentDate={currentDate}
                shiftsByDate={shiftsByDate}
                hourTypes={hourTypes}
                onEdit={openEditModal}
                onDelete={confirmDelete}
              />
            )}
          </>
        )}
      </Card>

      <div className={APP_STYLES.CALENDARIO.downloadContainer}>
        <Button
          onClick={handleSave}
          className={APP_STYLES.CALENDARIO.downloadButton}
        >
          Descargar
        </Button>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="¿Borrar Registro?"
        message="Esta acción eliminará permanentemente el registro seleccionado. ¿Deseas continuar?"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {isEditOpen && editingShift && (
        <div className={APP_STYLES.CALENDARIO.editModal}>
          <div className={APP_STYLES.CALENDARIO.editModalContent}>
            <div className={APP_STYLES.CALENDARIO.editModalHeader}>
              <h3 className={APP_STYLES.CALENDARIO.editModalTitle}>
                Editar Registro
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <XMarkIcon className={APP_STYLES.MODOS.iconContent} />
              </button>
            </div>

            <div className={APP_STYLES.CALENDARIO.editModalGrid}>
              <Input
                label="Fecha"
                type="date"
                value={editingShift.date}
                onChange={(e) =>
                  setEditingShift({ ...editingShift, date: e.target.value })
                }
              />
              <Select
                label="Categoría"
                value={editingShift.category}
                onChange={(e) =>
                  setEditingShift({ ...editingShift, category: e.target.value })
                }
              >
                <option value={editingShift.category}>
                  {editingShift.category}
                </option>
              </Select>

              <Input
                label="Hora Entrada"
                type="time"
                value={editingShift.startTime}
                onChange={(e) =>
                  setEditingShift({
                    ...editingShift,
                    startTime: e.target.value,
                  })
                }
              />
              <Input
                label="Hora Salida"
                type="time"
                value={editingShift.endTime}
                onChange={(e) =>
                  setEditingShift({ ...editingShift, endTime: e.target.value })
                }
              />

              <div className={APP_STYLES.CALENDARIO.editModalColSpan}>
                <Select
                  label="Tipo de Hora"
                  value={editingShift.hourTypeId || ""}
                  onChange={(e) =>
                    setEditingShift({
                      ...editingShift,
                      hourTypeId: e.target.value || undefined,
                    })
                  }
                >
                  <option value="">Sin tipo</option>
                  {hourTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.price}€)
                    </option>
                  ))}
                </Select>
              </div>
              <div className={APP_STYLES.CALENDARIO.editModalColSpan}>
                <Input
                  label="Notas"
                  type="text"
                  value={editingShift.notes}
                  onChange={(e) =>
                    setEditingShift({ ...editingShift, notes: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={APP_STYLES.CALENDARIO.editModalActions}>
              <Button variant="secondary" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={() => handleUpdateShift(editingShift)}
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
                @media print {
                    body {
                        background: white;
                        color: black;
                    }
                    header, footer, button, .print\\:hidden, #root > div > div > header {
                        display: none !important;
                    }
                    main {
                        padding: 0;
                        margin: 0;
                    }
                    #calendar-container {
                        margin-top: 20px;
                    }
                    .bg-white, .dark\\:bg-\\[\\#111\\], .bg-gray-50, .dark\\:bg-\\[\\#1a1a1a\\] {
                        background-color: white !important;
                        color: black !important;
                        border-color: #ddd !important;
                    }
                    .overflow-hidden {
                        overflow: visible !important;
                    }
                    * {
                        font-family: sans-serif;
                        font-size: 10pt !important;
                    }
                    h2, h3, h1 {
                        color: black !important;
                    }
                }
            `}</style>
    </div>
  );
};
