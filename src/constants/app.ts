/**
 * Application-wide constants
 * Centralized location for all magic numbers, strings, and configuration values
 */

/**
 * Spanish month names
 */
export const MONTH_NAMES_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/**
 * Spanish day names (abbreviated)
 */
export const DAY_NAMES_ES = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
] as const;

/**
 * Validation limits for app entities
 */
export const LIMITS = {
  /** Maximum number of categories allowed */
  MAX_CATEGORIES: 20,
  /** Minimum number of categories required */
  MIN_CATEGORIES: 1,
  /** Maximum category name length */
  MAX_CATEGORY_NAME_LENGTH: 30,

  /** Maximum number of hour types allowed */
  MAX_HOUR_TYPES: 10,
  /** Minimum number of hour types required */
  MIN_HOUR_TYPES: 1,
  /** Maximum hour type name length */
  MAX_HOUR_TYPE_NAME_LENGTH: 50,

  /** Maximum price for hour type */
  MAX_PRICE: 1000,
  /** Minimum price (must be non-negative) */
  MIN_PRICE: 0,
} as const;

/**
 * Time format constants
 */
export const TIME_FORMATS = {
  /** 24-hour time format (HH:MM) */
  TIME_24H: "HH:MM",
  /** ISO date format (YYYY-MM-DD) */
  DATE_ISO: "YYYY-MM-DD",
  /** Hours in a day */
  HOURS_PER_DAY: 24,
  /** Minutes in an hour */
  MINUTES_PER_HOUR: 60,
} as const;

/**
 * Common user-facing messages
 */
export const MESSAGES = {
  // Success messages
  SHIFT_SAVED: "Turno registrado correctamente",
  SHIFT_UPDATED: "Turno actualizado correctamente",
  SHIFT_DELETED: "Turno eliminado",
  CATEGORY_ADDED: "Categoría añadida",
  CATEGORY_UPDATED: "Categoría actualizada",
  CATEGORY_DELETED: "Categoría eliminada",
  HOUR_TYPE_ADDED: "Tipo de hora añadido correctamente",
  HOUR_TYPE_DELETED: "Tipo de hora eliminado",
  DATA_RESTORED: "Datos restaurados correctamente",
  DATA_EXPORTED: "Datos exportados correctamente",

  // Error messages
  REQUIRED_FIELDS: "Por favor, completa todos los campos",
  INVALID_TIME_FORMAT: "Formato de hora inválido",
  INVALID_DATE_FORMAT: "Formato de fecha inválido",
  TIME_OVERLAP: "El horario se solapa con otro registro",
  EMPTY_FILE: "El archivo está vacío",
  INVALID_FILE_TYPE: "El archivo debe tener extensión .json",
  CORRUPTED_JSON: "El archivo JSON está corrupto o mal formado",
  NO_VALID_DATA: "No se encontraron datos válidos para restaurar",
  SYNC_ERROR: "Error de sincronización",
  NETWORK_ERROR: "Error de red. Verifica tu conexión a internet.",

  // Info messages
  COMPLETE_NAME_PRICE: "Por favor completa nombre y precio",
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  /** Main app storage key for Zustand persist */
  APP_STORAGE: "apuntiti-storage",
} as const;

/**
 * Export format options
 */
export const EXPORT_FORMATS = {
  TXT: "txt",
  PDF: "pdf",
} as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[keyof typeof EXPORT_FORMATS];
