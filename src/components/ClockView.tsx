import React, { useState, useMemo } from "react";
import { Shift } from "../types";
import { Card, Button, Input, Select } from "./UI";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import { APP_STYLES } from "../theme/styles";
import { useAnalytics } from "../hooks/useAnalytics";
import { useAppStore } from "../store/useAppStore";

// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const monthNamesES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const calculateDuration = (start: string, end: string) => {
  const s = parseInt(start.split(":")[0]) + parseInt(start.split(":")[1]) / 60;
  const e = parseInt(end.split(":")[0]) + parseInt(end.split(":")[1]) / 60;

  // Handle overnight shifts
  if (e < s) {
    return 24 - s + e;
  }
  return e - s;
};

// --- COMPONENT ---

export const ClockView: React.FC = () => {
  // Store
  const shifts = useAppStore((state) => state.shifts);
  const addShift = useAppStore((state) => state.addShift);
  const settings = useAppStore((state) => state.settings);
  const notify = useAppStore((state) => state.notify);

  const { categories, hourTypes } = settings;

  const { trackEvent } = useAnalytics();
  const [date, setDate] = useState(toLocalISOString(new Date()));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [notes, setNotes] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [selectedHourType, setSelectedHourType] = useState("");
  const [error, setError] = useState<string | null>(null);

  // State for Summary Card Navigation (defaults to current real time)
  const [statsDate, setStatsDate] = useState(new Date());

  // Stats Calculation
  const stats = useMemo(() => {
    const currentMonth = statsDate.getMonth();
    const currentYear = statsDate.getFullYear();

    const monthShifts = shifts.filter((s) => {
      const d = new Date(s.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    let totalHours = 0;
    let totalEarnings = 0;
    const categoryCounts: Record<string, number> = {};

    monthShifts.forEach((s) => {
      const duration = calculateDuration(s.startTime, s.endTime);
      totalHours += duration;

      if (s.hourTypeId) {
        const hType = hourTypes.find((h) => h.id === s.hourTypeId);
        const price = hType ? hType.price : 0;
        totalEarnings += duration * price;
      }

      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
    });

    return {
      monthName: monthNamesES[currentMonth],
      year: currentYear,
      totalHours: totalHours.toFixed(2),
      totalEarnings: totalEarnings,
      shiftCount: monthShifts.length,
      categoryBreakdown: categoryCounts,
    };
  }, [shifts, hourTypes, statsDate]);

  // Navigation Handlers
  const handlePrevMonth = () => {
    setStatsDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setStatsDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleSaveShift = () => {
    setError(null);
    if (!date || !startTime || !endTime) {
      setError("Por favor, completa todos los campos.");
      notify("Faltan campos por completar", "error");
      return;
    }

    const newShiftStart = new Date(`${date}T${startTime}`).getTime();
    const hasOverlap = shifts.some((shift) => {
      if (shift.date !== date) return false;
      const existingStart = new Date(
        `${shift.date}T${shift.startTime}`
      ).getTime();
      const existingEnd = new Date(`${shift.date}T${shift.endTime}`).getTime();
      const currentEnd = new Date(`${date}T${endTime}`).getTime();

      if (currentEnd < newShiftStart) {
        return newShiftStart >= existingStart && newShiftStart < existingEnd;
      }
      return newShiftStart < existingEnd && currentEnd > existingStart;
    });

    if (hasOverlap) {
      setError("Solapamiento detectado.");
      notify("El horario se solapa con otro registro", "error");
      return;
    }

    const newShift: Shift = {
      id: crypto.randomUUID(),
      date,
      startTime,
      endTime,
      notes,
      category,
      hourTypeId: selectedHourType || undefined,
    };

    addShift(newShift);

    setNotes("");
    notify("Turno registrado correctamente", "success");
    trackEvent({
      name: "save_shift",
      properties: {
        category,
        type: hourTypes.find((h) => h.id === selectedHourType)?.name,
        duration: calculateDuration(startTime, endTime),
      },
    });
  };

  return (
    <div className={APP_STYLES.REGISTRO.container}>
      {/* Registration Card */}
      <Card className={APP_STYLES.REGISTRO.card}>
        <div className={APP_STYLES.REGISTRO.cardHeader}>
          <h2 className={APP_STYLES.REGISTRO.cardTitle}>
            Registrar{" "}
            <span className={APP_STYLES.REGISTRO.cardTitleAccent}>Turno</span>
          </h2>
        </div>

        {error && (
          <div className={APP_STYLES.REGISTRO.errorAlert} role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className={APP_STYLES.REGISTRO.formGrid}>
          <div className={APP_STYLES.REGISTRO.formColSpan1}>
            <Input
              label="Fecha"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={APP_STYLES.REGISTRO.dateInput}
            />
          </div>
          <div className={APP_STYLES.REGISTRO.formColSpan1}>
            <Select
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Select
              label="Tipo de Hora"
              value={selectedHourType}
              onChange={(e) => setSelectedHourType(e.target.value)}
            >
              <option value="">Sin tipo</option>
              {hourTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.price}€)
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Input
              label="Notas"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional..."
            />
          </div>

          <div>
            <Input
              label="Entrada"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={APP_STYLES.REGISTRO.timeInput}
            />
          </div>
          <div>
            <Input
              label="Salida"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={APP_STYLES.REGISTRO.timeInput}
            />
          </div>
        </div>

        <div className={APP_STYLES.REGISTRO.buttonContainer}>
          <Button
            onClick={handleSaveShift}
            className={APP_STYLES.REGISTRO.saveButton}
          >
            Guardar
          </Button>
        </div>
      </Card>

      {/* Month Summary Card */}
      <Card className={APP_STYLES.REGISTRO.summaryCard}>
        <div className={APP_STYLES.REGISTRO.summaryBorder}></div>

        <div className={APP_STYLES.REGISTRO.summaryHeader}>
          <div>
            <h3 className={APP_STYLES.REGISTRO.summaryTitleSmall}>Resumen</h3>
            {/* Month Selector */}
            <div className={APP_STYLES.REGISTRO.monthSelector}>
              <button
                onClick={handlePrevMonth}
                className={APP_STYLES.REGISTRO.monthNavButton}
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <h2 className={APP_STYLES.REGISTRO.monthTitle}>
                {stats.monthName}{" "}
                <span className={APP_STYLES.REGISTRO.monthYearSmall}>
                  {stats.year}
                </span>
              </h2>
              <button
                onClick={handleNextMonth}
                className={APP_STYLES.REGISTRO.monthNavButton}
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className={APP_STYLES.REGISTRO.statsGrid}>
          {/* Hours Block */}
          <div className={APP_STYLES.REGISTRO.statsBlock}>
            <div className={APP_STYLES.REGISTRO.statsRow}>
              <span className={APP_STYLES.REGISTRO.statsLabel}>Horas</span>
              <span className={APP_STYLES.REGISTRO.statsValueHours}>
                {stats.totalHours}h
              </span>
            </div>
            {stats.totalEarnings > 0 && (
              <div className={APP_STYLES.REGISTRO.statsRowNoMargin}>
                <span className={APP_STYLES.REGISTRO.statsLabel}>Ganancia</span>
                <span className={APP_STYLES.REGISTRO.statsValueEarnings}>
                  {stats.totalEarnings.toFixed(2)}€
                </span>
              </div>
            )}
          </div>

          {/* Shifts Block */}
          <div className={APP_STYLES.REGISTRO.statsBlockFlex}>
            <div className={APP_STYLES.REGISTRO.statsRowNoMargin}>
              <span className={APP_STYLES.REGISTRO.statsLabel}>Turnos</span>
              <span className={APP_STYLES.REGISTRO.statsValueCount}>
                {stats.shiftCount}
              </span>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className={APP_STYLES.REGISTRO.categoryGrid}>
            <div className={APP_STYLES.REGISTRO.categoryWrapper}>
              {Object.keys(stats.categoryBreakdown).length > 0 ? (
                Object.entries(stats.categoryBreakdown)
                  .slice(0, 4)
                  .map(([cat, count]) => (
                    <div
                      key={cat}
                      className={APP_STYLES.REGISTRO.categoryBadge}
                    >
                      <span className={APP_STYLES.REGISTRO.categoryName}>
                        {cat}
                      </span>
                      <span className={APP_STYLES.REGISTRO.categoryCount}>
                        {count}
                      </span>
                    </div>
                  ))
              ) : (
                <span className={APP_STYLES.REGISTRO.categoryEmpty}>
                  Sin datos
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
