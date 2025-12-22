/**
 * COMPONENT TOKENS: Variantes y estilos específicos por componente.
 * Estos tokens consumen tokens semánticos y definen las variantes de UI.
 *
 * @fileoverview Component-level design tokens for Button, Card, Input, Select.
 */

// ─── BUTTON VARIANTS ───────────────────────────────
export const BUTTON_VARIANTS = {
  base: "relative flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 dark:focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",

  variants: {
    primary:
      "bg-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-hover)] text-[var(--theme-accent-on)] shadow-md shadow-[var(--theme-accent-primary)]/10 active:translate-y-0.5",
    secondary:
      "bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm active:translate-y-0.5",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/10 dark:text-red-400 border border-red-200 dark:border-red-900/30 active:translate-y-0.5",
    ghost:
      "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400",
    outline:
      "bg-transparent border border-[var(--theme-accent-primary)] text-[var(--theme-accent-primary)] hover:bg-[var(--theme-accent-primary)]/10",
  },

  sizes: {
    sm: "h-6 px-2 text-[9px] gap-1 rounded",
    md: "h-8 px-4 text-[10px] gap-2 rounded",
    lg: "h-10 px-6 text-xs gap-2 rounded-lg",
  },

  iconOnly: {
    sm: "h-6 w-6 p-0",
    md: "h-8 w-8 p-0",
    lg: "h-10 w-10 p-0",
  },
} as const;

// ─── CARD VARIANTS ─────────────────────────────────
export const CARD_VARIANTS = {
  base: "rounded-lg transition-colors",

  variants: {
    default:
      "bg-white dark:bg-[#111] p-3 shadow-sm border border-gray-100 dark:border-white/10",
    elevated:
      "bg-white dark:bg-[#111] p-3 shadow-md border border-gray-100 dark:border-white/10",
    bordered:
      "bg-white dark:bg-[#111] p-3 border-2 border-gray-200 dark:border-gray-700",
    interactive:
      "bg-white dark:bg-[#111] p-3 border border-gray-100 dark:border-white/5 cursor-pointer hover:border-[var(--theme-accent-primary)] hover:shadow-md",
    flush: "bg-transparent p-0",
  },

  accents: {
    none: "",
    top: "border-t-2 border-t-[var(--theme-accent-primary)]",
    left: "border-l-4 border-l-[var(--theme-accent-primary)]",
  },
} as const;

// ─── INPUT VARIANTS ────────────────────────────────
export const INPUT_VARIANTS = {
  wrapper: "w-full group",

  label:
    "block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-[var(--theme-accent-primary)] transition-colors",

  field: {
    base: "w-full bg-gray-50 dark:bg-[#1a1a1a] border rounded text-gray-900 dark:text-gray-100 font-medium transition-all",
    sizes: {
      sm: "px-1.5 h-6 text-[10px]",
      md: "px-2 h-8 text-xs",
      lg: "px-3 h-10 text-sm",
    },
    states: {
      default:
        "border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 focus:border-[var(--theme-accent-primary)]",
      error:
        "border-red-500 dark:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500",
      success:
        "border-green-500 dark:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500",
      disabled:
        "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60",
    },
  },
} as const;

// ─── SELECT VARIANTS ───────────────────────────────
export const SELECT_VARIANTS = {
  wrapper: "w-full group",

  label:
    "block text-[9px] font-bold text-gray-700 dark:text-gray-200 mb-0.5 uppercase tracking-wider group-focus-within:text-[var(--theme-accent-primary)] transition-colors",

  container: "relative",

  field: {
    base: "w-full bg-gray-50 dark:bg-[#1a1a1a] border rounded text-gray-900 dark:text-gray-100 font-medium transition-all appearance-none cursor-pointer",
    sizes: {
      sm: "pl-1.5 pr-6 h-6 text-[10px]",
      md: "pl-2 pr-6 h-8 text-xs",
      lg: "pl-3 pr-8 h-10 text-sm",
    },
    states: {
      default:
        "border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-[var(--theme-accent-primary)]/50 focus:border-[var(--theme-accent-primary)]",
      error:
        "border-red-500 dark:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500/50 focus:border-red-500",
      disabled:
        "border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60",
    },
  },

  arrow:
    "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400",
} as const;

// ─── TOAST VARIANTS ────────────────────────────────
export const TOAST_VARIANTS = {
  base: "fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded shadow-xl min-w-[300px] justify-center",

  variants: {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
    warning: "bg-yellow-500 text-black",
  },

  text: "text-[10px] font-bold uppercase tracking-wide",
} as const;

// ─── DIALOG VARIANTS ───────────────────────────────
export const DIALOG_VARIANTS = {
  overlay:
    "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm",

  content: {
    base: "bg-white dark:bg-[#111] rounded-xl border max-w-sm w-full p-5 shadow-2xl",
    variants: {
      default: "border-white/10",
      danger: "border-red-500/30",
    },
  },

  title:
    "text-sm font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide",
  message: "text-gray-600 dark:text-gray-300 mb-6 text-xs leading-relaxed",
  actions: "flex justify-end gap-2",
} as const;

// ─── ICON SIZES ────────────────────────────────────
export const ICON_SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
} as const;

// Type exports
export type ButtonVariant = keyof typeof BUTTON_VARIANTS.variants;
export type ButtonSize = keyof typeof BUTTON_VARIANTS.sizes;
export type CardVariant = keyof typeof CARD_VARIANTS.variants;
export type CardAccent = keyof typeof CARD_VARIANTS.accents;
export type InputSize = keyof typeof INPUT_VARIANTS.field.sizes;
export type InputState = keyof typeof INPUT_VARIANTS.field.states;
export type ToastVariant = keyof typeof TOAST_VARIANTS.variants;
