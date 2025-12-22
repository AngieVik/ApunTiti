import React, { useMemo } from "react";
import { Shift, HourType } from "../../types";
import { APP_STYLES } from "../../theme/styles";
import { DAY_NAMES_ES } from "../../constants/app";
import { toLocalISOString, calculateDuration } from "../../utils/time";

export interface CalendarWeekViewProps {
  currentDate: Date;
  shiftsByDate: Record<string, Shift[]>;
  hourTypes: HourType[];
  onDayClick: (date: Date) => void;
  rangeMode?: boolean;
  workedWeeks?: Date[];
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  currentDate,
  shiftsByDate,
  hourTypes,
  onDayClick,
  rangeMode = false,
  workedWeeks = [],
}) => {
  const { weekDays, weekTotal, weekMoney } = useMemo(() => {
    // En modo rango, usar las semanas con días trabajados
    // Si no hay semanas trabajadas en el rango, no mostrar nada
    if (rangeMode && workedWeeks.length === 0) {
      return { weekDays: [], weekTotal: 0, weekMoney: 0 };
    }

    // Determinar la fecha de inicio de la semana
    let startOfWeek: Date;

    if (rangeMode && workedWeeks.length > 0) {
      // En modo rango, buscar la semana que coincida con currentDate
      // Si currentDate no está en workedWeeks, usar la primera semana trabajada
      const currentWeekStr = toLocalISOString(currentDate);
      const matchingWeek = workedWeeks.find(
        (w) => toLocalISOString(w) === currentWeekStr
      );
      startOfWeek = matchingWeek
        ? new Date(matchingWeek)
        : new Date(workedWeeks[0]);
    } else {
      // Modo normal: calcular inicio de semana desde currentDate
      startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay(); // 0 Sun
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
    }

    const days = [];
    let total = 0;
    let money = 0;

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = toLocalISOString(d);
      const dayShifts = shiftsByDate[dateStr] || [];

      let hoursToday = 0;
      dayShifts.forEach((s) => {
        const duration = calculateDuration(s.startTime, s.endTime);
        hoursToday += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          money += duration * price;
        }
      });
      total += hoursToday;

      days.push({
        date: d,
        dateStr,
        shifts: dayShifts,
        hours: hoursToday,
        isToday: toLocalISOString(new Date()) === dateStr,
      });
    }

    return { weekDays: days, weekTotal: total, weekMoney: money };
  }, [currentDate, shiftsByDate, hourTypes, rangeMode, workedWeeks]);

  return (
    <>
      <div className={APP_STYLES.CALENDARIO.weekContainer}>
        {weekDays.map((day, i) => (
          <div
            key={i}
            onClick={() => onDayClick(day.date)}
            className={APP_STYLES.CALENDARIO.weekDayColumn}
          >
            <div className={APP_STYLES.CALENDARIO.weekDayHeader}>
              <span className={APP_STYLES.CALENDARIO.weekDayName}>
                {DAY_NAMES_ES[day.date.getDay()]}
              </span>
              <span
                className={`${APP_STYLES.CALENDARIO.weekDayNumber} ${
                  day.isToday
                    ? APP_STYLES.CALENDARIO.weekDayNumberToday
                    : APP_STYLES.CALENDARIO.weekDayNumberDefault
                }`}
              >
                {day.date.getDate()}
              </span>
            </div>
            <div className={APP_STYLES.CALENDARIO.weekShiftsList}>
              {day.shifts.map((s) => (
                <div
                  key={s.id}
                  className={APP_STYLES.CALENDARIO.weekShiftBadge}
                >
                  <div className={APP_STYLES.CALENDARIO.weekShiftTime}>
                    {s.startTime}
                  </div>
                  <div className={APP_STYLES.CALENDARIO.weekShiftCategory}>
                    {s.category}
                  </div>
                </div>
              ))}
            </div>
            {day.hours > 0 && (
              <div className={APP_STYLES.CALENDARIO.weekDayTotal}>
                {day.hours.toFixed(1)}h
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={APP_STYLES.CALENDARIO.weekTotal}>
        <span className={APP_STYLES.CALENDARIO.monthTotalLabel}>
          Total Semanal
        </span>
        <div className="text-right">
          <span className={APP_STYLES.CALENDARIO.monthTotalValue}>
            {weekTotal.toFixed(2)} h
          </span>
          {weekMoney > 0 && (
            <span className={APP_STYLES.CALENDARIO.monthTotalEarnings}>
              {weekMoney.toFixed(2)}€
            </span>
          )}
        </div>
      </div>
    </>
  );
};
