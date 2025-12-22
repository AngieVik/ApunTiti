/**
 * PRIMITIVAS: Valores raw sin significado semántico.
 * NUNCA usar directamente en componentes - usar tokens semánticos.
 *
 * @fileoverview Base values for colors, spacing, typography, radius, and shadows.
 */

export const PRIMITIVES = {
  // ─── COLOR PALETTE ───────────────────────────────
  colors: {
    // Brand (Yellow - Primary Accent)
    yellow: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#eab308", // Primary accent
      600: "#ca8a04",
      700: "#a16207",
    },

    // Neutral (Grayscale)
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
    },

    // Dark mode specific surfaces
    dark: {
      surface: "#111111",
      surfaceElevated: "#1a1a1a",
      surfaceHighest: "#222222",
      border: "rgba(255,255,255,0.05)",
      borderHover: "rgba(255,255,255,0.10)",
    },

    // Feedback colors
    green: {
      50: "#f0fdf4",
      100: "#dcfce7",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      900: "rgba(34,197,94,0.1)",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      800: "#991b1b",
      900: "rgba(239,68,68,0.1)",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      900: "rgba(59,130,246,0.1)",
    },

    // Pure values
    white: "#ffffff",
    black: "#000000",
  },

  // ─── SPACING SCALE ───────────────────────────────
  // Based on 4px (Tailwind default)
  spacing: {
    0: "0px",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
  },

  // ─── TYPOGRAPHY ──────────────────────────────────
  fontSize: {
    "2xs": "0.5625rem", // 9px
    xs: "0.625rem", // 10px
    sm: "0.75rem", // 12px
    base: "0.875rem", // 14px
    lg: "1rem", // 16px
    xl: "1.125rem", // 18px
    "2xl": "1.25rem", // 20px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    black: "900",
  },

  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },

  // ─── BORDER RADIUS ───────────────────────────────
  radius: {
    none: "0px",
    sm: "0.25rem", // 4px
    DEFAULT: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    full: "9999px",
  },

  // ─── SHADOWS ─────────────────────────────────────
  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },

  // ─── TRANSITIONS ─────────────────────────────────
  duration: {
    fast: "150ms",
    DEFAULT: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  easing: {
    DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },

  // ─── Z-INDEX ─────────────────────────────────────
  zIndex: {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const;

export type Primitives = typeof PRIMITIVES;
