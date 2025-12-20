import React, { useMemo } from "react";
import { Shift, HourType } from "../../types";
import { APP_STYLES } from "../../theme/styles";
import { MONTH_NAMES_ES } from "../../constants/app";
import { calculateDuration } from "../../utils/time";

export interface CalendarYearViewProps {
  year: number;
  currentMonth: number;
  shifts: Shift[];
  hourTypes: HourType[];
  onMonthClick: (month: number) => void;
  workedMonthsInRange?: number[]; // Optional - only months with worked days in range
}

export const CalendarYearView: React.FC<CalendarYearViewProps> = ({
  year,
  currentMonth,
  shifts,
  hourTypes,
  onMonthClick,
  workedMonthsInRange,
}) => {
  const statsByMonth = useMemo(() => {
    const stats = Array.from({ length: 12 }, () => ({ hours: 0, money: 0 }));

    shifts.forEach((s) => {
      const d = new Date(s.date);
      if (d.getFullYear() === year) {
        const duration = calculateDuration(s.startTime, s.endTime);
        stats[d.getMonth()].hours += duration;
        if (s.hourTypeId) {
          const hType = hourTypes.find((h) => h.id === s.hourTypeId);
          const price = hType ? hType.price : 0;
          stats[d.getMonth()].money += duration * price;
        }
      }
    });

    return stats;
  }, [year, shifts, hourTypes]);

  // Filter to show only worked months if in range mode
  const monthsToDisplay =
    workedMonthsInRange && workedMonthsInRange.length > 0
      ? workedMonthsInRange
      : Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className={APP_STYLES.CALENDARIO.yearGrid}>
      {monthsToDisplay.map((monthIdx) => (
        <div
          key={monthIdx}
          onClick={() => onMonthClick(monthIdx)}
          className={`${APP_STYLES.CALENDARIO.yearMonthCard} ${
            monthIdx === currentMonth
              ? APP_STYLES.CALENDARIO.yearMonthCardActive
              : APP_STYLES.CALENDARIO.yearMonthCardInactive
          }`}
        >
          <h3 className={APP_STYLES.CALENDARIO.yearMonthTitle}>
            {MONTH_NAMES_ES[monthIdx]}
          </h3>
          <div className={APP_STYLES.CALENDARIO.yearMonthStats}>
            <p className={APP_STYLES.CALENDARIO.yearMonthHours}>
              {statsByMonth[monthIdx].hours.toFixed(0)}h
            </p>
            {statsByMonth[monthIdx].money > 0 && (
              <p className={APP_STYLES.CALENDARIO.yearMonthMoney}>
                {statsByMonth[monthIdx].money.toFixed(0)}€
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
