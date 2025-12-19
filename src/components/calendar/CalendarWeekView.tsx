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
}

export const CalendarWeekView: React.FC<CalendarWeekViewProps> = ({
  currentDate,
  shiftsByDate,
  hourTypes,
  onDayClick,
}) => {
  const { weekDays, weekTotal, weekMoney } = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay(); // 0 Sun
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

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
  }, [currentDate, shiftsByDate, hourTypes]);

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
