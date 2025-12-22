export enum View {
  Clock = "CLOCK",
  Calendar = "CALENDAR",
  Settings = "SETTINGS",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

/** Available color themes for the app */
export type ColorTheme = "basico" | "rosa-pastel";

/** Color theme configuration */
export interface ColorThemeConfig {
  id: ColorTheme;
  name: string;
  preview: string; // CSS color for preview
}

/** Available color themes list */
export const COLOR_THEMES: ColorThemeConfig[] = [
  { id: "basico", name: "Básico", preview: "#eab308" },
  { id: "rosa-pastel", name: "Rosa Pastel", preview: "#f472b6" },
];

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
  downloadFormat: "txt" | "pdf" | "xlsx";
  pushEnabled?: boolean;
  colorTheme?: ColorTheme;
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
