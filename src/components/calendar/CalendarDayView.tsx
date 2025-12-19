import React, { useMemo } from "react";
import { Shift, HourType } from "../../types";
import { APP_STYLES } from "../../theme/styles";
import { PencilIcon, TrashIcon } from "../Icons";
import { toLocalISOString, calculateDuration } from "../../utils/time";

export interface CalendarDayViewProps {
  currentDate: Date;
  shiftsByDate: Record<string, Shift[]>;
  hourTypes: HourType[];
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
}

export const CalendarDayView: React.FC<CalendarDayViewProps> = ({
  currentDate,
  shiftsByDate,
  hourTypes,
  onEdit,
  onDelete,
}) => {
  const dateStr = toLocalISOString(currentDate);
  const dayShifts = shiftsByDate[dateStr] || [];

  const { total, money } = useMemo(() => {
    let totalHours = 0;
    let totalMoney = 0;

    dayShifts.forEach((shift) => {
      const duration = calculateDuration(shift.startTime, shift.endTime);
      totalHours += duration;

      if (shift.hourTypeId) {
        const hType = hourTypes.find((h) => h.id === shift.hourTypeId);
        const price = hType ? hType.price : 0;
        totalMoney += duration * price;
      }
    });

    return { total: totalHours, money: totalMoney };
  }, [dayShifts, hourTypes]);

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
            const duration = calculateDuration(shift.startTime, shift.endTime);

            let typeName = "Sin tipo";
            let price = 0;
            let hasType = false;

            if (shift.hourTypeId) {
              const hType = hourTypes.find((h) => h.id === shift.hourTypeId);
              typeName = hType ? hType.name : "Desc.";
              price = hType ? hType.price : 0;
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
                    onClick={() => onEdit(shift)}
                    className={APP_STYLES.CALENDARIO.dayViewEditButton}
                  >
                    <PencilIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                  </button>
                  <button
                    onClick={() => onDelete(shift.id)}
                    className={APP_STYLES.CALENDARIO.dayViewDeleteButton}
                  >
                    <TrashIcon className={APP_STYLES.MODOS.iconGreyBlue} />
                  </button>
                </div>
              </div>
            );
          })}
          <div className={APP_STYLES.CALENDARIO.dayViewTotal}>
            <span className={APP_STYLES.CALENDARIO.dayViewTotalLabel}>
              Total Diario
            </span>
            <div className="text-right">
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
