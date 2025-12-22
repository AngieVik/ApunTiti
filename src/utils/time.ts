/**
 * Time utility functions for shift duration and date formatting
 */

/**
 * Converts a Date object to a local ISO string format (YYYY-MM-DD)
 * Adjusts for timezone offset to ensure correct local date
 *
 * @param date - The Date object to convert
 * @returns ISO date string in YYYY-MM-DD format
 *
 * @example
 * ```ts
 * toLocalISOString(new Date('2025-12-18T10:00:00'))  // "2025-12-18"
 * toLocalISOString(new Date())  // Current date in YYYY-MM-DD
 * ```
 */
export const toLocalISOString = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split("T")[0];
};

/**
 * Calculates the duration in hours between two time strings
 * Handles overnight shifts (when end time is before start time)
 * Handles 24-hour shifts (when start time equals end time)
 *
 * @param start - Start time in HH:MM format (24-hour)
 * @param end - End time in HH:MM format (24-hour)
 * @returns Duration in decimal hours
 *
 * @example
 * ```ts
 * calculateDuration("09:00", "17:00")  // 8.0 (regular shift)
 * calculateDuration("23:00", "07:00")  // 8.0 (overnight shift)
 * calculateDuration("14:30", "18:45")  // 4.25 (with minutes)
 * calculateDuration("09:00", "09:00")  // 24.0 (24-hour shift)
 * ```
 */
export const calculateDuration = (start: string, end: string): number => {
  const s = parseInt(start.split(":")[0]) + parseInt(start.split(":")[1]) / 60;
  const e = parseInt(end.split(":")[0]) + parseInt(end.split(":")[1]) / 60;

  // 24-hour shift: start time equals end time
  if (s === e) {
    return 24;
  }

  // Overnight shift detection
  if (e < s) {
    return 24 - s + e;
  }
  return e - s;
};

/**
 * Parses a time string (HH:MM) to minutes from midnight
 *
 * @param timeStr - Time string in HH:MM format
 * @returns Total minutes from midnight (0-1439)
 *
 * @example
 * ```ts
 * parseTimeToMinutes("09:00")  // 540
 * parseTimeToMinutes("12:30")  // 750
 * parseTimeToMinutes("00:00")  // 0
 * parseTimeToMinutes("23:59")  // 1439
 * ```
 */
export const parseTimeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/**
 * Formats decimal hours to a readable string
 *
 * @param hours - Decimal hours (e.g., 8.5)
 * @returns Formatted string (e.g., "8h 30m")
 *
 * @example
 * ```ts
 * formatDuration(8)     // "8h"
 * formatDuration(8.5)   // "8h 30m"
 * formatDuration(0.25)  // "15m"
 * ```
 */
export const formatDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/**
 * Parses a date string in YYYY-MM-DD format without timezone issues
 * Avoids the bug where new Date("YYYY-MM-DD") interprets dates as UTC midnight
 *
 * @param dateStr - Date string in "YYYY-MM-DD" format
 * @returns Object with year, month (0-indexed), and day
 *
 * @example
 * ```ts
 * parseDateString("2025-12-18")  // { year: 2025, month: 11, day: 18 }
 * parseDateString("2025-01-05")  // { year: 2025, month: 0, day: 5 }
 * ```
 */
export const parseDateString = (
  dateStr: string
): { year: number; month: number; day: number } => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return { year, month: month - 1, day };
};
