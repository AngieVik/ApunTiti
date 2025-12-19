import React, { useMemo } from "react";
import { Shift, HourType } from "../../types";
import { APP_STYLES } from "../../theme/styles";
import { toLocalISOString, calculateDuration } from "../../utils/time";

export interface CalendarMonthViewProps {
  year: number;
  month: number;
  selectedDate: Date | null;
  shiftsByDate: Record<string, Shift[]>;
  hourTypes: HourType[];
  onDayClick: (date: Date) => void;
  getDaysInMonth: (year: number, month: number) => number;
  getFirstDayOfMonth: (year: number, month: number) => number;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  year,
  month,
  selectedDate,
  shiftsByDate,
  hourTypes,
  onDayClick,
  getDaysInMonth,
  getFirstDayOfMonth,
}) => {
  const { grid, monthlyHours, monthlyMoney } = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const cells = [];
    let totalHours = 0;
    let totalMoney = 0;

    // Empty cells before first day
    for (let i = 0; i < startDay; i++) {
      cells.push(
        <div
          key={`empty-${i}`}
          className={APP_STYLES.CALENDARIO.emptyCell}
        ></div>
      );
    }

    // Day cells
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

      totalHours += hoursToday;
      totalMoney += moneyToday;

      cells.push(
        <div
          key={day}
          onClick={() => onDayClick(new Date(year, month, day))}
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

    return { grid: cells, monthlyHours: totalHours, monthlyMoney: totalMoney };
  }, [
    year,
    month,
    selectedDate,
    shiftsByDate,
    hourTypes,
    getDaysInMonth,
    getFirstDayOfMonth,
    onDayClick,
  ]);

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
      <div className={APP_STYLES.CALENDARIO.monthTotal}>
        <span className={APP_STYLES.CALENDARIO.monthTotalLabel}>
          Total Mensual
        </span>
        <div className="text-right">
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
    </>
  );
};
