/**
 * SEMÁNTICA: Tokens con significado de uso.
 * Estos son los tokens que se reemplazan al cambiar de tema.
 *
 * @fileoverview Semantic tokens for surfaces, text, borders, accents, and feedback.
 */

import { PRIMITIVES } from "./primitives";

/**
 * Interface for semantic design tokens.
 * Each theme must implement this interface.
 */
export interface SemanticTokens {
  // ─── SURFACES ────────────────────────────────────
  surface: {
    /** Main app background */
    base: string;
    /** Cards, modals, elevated elements */
    elevated: string;
    /** Highest elevation (dropdowns, popovers) */
    highest: string;
    /** Interactive/hover states */
    interactive: string;
    /** Subtle backgrounds (zebra striping, etc) */
    subtle: string;
  };

  // ─── BORDERS ─────────────────────────────────────
  border: {
    /** Default border color */
    default: string;
    /** Subtle/light borders */
    subtle: string;
    /** Accent borders (focus, active) */
    accent: string;
    /** Strong borders (dividers) */
    strong: string;
  };

  // ─── TEXT ────────────────────────────────────────
  text: {
    /** Primary text (headings, main content) */
    primary: string;
    /** Secondary text (descriptions, labels) */
    secondary: string;
    /** Muted text (disabled, placeholders) */
    muted: string;
    /** Text on accent backgrounds */
    inverse: string;
    /** Link text */
    link: string;
  };

  // ─── ACCENT ──────────────────────────────────────
  accent: {
    /** Primary accent color (CTAs, highlights) */
    primary: string;
    /** Primary hover state */
    primaryHover: string;
    /** Primary active/pressed state */
    primaryActive: string;
    /** Text on primary accent */
    onPrimary: string;
    /** Subtle accent background */
    subtle: string;
  };

  // ─── FEEDBACK ────────────────────────────────────
  feedback: {
    /** Success color */
    success: string;
    /** Success background */
    successBg: string;
    /** Success text on bg */
    successText: string;
    /** Error/danger color */
    error: string;
    /** Error background */
    errorBg: string;
    /** Error text on bg */
    errorText: string;
    /** Info color */
    info: string;
    /** Info background */
    infoBg: string;
    /** Info text on bg */
    infoText: string;
    /** Warning color */
    warning: string;
    /** Warning background */
    warningBg: string;
  };
}

// ─── LIGHT THEME ───────────────────────────────────
export const LIGHT_THEME: SemanticTokens = {
  surface: {
    base: PRIMITIVES.colors.gray[100],
    elevated: PRIMITIVES.colors.white,
    highest: PRIMITIVES.colors.white,
    interactive: PRIMITIVES.colors.gray[50],
    subtle: PRIMITIVES.colors.gray[50],
  },

  border: {
    default: PRIMITIVES.colors.gray[200],
    subtle: PRIMITIVES.colors.gray[100],
    accent: PRIMITIVES.colors.yellow[500],
    strong: PRIMITIVES.colors.gray[300],
  },

  text: {
    primary: PRIMITIVES.colors.gray[900],
    secondary: PRIMITIVES.colors.gray[700],
    muted: PRIMITIVES.colors.gray[500],
    inverse: PRIMITIVES.colors.black,
    link: PRIMITIVES.colors.yellow[600],
  },

  accent: {
    primary: PRIMITIVES.colors.yellow[500],
    primaryHover: PRIMITIVES.colors.yellow[400],
    primaryActive: PRIMITIVES.colors.yellow[600],
    onPrimary: PRIMITIVES.colors.black,
    subtle: PRIMITIVES.colors.yellow[50],
  },

  feedback: {
    success: PRIMITIVES.colors.green[600],
    successBg: PRIMITIVES.colors.green[100],
    successText: PRIMITIVES.colors.green[600],
    error: PRIMITIVES.colors.red[600],
    errorBg: PRIMITIVES.colors.red[100],
    errorText: PRIMITIVES.colors.red[600],
    info: PRIMITIVES.colors.blue[600],
    infoBg: PRIMITIVES.colors.blue[100],
    infoText: PRIMITIVES.colors.blue[600],
    warning: PRIMITIVES.colors.yellow[600],
    warningBg: PRIMITIVES.colors.yellow[100],
  },
};

// ─── DARK THEME ────────────────────────────────────
export const DARK_THEME: SemanticTokens = {
  surface: {
    base: PRIMITIVES.colors.black,
    elevated: PRIMITIVES.colors.dark.surface,
    highest: PRIMITIVES.colors.dark.surfaceElevated,
    interactive: PRIMITIVES.colors.dark.surfaceHighest,
    subtle: PRIMITIVES.colors.dark.surfaceElevated,
  },

  border: {
    default: PRIMITIVES.colors.dark.border,
    subtle: PRIMITIVES.colors.dark.border,
    accent: PRIMITIVES.colors.yellow[500],
    strong: PRIMITIVES.colors.dark.borderHover,
  },

  text: {
    primary: PRIMITIVES.colors.white,
    secondary: PRIMITIVES.colors.gray[300],
    muted: PRIMITIVES.colors.gray[500],
    inverse: PRIMITIVES.colors.black,
    link: PRIMITIVES.colors.yellow[500],
  },

  accent: {
    primary: PRIMITIVES.colors.yellow[500],
    primaryHover: PRIMITIVES.colors.yellow[400],
    primaryActive: PRIMITIVES.colors.yellow[600],
    onPrimary: PRIMITIVES.colors.black,
    subtle: "rgba(234, 179, 8, 0.1)", // yellow-500/10
  },

  feedback: {
    success: PRIMITIVES.colors.green[500],
    successBg: PRIMITIVES.colors.green[900],
    successText: PRIMITIVES.colors.green[400],
    error: PRIMITIVES.colors.red[500],
    errorBg: PRIMITIVES.colors.red[900],
    errorText: PRIMITIVES.colors.red[400],
    info: PRIMITIVES.colors.blue[500],
    infoBg: PRIMITIVES.colors.blue[900],
    infoText: PRIMITIVES.colors.blue[400],
    warning: PRIMITIVES.colors.yellow[500],
    warningBg: "rgba(234, 179, 8, 0.1)",
  },
};

/**
 * Get theme tokens based on theme name.
 */
export const getTheme = (themeName: "light" | "dark"): SemanticTokens => {
  return themeName === "dark" ? DARK_THEME : LIGHT_THEME;
};
