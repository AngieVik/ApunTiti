export enum View {
  Clock = "CLOCK",
  Calendar = "CALENDAR",
  Settings = "SETTINGS",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export interface HourType {
  id: string;
  name: string;
  price: number;
}

export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes: string;
  category: string;
  hourTypeId?: string; // ID referencing HourType
}

export interface Settings {
  categories: string[];
  hourTypes: HourType[];
  downloadFormat: "txt" | "pdf";
  pushEnabled?: boolean;
}

export interface BackupData {
  version: number;
  date: string;
  shifts: Shift[];
  settings: Settings;
}

export type NotificationType = "success" | "error" | "info";

export interface Notification {
  message: string;
  type: NotificationType;
}
