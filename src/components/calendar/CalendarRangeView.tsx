import React from "react";
import { Shift } from "../../types";
import { APP_STYLES } from "../../theme/styles";
import { DAY_NAMES_ES } from "../../constants/app";
import { toLocalISOString, calculateDuration } from "../../utils/time";
import { List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export interface CalendarRangeViewProps {
  rangeStart: string;
  rangeEnd: string;
  rangeDays: Date[];
  shiftsByDate: Record<string, Shift[]>;
  totalRangeHours: number;
  totalRangeMoney: number;
  onDayClick: (date: Date) => void;
}

export const CalendarRangeView: React.FC<CalendarRangeViewProps> = ({
  rangeStart,
  rangeEnd,
  rangeDays,
  shiftsByDate,
  totalRangeHours,
  totalRangeMoney,
  onDayClick,
}) => {
  const Row = ({ index, style, days, shiftsByDate, handleDayClick }: any) => {
    const startIndex = index * 7;
    const rowDays = days.slice(
      startIndex,
      Math.min(startIndex + 7, days.length)
    );

    return (
      <div style={style} className="grid grid-cols-7 gap-1">
        {rowDays.map((d: Date) => {
          const dateStr = toLocalISOString(d);
          const dayShifts = shiftsByDate[dateStr] || [];
          let dayHours = 0;
          dayShifts.forEach((s: Shift) => {
            dayHours += calculateDuration(s.startTime, s.endTime);
          });

          return (
            <div
              key={dateStr}
              onClick={() => handleDayClick(d)}
              className={APP_STYLES.CALENDARIO.rangeDayCard}
            >
              <div className={APP_STYLES.CALENDARIO.rangeDayHeader}>
                <span className={APP_STYLES.CALENDARIO.rangeDayName}>
                  {DAY_NAMES_ES[d.getDay()].substring(0, 2)}
                </span>
                <span className={APP_STYLES.CALENDARIO.rangeDayNumber}>
                  {d.getDate()}
                </span>
              </div>
              <div className={APP_STYLES.CALENDARIO.rangeShiftsList}>
                {dayShifts.map((s: Shift) => (
                  <div
                    key={s.id}
                    className={APP_STYLES.CALENDARIO.rangeShiftBadge}
                  >
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
        })}
      </div>
    );
  };

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
        <div className="text-right">
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

      <div style={{ height: 500, width: "100%" }}>
        <AutoSizer>
          {() => (
            <List
              rowCount={Math.ceil(rangeDays.length / 7)}
              rowHeight={100}
              rowComponent={Row}
              rowProps={{
                days: rangeDays,
                shiftsByDate,
                handleDayClick: onDayClick,
              }}
            />
          )}
        </AutoSizer>
      </div>
    </div>
  );
};
