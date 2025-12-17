import React, { useState, useMemo } from "react";
import { Shift, Settings, HourType, NotificationType } from "../types";
import { Card, Button, Input, Select, ConfirmDialog } from "./UI";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "./Icons";
import { APP_STYLES } from "../theme/styles";

// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
  new Date(year, month, 1).getDay();

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
const dayNamesES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const calculateDuration = (start: string, end: string) => {
  const s = parseInt(start.split(":")[0]) + parseInt(start.split(":")[1]) / 60;
  const e = parseInt(end.split(":")[0]) + parseInt(end.split(":")[1]) / 60;

  if (e < s) {
    return 24 - s + e;
  }
  return e - s;
};

// --- COMPONENT ---

type CalendarViewType = "year" | "month" | "week" | "day";

interface CalendarViewProps {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  hourTypes: HourType[];
  settings: Settings;
  notify: (msg: string, type: NotificationType) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  shifts,
  setShifts,
  hourTypes,
  settings,
  notify,
}) => {
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

  const handleViewChange = (type: CalendarViewType) => {
    setViewType(type);
    setRangeStart("");
    setRangeEnd("");
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewType === "year") newDate.setFullYear(year - 1);
    if (viewType === "month") newDate.setMonth(month - 1);
    if (viewType === "week") newDate.setDate(newDate.getDate() - 7);
    if (viewType === "day") newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewType === "year") newDate.setFullYear(year + 1);
    if (viewType === "month") newDate.setMonth(month + 1);
    if (viewType === "week") newDate.setDate(newDate.getDate() + 7);
    if (viewType === "day") newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setRangeStart("");
    setRangeEnd("");
    if (viewType !== "day") setViewType("day");
  };

  const handleRangeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeStart(e.target.value);
    if (e.target.value) setSelectedDate(null);
  };

  const handleRangeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRangeEnd(e.target.value);
    if (e.target.value) setSelectedDate(null);
  };

  const confirmDelete = (id: string) => {
    setShiftToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = () => {
    if (shiftToDelete) {
      setShifts((prev) => prev.filter((s) => s.id !== shiftToDelete));
      setShiftToDelete(null);
      setIsConfirmOpen(false);
      notify("Registro eliminado", "info");
    }
  };

  const openEditModal = (shift: Shift) => {
    setEditingShift(shift);
    setIsEditOpen(true);
  };

  const handleUpdateShift = (updatedShift: Shift) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
    );
    setIsEditOpen(false);
    setEditingShift(null);
    notify("Registro actualizado", "success");
  };

  // --- RENDERERS ---
  const renderYearView = () => {
    const statsByMonth = Array(12)
      .fill(0)
      .map(() => ({ hours: 0, money: 0 }));
    shifts.forEach((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() === year) {
        const duration = calculateDuration(s.startTime, s.endTime);
        statsByMonth[d.getMonth()].hours += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          statsByMonth[d.getMonth()].money += duration * price;
        }
      }
    });

    return (
      <div className={APP_STYLES.CALENDARIO.yearGrid}>
        {monthNamesES.map((mName, idx) => (
          <div
            key={idx}
            onClick={() => {
              setCurrentDate(new Date(year, idx, 1));
              handleViewChange("month");
            }}
            className={`${APP_STYLES.CALENDARIO.yearMonthCard} ${
              idx === month
                ? APP_STYLES.CALENDARIO.yearMonthCardActive
                : APP_STYLES.CALENDARIO.yearMonthCardInactive
            }`}
          >
            <h3 className={APP_STYLES.CALENDARIO.yearMonthTitle}>{mName}</h3>
            <div className={APP_STYLES.CALENDARIO.yearMonthStats}>
              <p className={APP_STYLES.CALENDARIO.yearMonthHours}>
                {statsByMonth[idx].hours.toFixed(0)}h
              </p>
              {statsByMonth[idx].money > 0 && (
                <p className={APP_STYLES.CALENDARIO.yearMonthMoney}>
                  {statsByMonth[idx].money.toFixed(0)}€
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const grid = [];
    for (let i = 0; i < startDay; i++) {
      grid.push(
        <div
          key={`empty-${i}`}
          className={APP_STYLES.CALENDARIO.emptyCell}
        ></div>
      );
    }

    let monthlyHours = 0;
    let monthlyMoney = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = toLocalISOString(dateObj);

      const dayShifts = shiftsByDate[dateStr] || [];
      const isToday = toLocalISOString(new Date()) === dateStr;
      const isSelected =
        selectedDate && toLocalISOString(selectedDate) === dateStr;

      let hoursToday = 0;
      let moneyToday = 0;

      dayShifts.forEach((s) => {
        const duration = calculateDuration(s.startTime, s.endTime);
        hoursToday += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          moneyToday += duration * price;
        }
      });
      monthlyHours += hoursToday;
      monthlyMoney += moneyToday;

      grid.push(
        <div
          key={day}
          onClick={() => handleDayClick(new Date(year, month, day))}
          className={`${APP_STYLES.CALENDARIO.dayCell} ${
            isSelected ? APP_STYLES.CALENDARIO.dayCellSelected : ""
          }`}
        >
          <div className={APP_STYLES.CALENDARIO.dayCellHeader}>
            <div
              className={`${APP_STYLES.CALENDARIO.dayNumber} ${
                isToday
                  ? APP_STYLES.CALENDARIO.dayNumberToday
                  : APP_STYLES.CALENDARIO.dayNumberDefault
              }`}
            >
              {day}
            </div>
            {moneyToday > 0 && (
              <span className={APP_STYLES.CALENDARIO.dayEarnings}>
                {moneyToday.toFixed(0)}€
              </span>
            )}
          </div>

          {dayShifts.length > 0 && (
            <div className={APP_STYLES.CALENDARIO.dayShiftsContainer}>
              <div className={APP_STYLES.CALENDARIO.dayHoursBadge}>
                {hoursToday.toFixed(1)}h
              </div>
              {dayShifts.map((_, i) => (
                <div
                  key={i}
                  className={APP_STYLES.CALENDARIO.dayShiftIndicator}
                ></div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className={APP_STYLES.CALENDARIO.weekdayHeader}>
          {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
            <div key={d} className={APP_STYLES.CALENDARIO.weekdayLabel}>
              {d}
            </div>
          ))}
        </div>
        <div className={APP_STYLES.CALENDARIO.monthGrid}>{grid}</div>

        {monthlyHours > 0 && (
          <div className={APP_STYLES.CALENDARIO.monthTotal}>
            <span className={APP_STYLES.CALENDARIO.monthTotalLabel}>
              TOTAL {monthNamesES[month]}
            </span>
            <div>
              <span className={APP_STYLES.CALENDARIO.monthTotalValue}>
                {monthlyHours.toFixed(2)} h
              </span>
              {monthlyMoney > 0 && (
                <span className={APP_STYLES.CALENDARIO.monthTotalEarnings}>
                  {monthlyMoney.toFixed(2)}€
                </span>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - offset);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      weekDays.push(d);
    }

    let totalWeekHours = 0;
    let totalWeekMoney = 0;

    return (
      <>
        <div className={APP_STYLES.CALENDARIO.weekContainer}>
          {weekDays.map((day) => {
            const dateStr = toLocalISOString(day);
            const dayShifts = shiftsByDate[dateStr] || [];
            const isToday = toLocalISOString(new Date()) === dateStr;

            let dayHours = 0;
            let dayMoney = 0;
            dayShifts.forEach((s) => {
              const duration = calculateDuration(s.startTime, s.endTime);
              dayHours += duration;
              if (s.hourTypeId) {
                const hType = hourTypes.find((h) => h.id === s.hourTypeId);
                const price = hType ? hType.price : 0;
                dayMoney += duration * price;
              }
            });
            totalWeekHours += dayHours;
            totalWeekMoney += dayMoney;

            return (
              <div
                key={dateStr}
                onClick={() => handleDayClick(day)}
                className={APP_STYLES.CALENDARIO.weekDayColumn}
              >
                <div className={APP_STYLES.CALENDARIO.weekDayHeader}>
                  <span className={APP_STYLES.CALENDARIO.weekDayName}>
                    {dayNamesES[day.getDay()]}
                  </span>
                  <span
                    className={`${APP_STYLES.CALENDARIO.weekDayNumber} ${
                      isToday
                        ? APP_STYLES.CALENDARIO.weekDayNumberToday
                        : APP_STYLES.CALENDARIO.weekDayNumberDefault
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>
                <div className={APP_STYLES.CALENDARIO.weekShiftsList}>
                  {dayShifts.map((shift, i) => (
                    <div
                      key={i}
                      className={APP_STYLES.CALENDARIO.weekShiftBadge}
                    >
                      <div className={APP_STYLES.CALENDARIO.weekShiftTime}>
                        {shift.startTime} - {shift.endTime}
                      </div>
                      <div className={APP_STYLES.CALENDARIO.weekShiftCategory}>
                        {shift.category}
                      </div>
                    </div>
                  ))}
                </div>
                {dayHours > 0 && (
                  <div className={APP_STYLES.CALENDARIO.weekDayTotal}>
                    {dayHours.toFixed(1)}h
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalWeekHours > 0 && (
          <div className={APP_STYLES.CALENDARIO.weekTotal}>
            <span className={APP_STYLES.CALENDARIO.monthTotalLabel}>
              TOTAL SEMANA
            </span>
            <div>
              <span className={APP_STYLES.CALENDARIO.monthTotalValue}>
                {totalWeekHours.toFixed(2)} h
              </span>
              {totalWeekMoney > 0 && (
                <span className={APP_STYLES.CALENDARIO.monthTotalEarnings}>
                  {totalWeekMoney.toFixed(2)}€
                </span>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderDayView = () => {
    const dateStr = toLocalISOString(currentDate);
    const dayShifts = shiftsByDate[dateStr] || [];
    let total = 0;
    let money = 0;

    return (
      <div className={APP_STYLES.CALENDARIO.dayViewContainer}>
        <div className={APP_STYLES.CALENDARIO.dayViewTitle}>
          <h3 className={APP_STYLES.CALENDARIO.dayViewTitleText}>
            {currentDate.toLocaleDateString("es-ES", { weekday: "long" })}
          </h3>
          <span className={APP_STYLES.CALENDARIO.dayViewSubtitle}>
            {currentDate.toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </div>

        {dayShifts.length > 0 ? (
          <div className={APP_STYLES.CALENDARIO.dayViewShiftsList}>
            {dayShifts.map((shift) => {
              const duration = calculateDuration(
                shift.startTime,
                shift.endTime
              );
              total += duration;

              let typeName = "Sin tipo";
              let price = 0;
              let hasType = false;

              if (shift.hourTypeId) {
                const hType = hourTypes.find((h) => h.id === shift.hourTypeId);
                typeName = hType ? hType.name : "Desc.";
                price = hType ? hType.price : 0;
                money += duration * price;
                hasType = true;
              }

              return (
                <div
                  key={shift.id}
                  className={APP_STYLES.CALENDARIO.dayViewShiftCard}
                >
                  <div className={APP_STYLES.CALENDARIO.dayViewShiftContent}>
                    <div className={APP_STYLES.CALENDARIO.dayViewShiftHeader}>
                      <span className={APP_STYLES.CALENDARIO.dayViewShiftTime}>
                        {shift.startTime} - {shift.endTime}
                      </span>
                      <span
                        className={APP_STYLES.CALENDARIO.dayViewShiftDuration}
                      >
                        {duration.toFixed(2)}h
                      </span>
                      {hasType && price * duration > 0 && (
                        <span
                          className={APP_STYLES.CALENDARIO.dayViewShiftEarnings}
                        >
                          {(duration * price).toFixed(2)}€
                        </span>
                      )}
                    </div>
                    <div className={APP_STYLES.CALENDARIO.dayViewShiftMeta}>
                      <span
                        className={APP_STYLES.CALENDARIO.dayViewShiftCategory}
                      >
                        {shift.category}
                      </span>
                      <span
                        className={APP_STYLES.CALENDARIO.dayViewShiftSeparator}
                      >
                        |
                      </span>
                      <span className={APP_STYLES.CALENDARIO.dayViewShiftType}>
                        {typeName}
                      </span>
                    </div>
                    {shift.notes && (
                      <p className={APP_STYLES.CALENDARIO.dayViewShiftNotes}>
                        "{shift.notes}"
                      </p>
                    )}
                  </div>
                  <div className={APP_STYLES.CALENDARIO.dayViewShiftActions}>
                    <button
                      onClick={() => openEditModal(shift)}
                      className={APP_STYLES.CALENDARIO.dayViewEditButton}
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete(shift.id)}
                      className={APP_STYLES.CALENDARIO.dayViewDeleteButton}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            <div className={APP_STYLES.CALENDARIO.dayViewTotal}>
              <span className={APP_STYLES.CALENDARIO.dayViewTotalLabel}>
                Total Diario
              </span>
              <div>
                <span className={APP_STYLES.CALENDARIO.dayViewTotalValue}>
                  {total.toFixed(2)} h
                </span>
                {money > 0 && (
                  <span className={APP_STYLES.CALENDARIO.dayViewTotalEarnings}>
                    {money.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={APP_STYLES.CALENDARIO.dayViewNoShifts}>
            <p className={APP_STYLES.CALENDARIO.dayViewNoShiftsText}>
              No hay registros.
            </p>
          </div>
        )}
      </div>
    );
  };

  // --- RENDER RANGE (GRID MODE) ---
  const renderRangeView = () => {
    const start = new Date(rangeStart).getTime();
    const end = new Date(rangeEnd).getTime();
    const dayMilliseconds = 24 * 60 * 60 * 1000;

    const diffDays = Math.ceil(Math.abs((end - start) / dayMilliseconds)) + 1;

    const days = [];
    for (let i = 0; i < diffDays; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    let totalRangeHours = 0;
    let totalRangeMoney = 0;

    const dayCards = days.map((d) => {
      const dateStr = toLocalISOString(d);
      const dayShifts = shiftsByDate[dateStr] || [];

      let dayHours = 0;
      let dayMoney = 0;

      dayShifts.forEach((s) => {
        const duration = calculateDuration(s.startTime, s.endTime);
        dayHours += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          dayMoney += duration * price;
        }
      });

      totalRangeHours += dayHours;
      totalRangeMoney += dayMoney;

      return (
        <div
          key={dateStr}
          onClick={() => handleDayClick(d)}
          className={APP_STYLES.CALENDARIO.rangeDayCard}
        >
          <div className={APP_STYLES.CALENDARIO.rangeDayHeader}>
            <span className={APP_STYLES.CALENDARIO.rangeDayName}>
              {dayNamesES[d.getDay()].substring(0, 2)}
            </span>
            <span className={APP_STYLES.CALENDARIO.rangeDayNumber}>
              {d.getDate()}
            </span>
          </div>
          <div className={APP_STYLES.CALENDARIO.rangeShiftsList}>
            {dayShifts.map((s) => (
              <div key={s.id} className={APP_STYLES.CALENDARIO.rangeShiftBadge}>
                <span className={APP_STYLES.CALENDARIO.rangeShiftTime}>
                  {s.startTime}
                </span>
              </div>
            ))}
          </div>
          {dayHours > 0 && (
            <div className={APP_STYLES.CALENDARIO.rangeDayTotal}>
              <span className={APP_STYLES.CALENDARIO.rangeDayTotalValue}>
                {dayHours.toFixed(1)}h
              </span>
            </div>
          )}
        </div>
      );
    });

    return (
      <div className={APP_STYLES.CALENDARIO.rangeContainer}>
        <div className={APP_STYLES.CALENDARIO.rangeHeader}>
          <div>
            <h3 className={APP_STYLES.CALENDARIO.rangeTitle}>Resumen Rango</h3>
            <p className={APP_STYLES.CALENDARIO.rangeSubtitle}>
              {new Date(rangeStart).toLocaleDateString()} -{" "}
              {new Date(rangeEnd).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className={APP_STYLES.CALENDARIO.rangeTotalValue}>
              {totalRangeHours.toFixed(2)}h
            </span>
            {totalRangeMoney > 0 && (
              <span className={APP_STYLES.CALENDARIO.rangeTotalEarnings}>
                {totalRangeMoney.toFixed(2)}€
              </span>
            )}
          </div>
        </div>
        <div className={APP_STYLES.CALENDARIO.rangeGrid}>{dayCards}</div>
      </div>
    );
  };

  const handleSave = () => {
    if (settings.downloadFormat === "pdf") {
      window.print();
    } else {
      handleDownloadTxt();
    }
  };

  const handleDownloadTxt = () => {
    let filteredShifts = shifts;
    let title = "Todos los registros";

    if (rangeStart && rangeEnd) {
      const start = rangeStart;
      const end = rangeEnd;
      filteredShifts = shifts.filter((s) => s.date >= start && s.date <= end);
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
      title = `Registro Mensual ${monthNamesES[month]} ${year}`;
    } else if (viewType === "day") {
      filteredShifts = shifts.filter(
        (s) => s.date === toLocalISOString(currentDate)
      );
      title = `Registro Diario ${toLocalISOString(currentDate)}`;
    }

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
              <ChevronLeftIcon />
            </Button>
            <h2 className={APP_STYLES.CALENDARIO.navTitle}>
              {viewType === "year" && year}
              {viewType === "month" && `${monthNamesES[month]} ${year}`}
              {viewType === "week" &&
                `Semana ${currentDate.getDate()} - ${monthNamesES[month]}`}
              {viewType === "day" && currentDate.toLocaleDateString()}
            </h2>
            <Button
              onClick={handleNext}
              variant="secondary"
              className={APP_STYLES.CALENDARIO.navButton}
            >
              <ChevronRightIcon />
            </Button>
          </div>
        ) : null}

        {rangeStart && rangeEnd ? (
          renderRangeView()
        ) : (
          <>
            {viewType === "year" && renderYearView()}
            {viewType === "month" && renderMonthView()}
            {viewType === "week" && renderWeekView()}
            {viewType === "day" && renderDayView()}
          </>
        )}
      </Card>

      <div className="flex justify-end print:hidden">
        <Button onClick={handleSave} className="flex items-center gap-1">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121212] rounded-xl shadow-2xl shadow-black border border-yellow-500/30 max-w-lg w-full p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wide">
                Editar Registro
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              >
                <XMarkIcon />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
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

              <div className="col-span-2">
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
              <div className="col-span-2">
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

            <div className="flex justify-end gap-2">
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
