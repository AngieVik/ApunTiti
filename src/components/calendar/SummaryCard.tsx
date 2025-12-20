import React from "react";
import { APP_STYLES } from "../../theme/styles";

export interface SummaryCardProps {
  title: string;
  hours: number;
  earnings?: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  hours,
  earnings,
}) => {
  return (
    <div className={APP_STYLES.CALENDARIO.summaryCard}>
      <div className={APP_STYLES.CALENDARIO.summaryCardTitle}>{title}</div>
      <div className={APP_STYLES.CALENDARIO.summaryCardValue}>
        {hours.toFixed(2)}h
      </div>
      {earnings !== undefined && earnings > 0 && (
        <div className={APP_STYLES.CALENDARIO.summaryCardEarnings}>
          {earnings.toFixed(2)}€
        </div>
      )}
    </div>
  );
};
