# ApunTiti Project Rules

## 🎯 General Description

ApunTiti is a work shift tracking application (time tracker) built with React, TypeScript, and Tailwind CSS. Its goal is to record, visualize, and analyze work shifts with a system of categories, hour types, and automatic earnings calculation.

---

## 📚 Tech Stack

- **Framework**: React 19 (latest stable version)
- **Language**: TypeScript (TypeScript 5.5+)
- **Build Tool**: Vite 6 (latest version)
- **Styling**: Tailwind CSS v4 (Oxide engine) + CSS Variables System
- **PWA**: Vite Plugin PWA 1.2.0+
- **State Management**: Zustand 5 with `persist` middleware
- **Persistence**: LocalStorage (via Zustand persist middleware)
- **Validation**: Zod 4+ for schemas
- **Animations**: Framer Motion 12+
- **PDF**: jsPDF + jspdf-autotable
- **Excel**: xlsx (SheetJS)
- **i18n**: react-i18next + i18next
- **Virtualization**: react-window + react-virtualized-auto-sizer

---

## 🏗️ Folder Architecture

```
src/
├── components/              # React Components (.tsx)
│   ├── CalendarView.tsx       # Calendar view with multiple modes
│   ├── ClockView.tsx          # Shift registration view and monthly summary
│   ├── Header.tsx             # Top navigation bar with live date/time
│   ├── Icons.tsx              # Individually exported SVG icon components
│   ├── SettingsView.tsx       # Settings view (categories, hour types, backup)
│   ├── UI.tsx                 # Reusable UI components (Button, Card, Input, Select, Toast)
│   ├── Views.tsx              # Index file for exporting main views
│   ├── ErrorBoundary.tsx      # Error boundary for error handling
│   └── calendar/              # Calendar sub-components
│       ├── CalendarDayView.tsx
│       ├── CalendarWeekView.tsx
│       ├── CalendarMonthView.tsx
│       ├── CalendarYearView.tsx
│       ├── CalendarRangeView.tsx
│       ├── FilterDropdown.tsx
│       ├── SummaryCard.tsx
│       └── index.ts           # Barrel export
├── hooks/                   # Custom React Hooks (.ts)
│   └── useAnalytics.ts       # Hook for metrics and analytics
├── i18n/                    # Internationalization
│   ├── index.ts              # i18next configuration
│   └── locales/              # Translations
│       ├── es.json             # Spanish (base language)
│       └── en.json             # English
├── store/                   # Zustand Store
│   └── useAppStore.ts        # Global store with persist middleware
├── services/                # External services
│   └── api.ts                # Mock sync service for cloud backup
├── constants/               # Application constants
│   └── app.ts                # Global constants (SPECIAL_CATEGORY, etc.)
├── theme/                   # Centralized style system
│   ├── index.ts               # Barrel export (tokens + styles)
│   ├── styles.ts              # Tailwind classes organized by view (APP_STYLES)
│   └── tokens/                # Atomic design tokens
│       ├── index.ts             # Barrel export of all tokens
│       ├── primitives.ts        # Atomic values (colors, spacing, typography)
│       ├── semantic.ts          # Semantic tokens (surfaces, borders, states)
│       ├── components.ts        # Component variants (BUTTON_VARIANTS, CARD_VARIANTS)
│       └── layout.ts            # Layout tokens (grids, containers)
├── utils/                   # Shared utilities
│   ├── time.ts                # Date/time utilities (parseDateString, calculateDuration)
│   ├── notifications.ts       # Push notification system
│   ├── pdfGenerator.ts        # PDF generation with jsPDF
│   ├── excelGenerator.ts      # Excel generation with xlsx
│   └── validationSchemas.ts   # Zod schemas for validation
├── __tests__/               # Unit tests (Vitest)
├── types.ts                 # Global TypeScript type definitions
├── App.tsx                  # Application root component
├── index.tsx                # React entry point
└── index.css                # Global CSS + theme CSS variables + Tailwind v4
```

---

## 🎨 Style Architecture (CRITICAL)

### Golden Rule: Total Centralization in `APP_STYLES`

**MANDATORY**: NEVER write Tailwind classes directly in JSX/TSX components.

**ALL style classes must be centralized in:**

```typescript
src / theme / styles.ts;
```

### `styles.ts` File Structure

The file must export a typed constant object named `APP_STYLES` organized **exactly** in these 5 sections:

```typescript
export const APP_STYLES = {
  HEADER: {
    // Header styles (navigation, buttons, date/time)
  },
  REGISTRO: {
    // Registration view styles (form, summary, statistics)
  },
  CALENDARIO: {
    // Calendar view styles (grid, cells, view controls)
  },
  CONFIGURACIÓN: {
    // Settings view styles (panels, lists, editing)
  },
  MODOS: {
    // Global styles (app root, containers, generic UI components)
  },
} as const;

export type AppStyles = typeof APP_STYLES;
```

### Usage in Components

```typescript
// CORRECT ✅
import { APP_STYLES } from "../theme/styles";

<div className={APP_STYLES.HEADER.container}>
  <button className={APP_STYLES.HEADER.navButton}>...</button>
</div>

// INCORRECT ❌
<div className="bg-white dark:bg-black p-4">
  <button className="px-4 py-2 bg-yellow-500">...</button>
</div>
```

### Combining Classes

When you need to combine classes (e.g., dynamically or with additional styles):

```typescript
// Using template literals to combine APP_STYLES classes
const buttonClasses = `${APP_STYLES.MODOS.uiButtonBase} ${
  isActive
    ? APP_STYLES.HEADER.navButtonActive
    : APP_STYLES.HEADER.navButtonInactive
}`;
```

---

## 💻 TypeScript Code Conventions

### Functional Components (MANDATORY)

**ALWAYS use functional components with TypeScript**. DO NOT use class components.

```typescript
// CORRECT ✅
import React from "react";

interface MyComponentProps {
  title: string;
  count: number;
  onAction: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  count,
  onAction,
}) => {
  // Implementation
  return <div>...</div>;
};

export default MyComponent;
```

### Strict Typing

- **All props must have an explicit interface** with a descriptive name ending in `Props`
- **All hooks must type their state**: `useState<Type>(initialValue)`
- **Helper functions must have explicit parameter and return types**
- TypeScript is configured in `strict` mode (see `tsconfig.json`)

```typescript
// Example of typing in hooks
const [shifts, setShifts] = useState<Shift[]>([]);
const [notification, setNotification] = useState<Notification | null>(null);

// Example of typed helper function
const calculateDuration = (start: string, end: string): number => {
  // Implementation
};
```

### Import Order

```typescript
// 1. React and external libraries
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// 2. Local types
import { View, Theme, Shift, Settings } from "./types";

// 3. Components
import Header from "./components/Header";
import { ClockView, CalendarView } from "./components/Views";

// 4. Custom hooks
import { useAppStore } from "./store/useAppStore";
import { useAnalytics } from "./hooks/useAnalytics";

// 5. Styles (always at the end of code imports)
import { APP_STYLES } from "./theme/styles";
```

---

## 🚫 Debugging and Production Rules

### DO NOT LEAVE `console.log`

**CRITICAL**: Before committing, **remove ALL `console.log`** from the code.

```typescript
// INCORRECT ❌
console.log("Debugging shifts:", shifts);

// CORRECT ✅
// If you need temporary debug, use comments:
// console.log("Debugging shifts:", shifts);
// And remove it before committing
```

**Allowed exceptions**:

- `console.error()` in error handling catch blocks
- Development logs wrapped in conditions:
  ```typescript
  if (import.meta.env.DEV) {
    console.log("Dev mode log");
  }
  ```

---

## 🌐 Internationalization (i18n)

### Structure

- Configuration: `src/i18n/index.ts`
- Translations: `src/i18n/locales/{lang}.json`
- Supported languages: Spanish (es), English (en)

### Usage in Components

```typescript
import { useTranslation } from "react-i18next";

const MyComponent = () => {
  const { t } = useTranslation();
  return <h1>{t("settings.title")}</h1>;
};
```

### Adding Translations

When adding new texts, always:

1. Add the key in `es.json` first (base language)
2. Add the equivalent translation in `en.json`
3. Use nested semantic keys: `section.subsection.text`

```json
// es.json
{
  "settings": {
    "title": "Configuración",
    "categories": "Categorías"
  }
}
```

---

## 🎣 Global State with Zustand

### Main Store: `useAppStore`

**Location**: `src/store/useAppStore.ts`

The application's global state is managed with **Zustand 5** using the `persist` middleware:

```typescript
import { useAppStore } from "../store/useAppStore";

// In components - get state
const shifts = useAppStore((state) => state.shifts);
const settings = useAppStore((state) => state.settings);
const theme = useAppStore((state) => state.theme);

// Get actions
const setShifts = useAppStore((state) => state.setShifts);
const updateSettings = useAppStore((state) => state.updateSettings);
const notify = useAppStore((state) => state.notify);

// Or destructure multiple selectors
const { shifts, settings, setShifts, notify } = useAppStore();
```

### Persisted State

The store automatically persists in `localStorage` under the key `apuntiti-storage`:

- `shifts` - Array of registered shifts
- `settings` - Configuration (categories, hour types, format)
- `theme` - Current theme (light/dark)

**NOT persisted**: `notification`, `syncStatus`

### Available Actions

```typescript
interface AppState {
  // State
  shifts: Shift[];
  settings: Settings;
  theme: Theme;
  notification: Notification | null;
  syncStatus: "idle" | "syncing" | "success" | "error";

  // Actions
  setShifts: (shifts: Shift[] | ((prev: Shift[]) => Shift[])) => void;
  addShift: (shift: Shift) => void;
  updateSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  notify: (message: string, type?: "success" | "error" | "info") => void;
  sync: () => Promise<void>;
}
```

### Notification Pattern

Use `notify` from the store instead of props:

```typescript
// CORRECT ✅ - Use notify from store
const notify = useAppStore((state) => state.notify);
notify("Shift saved successfully", "success");
notify("Error deleting shift", "error");
notify("Data imported", "info");

// OBSOLETE ❌ - No longer passed as prop
// <ClockView notify={notify} />
```

---

## 🧩 Reusable UI Components

The file `src/components/UI.tsx` exports base components that **MUST be used** instead of native HTML elements when applicable:

### Available Components

1. **`<Button>`**

   - Variants: `primary` (yellow, default), `secondary` (gray), `danger` (red)
   - Props: extends `HTMLButtonElement`

   ```typescript
   <Button variant="primary" onClick={handleSave}>
     Save
   </Button>
   ```

2. **`<Card>`**

   - Base container with consistent styles

   ```typescript
   <Card className={APP_STYLES.REGISTRO.card}>...</Card>
   ```

3. **`<Input>`**

   - Input with integrated label

   ```typescript
   <Input label="Date" type="date" value={date} onChange={handleChange} />
   ```

4. **`<Select>`**

   - Select with integrated label and custom arrow

   ```typescript
   <Select label="Category">
     <option value="opt1">Option 1</option>
   </Select>
   ```

5. **`<ConfirmDialog>`**

   - Confirmation modal

   ```typescript
   <ConfirmDialog
     isOpen={isOpen}
     title="Confirm Deletion"
     message="Are you sure?"
     onConfirm={handleConfirm}
     onCancel={handleCancel}
   />
   ```

6. **`<Toast>`**
   - Temporary notification (3s auto-dismiss)
   ```typescript
   <Toast notification={notification} onClose={() => setNotification(null)} />
   ```

---

## 🌓 Dark Mode

### Implementation Strategy

- **CSS Class**: Dark mode is activated via the `.dark` class on the `<html>` element
- **Tailwind v4 Configuration**: See `src/index.css` for the custom variant
  ```css
  @variant dark (&:is(.dark *));
  ```

### Toggle Pattern

```typescript
// In App.tsx
const [theme, setTheme] = useLocalStorage<Theme>("theme", Theme.Dark);

useEffect(() => {
  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (theme === Theme.Dark) {
    document.documentElement.classList.add("dark");
    metaThemeColor?.setAttribute("content", "#111111");
  } else {
    document.documentElement.classList.remove("dark");
    metaThemeColor?.setAttribute("content", "#f3f4f6");
  }
}, [theme]);
```

### Usage in Styles

ALWAYS use Tailwind's `dark:` variant in `styles.ts`:

```typescript
// In APP_STYLES
container: "bg-white dark:bg-black text-gray-900 dark:text-white";
```

---

## 📝 Types and Enums

### Global Definitions (src/types.ts)

```typescript
// Enums
export enum View {
  Clock = "CLOCK",
  Calendar = "CALENDAR",
  Settings = "SETTINGS",
}

export enum Theme {
  Light = "light",
  Dark = "dark",
}

export type NotificationType = "success" | "error" | "info";

// Main interfaces
export interface Shift {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes: string;
  category: string;
  hourTypeId?: string; // ID referencing HourType
}

export interface HourType {
  id: string;
  name: string;
  price: number; // Price per hour
}

export interface Settings {
  categories: string[];
  hourTypes: HourType[];
  downloadFormat: "txt" | "pdf";
}

export interface Notification {
  message: string;
  type: NotificationType;
}

export interface BackupData {
  version: number;
  date: string;
  shifts: Shift[];
  settings: Settings;
}
```

---

## 🗂️ Main Component Structure

### App.tsx (Root Component)

- **Responsibilities**:
  - Manage current view (`currentView`: `View.Clock | View.Calendar | View.Settings`)
  - Manage theme (`theme`: `Theme.Light | Theme.Dark`)
  - Manage global data: `shifts`, `settings`
  - Provide `notify` function to child components
  - Render `<Header>`, current view, and `<Toast>`

### Header.tsx

- **Responsibilities**:
  - Display live date and time (update every 1s with `setInterval`)
  - Navigation between views (3 buttons: Clock, Calendar, Settings)
  - Theme toggle (Sun/Moon)
  - Use icons from `Icons.tsx`

### ClockView.tsx

- **Responsibilities**:
  - Shift registration form (date, start/end time, category, hour type, notes)
  - Monthly summary with statistics (total hours, earnings, shifts by category)
  - Monthly navigation (prev/next)
  - Form validations (end time > start time)

### CalendarView.tsx

- **Responsibilities**:
  - 5 viewing modes: Month, Week, Day, Year, Custom Range
  - Calendar grid with visualized shifts
  - Shift CRUD (edit, delete with confirmation modal)
  - Download data as TXT or PDF
  - Print calendar

### SettingsView.tsx

- **Responsibilities**:
  - Category management (CRUD: add, in-place edit, delete)
  - Hour type management (CRUD with name and price)
  - Download format selector (txt/pdf)
  - Backup/Restore (export/import JSON)

### UI.tsx

- **Responsibilities**:
  - Generic and reusable UI components
  - ALL consume classes from `APP_STYLES.MODOS`
  - Components: Button, Card, Input, Select, ConfirmDialog, Toast

### Icons.tsx

- **Responsibilities**:
  - Export individual SVG icon components
  - Use an `IconWrapper` for consistent styles
  - Available icons: `ClockIcon`, `CalendarIcon`, `CogIcon`, `SunIcon`, `MoonIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `TrashIcon`, `PencilIcon`, `CheckIcon`, `XMarkIcon`, `ArrowPathIcon`, `FlagIcon`
  - All accept an optional `className` prop

---

## 🔧 Helper Functions

### Placement Pattern

- **DO NOT create** separate files in `utils/` unless the function is used in 3+ different components
- **Define helpers at the beginning of the component file** that uses them, in a clearly marked section:

```typescript
// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date): string => {
  // Implementation
};

// --- CONSTANTS ---

const monthNamesEN = ["January", "February", ...];

// --- COMPONENT ---

export const MyComponent: React.FC<Props> = () => {
  // Implementation
};
```

### Available Time Utilities

**Location**: `src/utils/time.ts`

This file contains shared utilities for date and time handling:

- `toLocalISOString(date: Date): string` - Converts Date to 'YYYY-MM-DD' in local timezone
- `calculateDuration(start: string, end: string): number` - Calculates duration in hours (handles overnight and 24h shifts)
- `parseDateString(dateStr: string)` - Parses YYYY-MM-DD date without timezone issues (returns `{year, month, day}`)
- `parseTimeToMinutes(timeStr: string): number` - Converts 'HH:mm' to minutes since midnight
- `formatDuration(hours: number): string` - Formats decimal hours to "8h 30m"

**Use these functions instead of reimplementing them** when needed.

---

## 📅 Date Handling

### ⚠️ IMPORTANT: Avoid Timezone Bug

**DO NOT use** `new Date("YYYY-MM-DD")` to parse dates stored as strings:

```typescript
// ❌ INCORRECT - Interprets as UTC midnight, may subtract a day based on timezone
const monthShifts = shifts.filter((s) => {
  const d = new Date(s.date); // BUG: may give incorrect month
  return d.getMonth() === currentMonth;
});

// ✅ CORRECT - Manual parsing without timezone
import { parseDateString } from "../utils/time";

const monthShifts = shifts.filter((s) => {
  const { year, month } = parseDateString(s.date);
  return month === currentMonth && year === currentYear;
});
```

### Standard Format

- **Dates**: String in local ISO format `'YYYY-MM-DD'` (e.g., `'2025-12-18'`)
- **Times**: String in format `'HH:mm'` (e.g., `'09:30'`, `'14:45'`)
- **Month names**: Use `monthNamesES` array in Spanish (or localized)
- **Day names**: Use `dayNamesES` array in Spanish (abbreviated)

### Date/Time Inputs

```typescript
// Date input with clickToEdit for better mobile UX
<Input
  type="date"
  value={date} // 'YYYY-MM-DD'
  onChange={(e) => setDate(e.target.value)}
  clickToEdit // Automatically opens picker on click
/>

// Time input
<Input
  type="time"
  value={time} // 'HH:mm'
  onChange={(e) => setTime(e.target.value)}
  clickToEdit
/>
```

---

## 🔄 Data Flow and Props

### Lifting State Up Pattern

- **Global state**: `shifts`, `settings` live in `App.tsx`
- **Pass only what's needed**: Each view receives only the props it needs

```typescript
// In App.tsx
<ClockView
  shifts={shifts}
  setShifts={setShifts}
  categories={settings.categories}
  hourTypes={settings.hourTypes}
  notify={notify}
/>

<CalendarView
  shifts={shifts}
  setShifts={setShifts}
  hourTypes={settings.hourTypes}
  settings={settings}
  notify={notify}
/>

<SettingsView
  settings={settings}
  setSettings={setSettings}
  shifts={shifts}
  setShifts={setShifts}
  notify={notify}
/>
```

---

## 🎨 Aggressive Theming System

### 3-Layer Architecture

The style system uses an **Aggressive Theming** approach where themes can completely change the visual identity (not just accent colors):

1. **CSS Variables** (`index.css`) - Define values per theme
2. **Tailwind Semantic Classes** (via `@theme` in `index.css`) - Map variables to utilities
3. **APP_STYLES** (`styles.ts`) - Consume only semantic classes

### Theme CSS Variables

```css
/* index.css - Variables defined per theme */
:root[data-theme="basico"] {
  --theme-surface-base: #ffffff;
  --theme-surface-elevated: #f9fafb;
  --theme-text-primary: #1f2937;
  --theme-accent-primary: #eab308;
  --theme-accent-hover: #facc15;
  --theme-accent-on: #000000;
  --theme-radius: 0.5rem;
}

:root[data-theme="rosa-pastel"] {
  --theme-surface-base: #fdf2f8;
  --theme-accent-primary: #f472b6;
  --theme-radius: 1rem;
}
```

### Available Semantic Classes

These utilities are generated in the `@theme` block of `index.css`:

| CSS Variable               | Tailwind Class               | Usage            |
| -------------------------- | ---------------------------- | ---------------- |
| `--theme-surface-base`     | `bg-surface-base`            | Main backgrounds |
| `--theme-surface-elevated` | `bg-surface-elevated`        | Cards, modals    |
| `--theme-text-primary`     | `text-text-primary`          | Primary text     |
| `--theme-text-secondary`   | `text-text-secondary`        | Secondary text   |
| `--theme-accent-primary`   | `bg-accent`, `text-accent`   | Primary accent   |
| `--theme-border-default`   | `border-border`              | Standard borders |
| `--theme-success`          | `text-success`, `bg-success` | Success states   |
| `--theme-error`            | `text-error`, `bg-error`     | Error states     |

### Usage in Styles (MANDATORY)

```typescript
// CORRECT ✅ - Use semantic classes
container: "bg-surface-base text-text-primary border-border";
button: "bg-accent text-accent-on hover:bg-accent-hover";

// INCORRECT ❌ - Hardcoded classes
container: "bg-white dark:bg-black text-gray-900 dark:text-white";
button: "bg-yellow-500 text-black hover:bg-yellow-600";
```

### Adding a New Theme

1. Add config in `types.ts`:

```typescript
export const COLOR_THEMES: ColorThemeConfig[] = [
  { id: "new-theme", name: "New Theme", preview: "#hexcolor" },
];
```

2. Define variables in `index.css` (light and dark):

```css
:root[data-theme="new-theme"] {
  /* light mode variables */
}
:root.dark[data-theme="new-theme"] {
  /* dark mode overrides */
}
```

---

## 🚀 Build and Deploy

### Available Scripts

```json
{
  "dev": "vite", // Development server
  "build": "tsc && vite build", // Production build (with TS validation)
  "preview": "vite preview" // Preview production build
}
```

### Pre-commit Checklist

Before committing, verify:

- ✅ **NO `console.log` in the code**
- ✅ **TypeScript compiles without errors** (`npm run build` successful)
- ✅ **All Tailwind classes are in `APP_STYLES`** (not hard-coded in JSX)
- ✅ **All components are functional** (no class components)
- ✅ **Props are typed** with `XxxProps` interfaces
- ✅ **Dark mode works correctly** in all new components

---

## 🔐 Refactoring Rules

1. **Business logic is sacred**:

   - DO NOT modify calculations for hours, duration, earnings
   - DO NOT change data format in localStorage
   - Only move code if it improves organization WITHOUT changing behavior

2. **Maintain component structure**:

   - DO NOT merge large components without reason
   - DO NOT create new components for trivial UI (1-2 lines)
   - Reuse components from `UI.tsx` when applicable

3. **JSX cleanup**:
   - Extract long class strings to `APP_STYLES`
   - DO NOT overuse unnecessary wrapper components
   - Prefer readability over excessive abstraction

---

## 📖 Code Documentation

### JSDoc (Optional but Recommended)

For complex components or non-obvious helpers:

```typescript
/**
 * Calculates the duration in hours between two times in HH:mm format.
 * @param start - Start time (format 'HH:mm')
 * @param end - End time (format 'HH:mm')
 * @returns Duration in hours (decimal number)
 */
const calculateDuration = (start: string, end: string): number => {
  // ...
};
```

### Comments in Code

- **Section comments**: In uppercase, with dashes

  ```typescript
  // --- HELPER FUNCTIONS ---
  // --- COMPONENT ---
  // --- HANDLERS ---
  ```

- **Inline comments**: Explain the "why", not the "what"
  ```typescript
  // Avoid multiple occurrences when editing categories with the same name
  if (settings.categories.filter((c) => c === newCategoryName).length > 1) {
    // ...
  }
  ```

---

## 🧪 Testing

### Testing Infrastructure

- **Unit Tests**: Vitest 4.x + Testing Library
- **E2E Tests**: Playwright
- **Accessibility**: @axe-core/playwright

### Available Scripts

```bash
npm run test        # Run tests once
npm run test:watch  # Tests in watch mode
```

### Test Structure

```
src/__tests__/              # Unit tests for logic
├── CalendarView.test.tsx
├── ClockView.test.tsx
└── useAppStore.test.ts

src/components/UI.test.tsx  # UI component tests

tests/                      # E2E tests with Playwright
└── *.spec.ts
```

### Testing Priorities

1. **Critical**: Business logic (`utils/time.ts`, store actions)
2. **High**: Form and validation components
3. **Medium**: User flows (E2E)

---

## 🌐 PWA (Progressive Web App)

- **Plugin**: `vite-plugin-pwa` configured in `vite.config.ts`
- **Icons**: Defined in `src/icons.json` and located in `public/icons/`
- **Manifest**: Auto-generated by the PWA plugin
- **Service Worker**: Automatically generated on build

---

## 📌 Naming Conventions

### Files

- **Components**: PascalCase with `.tsx` extension (e.g., `ClockView.tsx`, `Header.tsx`)
- **Hooks**: camelCase with `.ts` extension, `use` prefix (e.g., `useLocalStorage.ts`)
- **Types**: camelCase `.ts` (e.g., `types.ts`)
- **Styles**: camelCase `.ts` or `.css` (e.g., `styles.ts`, `index.css`)

### Variables and Functions

- **Components**: PascalCase (e.g., `const ClockView: React.FC = ...`)
- **Hooks**: camelCase, `use` prefix (e.g., `const useLocalStorage = ...`)
- **Helper functions**: camelCase (e.g., `calculateDuration`, `toLocalISOString`)
- **Constants**: camelCase or UPPER_SNAKE_CASE depending on context
  - Data arrays: camelCase (e.g., `monthNamesES`, `dayNamesES`)
  - Configuration: UPPER_SNAKE_CASE (e.g., `APP_STYLES`)

### Props and State

- **Props**: camelCase (e.g., `currentView`, `setShifts`, `hourTypes`)
- **State**: camelCase (e.g., `const [isOpen, setIsOpen] = useState(false)`)
- **Handlers**: `handle` prefix (e.g., `handleSave`, `handleDelete`, `handlePrevMonth`)

---

## ⚠️ Common Mistakes to Avoid

1. ❌ **Tailwind classes in JSX** → ✅ Use `APP_STYLES`
2. ❌ **`console.log` in code** → ✅ Remove before commit
3. ❌ **Class components** → ✅ Functional components with hooks
4. ❌ **Untyped props** → ✅ Explicit interfaces with `xxxProps`
5. ❌ **Helpers in unnecessary separate files** → ✅ Define in the component that uses them
6. ❌ **Modifying business logic without reason** → ✅ Respect existing calculations and formats
7. ❌ **Forgetting dark mode in new styles** → ✅ Always include `dark:` variant

---

## 🎯 Summary of CRITICAL Rules

1. ✅ **ALL CSS goes in `APP_STYLES`** (`src/theme/styles.ts`)
2. ✅ **DO NOT leave `console.log`** in production code
3. ✅ **Functional components ALWAYS** (no class components)
4. ✅ **Strict TypeScript** (typed props, typed state)
5. ✅ **Dark mode** in all styles (`dark:` variant)
6. ✅ **Reuse UI components** from `UI.tsx`
7. ✅ **Respect 5-section structure** in `APP_STYLES`
8. ✅ **LocalStorage for persistence** (with custom hook)
9. ✅ **Notifications with Toast** (`notify()` pattern)
10. ✅ **TypeScript validation before commit** (`npm run build`)

---

## 📞 Contact and Contributions

This file should be updated when:

- New sections are added to `APP_STYLES`
- New custom hooks are created
- Global types in `types.ts` are modified
- New design patterns are established
- New dependencies are added to the project

**Author**: AngieVik
**Project**: ApunTiti - Time Tracker PWA
**Last updated**: 2025-12-22
