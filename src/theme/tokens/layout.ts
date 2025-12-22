/**
 * LAYOUT TOKENS: Responsive grid, container, and spacing utilities.
 *
 * @fileoverview Layout system tokens for grids, containers, and responsive patterns.
 */

// ─── CONTAINER SIZES ───────────────────────────────
export const CONTAINERS = {
  /** Main content container max-widths */
  maxWidth: {
    sm: "max-w-screen-sm", // 640px
    md: "max-w-screen-md", // 768px
    lg: "max-w-screen-lg", // 1024px
    xl: "max-w-screen-xl", // 1280px
    prose: "max-w-prose", // 65ch - ideal for reading
    app: "max-w-4xl", // ApunTiti's main container
  },
} as const;

// ─── GRID PATTERNS ─────────────────────────────────
export const GRIDS = {
  /** Form layouts that adapt from 1 to 2 columns */
  form: {
    container: "grid gap-2",
    cols1: "grid-cols-1",
    cols2: "grid-cols-2",
    responsive: "grid-cols-1 sm:grid-cols-2",
  },

  /** Calendar day columns - always 7 days */
  calendar: {
    weekdays: "grid grid-cols-7",
    monthView: "grid grid-cols-7",
    yearView: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  },

  /** Cards/items that expand from 1 to multiple columns */
  cards: {
    responsive: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
  },

  /** Control bar with filters, totals, and buttons */
  controls: {
    container: "grid grid-cols-1 md:grid-cols-3 gap-2 items-start",
    section: "flex flex-col md:flex-row gap-2",
  },
} as const;

// ─── FLEX PATTERNS ─────────────────────────────────
export const FLEX = {
  /** Row with items that wrap */
  rowWrap: "flex flex-wrap gap-2",

  /** Row that stacks on mobile */
  rowToCol: "flex flex-col sm:flex-row gap-2",

  /** Centered items */
  center: "flex items-center justify-center",

  /** Space between items */
  between: "flex items-center justify-between",

  /** Stretch to fill */
  stretch: "flex-1 min-w-0",
} as const;

// ─── RESPONSIVE WIDTHS ─────────────────────────────
// Use Tailwind's spacing scale instead of arbitrary values
export const WIDTHS = {
  /** Minimum widths using Tailwind tokens */
  min: {
    touch: "min-w-10", // 40px - minimum touch target
    field: "min-w-24", // 96px - form field minimum
    card: "min-w-32", // 128px - card minimum
    dropdown: "min-w-28", // 112px - dropdown minimum
  },

  /** Fixed widths for specific use cases */
  fixed: {
    icon: "w-10 h-10", // Icon button
    badge: "w-fit", // Content-sized
  },

  /** Full width on mobile, auto on desktop */
  fluid: "w-full md:w-auto",
} as const;

// ─── HEIGHT PATTERNS ───────────────────────────────
export const HEIGHTS = {
  /** Calendar cells */
  calendarCell: {
    mobile: "h-16", // 64px
    desktop: "md:h-20", // 80px on md+
    week: "min-h-28 sm:min-h-32", // Week view columns
  },

  /** Input/button heights */
  input: {
    sm: "h-6", // 24px
    md: "h-8", // 32px
    lg: "h-10", // 40px
  },
} as const;

// ─── SPACING PATTERNS ──────────────────────────────
export const SPACING = {
  /** Standard section gaps */
  section: "space-y-2",
  sectionLarge: "space-y-4",

  /** Card internal padding */
  cardPadding: "p-3",
  cardPaddingCompact: "p-2",

  /** Container padding (responsive) */
  containerPadding: "p-2 sm:p-4 lg:p-6",
} as const;

// Type exports
export type ContainerSize = keyof typeof CONTAINERS.maxWidth;
