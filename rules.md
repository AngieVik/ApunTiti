# Reglas del Proyecto ApunTiti

## 🎯 Descripción General

ApunTiti es una aplicación de seguimiento de turnos de trabajo (time tracker) construida con React, TypeScript y Tailwind CSS. Su objetivo es registrar, visualizar y analizar turnos laborales con un sistema de categorías, tipos de horas y cálculo automático de ganancias.

---

## 📚 Tech Stack

- **Framework**: React 19 (última versión estable)
- **Lenguaje**: TypeScript (TypeScript 5.5+)
- **Build Tool**: Vite 6 (última versión)
- **Styling**: Tailwind CSS v4 (Oxide engine) + Sistema de CSS Variables
- **PWA**: Vite Plugin PWA 1.2.0+
- **Gestión de Estado**: Zustand 5 con middleware `persist`
- **Persistencia**: LocalStorage (via Zustand persist middleware)
- **Validación**: Zod 4+ para schemas
- **Animaciones**: Framer Motion 12+
- **PDF**: jsPDF + jspdf-autotable
- **Virtualización**: react-window + react-virtualized-auto-sizer

---

## 🏗️ Arquitectura de Carpetas

```
src/
├── components/              # Componentes React (.tsx)
│   ├── CalendarView.tsx       # Vista de calendario con múltiples modos
│   ├── ClockView.tsx          # Vista de registro de turnos y resumen mensual
│   ├── Header.tsx             # Barra de navegación superior con fecha/hora en vivo
│   ├── Icons.tsx              # Componentes de iconos SVG exportados individualmente
│   ├── SettingsView.tsx       # Vista de configuración (categorías, tipos de hora, backup)
│   ├── UI.tsx                 # Componentes UI reutilizables (Button, Card, Input, Select, Toast)
│   ├── Views.tsx              # Archivo de índice para exportar vistas principales
│   ├── ErrorBoundary.tsx      # Error boundary para manejo de errores
│   └── calendar/              # Sub-componentes de calendario
│       ├── CalendarDayView.tsx
│       ├── CalendarWeekView.tsx
│       ├── CalendarMonthView.tsx
│       ├── CalendarYearView.tsx
│       ├── CalendarRangeView.tsx
│       ├── FilterDropdown.tsx
│       ├── SummaryCard.tsx
│       └── index.ts           # Barrel export
├── hooks/                   # Custom React Hooks (.ts)
│   ├── useLocalStorage.ts    # Hook legacy para sincronizar con localStorage
│   └── useAnalytics.ts       # Hook para métricas y análisis
├── store/                   # Zustand Store
│   └── useAppStore.ts        # Store global con persist middleware
├── services/                # Servicios externos
│   └── api.ts                # Mock sync service para cloud backup
├── constants/               # Constantes de la aplicación
│   └── app.ts                # Constantes globales (SPECIAL_CATEGORY, etc.)
├── theme/                   # Sistema de estilos centralizado
│   ├── index.ts               # Barrel export (tokens + styles)
│   ├── styles.ts              # Clases Tailwind organizadas por vista (APP_STYLES)
│   └── tokens/                # Design tokens atómicos
│       ├── index.ts             # Barrel export de todos los tokens
│       ├── primitives.ts        # Valores atómicos (colores, espaciado, tipografía)
│       ├── semantic.ts          # Tokens semánticos (surfaces, borders, states)
│       ├── components.ts        # Variantes de componentes (BUTTON_VARIANTS, CARD_VARIANTS)
│       └── layout.ts            # Tokens de layout (grids, containers)
├── utils/                   # Utilidades compartidas
│   ├── time.ts                # Utilidades de fecha/hora (parseDateString, calculateDuration)
│   ├── notifications.ts       # Sistema de notificaciones push
│   ├── pdfGenerator.ts        # Generación de PDF con jsPDF
│   └── validationSchemas.ts   # Schemas Zod para validación
├── __tests__/               # Tests unitarios (Vitest)
├── types.ts                 # Definiciones de tipos TypeScript globales
├── App.tsx                  # Componente raíz de la aplicación
├── index.tsx                # Punto de entrada de React
└── index.css                # CSS global + CSS variables de temas + Tailwind v4
```

---

## 🎨 Arquitectura de Estilos (CRÍTICO)

### Regla de Oro: Centralización Total en `APP_STYLES`

**OBLIGATORIO**: NUNCA escribir clases de Tailwind directamente en los componentes JSX/TSX.

**TODAS las clases de estilo deben estar centralizadas en:**

```typescript
src / theme / styles.ts;
```

### Estructura del Archivo `styles.ts`

El archivo debe exportar un objeto constante tipado llamado `APP_STYLES` organizado **exactamente** en estas 5 secciones:

```typescript
export const APP_STYLES = {
  HEADER: {
    // Estilos del header (navegación, botones, fecha/hora)
  },
  REGISTRO: {
    // Estilos de la vista de registro (formulario, resumen, estadísticas)
  },
  CALENDARIO: {
    // Estilos de la vista de calendario (grid, celdas, controles de vista)
  },
  CONFIGURACIÓN: {
    // Estilos de la vista de configuración (paneles, listas, edición)
  },
  MODOS: {
    // Estilos globales (app root, contenedores, componentes UI genéricos)
  },
} as const;

export type AppStyles = typeof APP_STYLES;
```

### Uso en Componentes

```typescript
// CORRECTO ✅
import { APP_STYLES } from "../theme/styles";

<div className={APP_STYLES.HEADER.container}>
  <button className={APP_STYLES.HEADER.navButton}>...</button>
</div>

// INCORRECTO ❌
<div className="bg-white dark:bg-black p-4">
  <button className="px-4 py-2 bg-yellow-500">...</button>
</div>
```

### Combinación de Clases

Cuando necesites combinar clases (ej. dinámicamente o con estilos adicionales):

```typescript
// Uso de template literals para combinar clases de APP_STYLES
const buttonClasses = `${APP_STYLES.MODOS.uiButtonBase} ${
  isActive
    ? APP_STYLES.HEADER.navButtonActive
    : APP_STYLES.HEADER.navButtonInactive
}`;
```

---

## 💻 Convenciones de Código TypeScript

### Componentes Funcionales (OBLIGATORIO)

**SIEMPRE usar componentes funcionales con TypeScript**. NO usar class components.

```typescript
// CORRECTO ✅
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
  // Implementación
  return <div>...</div>;
};

export default MyComponent;
```

### Tipado Estricto

- **Todas las props deben tener una interfaz** explícita con nombre descriptivo terminado en `Props`
- **Todos los hooks deben tipar su estado**: `useState<Type>(initialValue)`
- **Las funciones helper deben tener tipos de parámetros y retorno explícitos**
- TypeScript está configurado en modo `strict` (ver `tsconfig.json`)

```typescript
// Ejemplo de tipado en hooks
const [shifts, setShifts] = useState<Shift[]>([]);
const [notification, setNotification] = useState<Notification | null>(null);

// Ejemplo de función helper tipada
const calculateDuration = (start: string, end: string): number => {
  // Implementación
};
```

### Orden de Imports

```typescript
// 1. React y librerías externas
import React, { useState, useEffect, useMemo } from "react";

// 2. Types locales
import { View, Theme, Shift, Settings } from "./types";

// 3. Componentes
import Header from "./components/Header";
import { ClockView, CalendarView } from "./components/Views";

// 4. Hooks personalizados
import useLocalStorage from "./hooks/useLocalStorage";

// 5. Estilos (siempre al final de los imports de código)
import { APP_STYLES } from "./theme/styles";
```

---

## 🚫 Reglas de Depuración y Producción

### NO DEJAR `console.log`

**CRÍTICO**: Antes de hacer commit, **eliminar TODOS los `console.log`** del código.

```typescript
// INCORRECTO ❌
console.log("Debugging shifts:", shifts);

// CORRECTO ✅
// Si necesitas debug temporal, usar comentarios:
// console.log("Debugging shifts:", shifts);
// Y eliminarlo antes de commit
```

**Excepciones permitidas**:

- `console.error()` en bloques catch de manejo de errores
- Logs en desarrollo que estén envueltos en condiciones:
  ```typescript
  if (import.meta.env.DEV) {
    console.log("Dev mode log");
  }
  ```

---

## 🎣 Estado Global con Zustand

### Store Principal: `useAppStore`

**Ubicación**: `src/store/useAppStore.ts`

El estado global de la aplicación se gestiona con **Zustand 5** usando el middleware `persist`:

```typescript
import { useAppStore } from "../store/useAppStore";

// En componentes - obtener estado
const shifts = useAppStore((state) => state.shifts);
const settings = useAppStore((state) => state.settings);
const theme = useAppStore((state) => state.theme);

// Obtener acciones
const setShifts = useAppStore((state) => state.setShifts);
const updateSettings = useAppStore((state) => state.updateSettings);
const notify = useAppStore((state) => state.notify);

// O desestructurar múltiples selectores
const { shifts, settings, setShifts, notify } = useAppStore();
```

### Estado Persistido

El store persiste automáticamente en `localStorage` bajo la clave `apuntiti-storage`:

- `shifts` - Array de turnos registrados
- `settings` - Configuración (categorías, tipos de hora, formato)
- `theme` - Tema actual (light/dark)

**NO se persiste**: `notification`, `syncStatus`

### Acciones Disponibles

```typescript
interface AppState {
  // Estado
  shifts: Shift[];
  settings: Settings;
  theme: Theme;
  notification: Notification | null;
  syncStatus: "idle" | "syncing" | "success" | "error";

  // Acciones
  setShifts: (shifts: Shift[] | ((prev: Shift[]) => Shift[])) => void;
  addShift: (shift: Shift) => void;
  updateSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  notify: (message: string, type?: "success" | "error" | "info") => void;
  sync: () => Promise<void>;
}
```

### Pattern de Notificaciones

Usar `notify` del store en lugar de props:

```typescript
// CORRECTO ✅ - Usar notify del store
const notify = useAppStore((state) => state.notify);
notify("Turno guardado correctamente", "success");
notify("Error al eliminar turno", "error");
notify("Datos importados", "info");

// OBSOLETO ❌ - Ya no se pasa como prop
// <ClockView notify={notify} />
```

---

## 🧩 Componentes UI Reutilizables

El archivo `src/components/UI.tsx` exporta componentes base que **DEBEN usarse** en lugar de elementos HTML nativos cuando apliquen:

### Componentes Disponibles

1. **`<Button>`**

   - Variantes: `primary` (amarillo, default), `secondary` (gris), `danger` (rojo)
   - Props: extends `HTMLButtonElement`

   ```typescript
   <Button variant="primary" onClick={handleSave}>
     Guardar
   </Button>
   ```

2. **`<Card>`**

   - Container base con estilos consistentes

   ```typescript
   <Card className={APP_STYLES.REGISTRO.card}>...</Card>
   ```

3. **`<Input>`**

   - Input con label integrado

   ```typescript
   <Input label="Fecha" type="date" value={date} onChange={handleChange} />
   ```

4. **`<Select>`**

   - Select con label integrado y flecha personalizada

   ```typescript
   <Select label="Categoría">
     <option value="opt1">Opción 1</option>
   </Select>
   ```

5. **`<ConfirmDialog>`**

   - Modal de confirmación

   ```typescript
   <ConfirmDialog
     isOpen={isOpen}
     title="Confirmar Eliminación"
     message="¿Estás seguro?"
     onConfirm={handleConfirm}
     onCancel={handleCancel}
   />
   ```

6. **`<Toast>`**
   - Notificación temporal (3s auto-dismiss)
   ```typescript
   <Toast notification={notification} onClose={() => setNotification(null)} />
   ```

---

## 🌓 Dark Mode

### Estrategia de Implementación

- **Clase CSS**: Dark mode se activa mediante la clase `.dark` en el elemento `<html>`
- **Configuración Tailwind v4**: Ver `src/index.css` para la variant personalizada
  ```css
  @variant dark (&:is(.dark *));
  ```

### Patrón de Toggle

```typescript
// En App.tsx
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

### Uso en Estilos

SIEMPRE usar la variante `dark:` de Tailwind en `styles.ts`:

```typescript
// En APP_STYLES
container: "bg-white dark:bg-black text-gray-900 dark:text-white";
```

---

## 📝 Tipos y Enums

### Definiciones Globales (src/types.ts)

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

// Interfaces principales
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
  price: number; // Precio por hora
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

## 🗂️ Estructura de Componentes Principales

### App.tsx (Root Component)

- **Responsabilidades**:
  - Gestionar vista actual (`currentView`: `View.Clock | View.Calendar | View.Settings`)
  - Gestionar tema (`theme`: `Theme.Light | Theme.Dark`)
  - Gestionar datos globales: `shifts`, `settings`
  - Proporcionar función `notify` a componentes hijos
  - Renderizar `<Header>`, vista actual y `<Toast>`

### Header.tsx

- **Responsabilidades**:
  - Mostrar fecha y hora en vivo (actualización cada 1s con `setInterval`)
  - Navegación entre vistas (3 botones: Clock, Calendar, Settings)
  - Toggle de tema (Sol/Luna)
  - Usar iconos de `Icons.tsx`

### ClockView.tsx

- **Responsabilidades**:
  - Formulario de registro de turnos (fecha, hora inicio/fin, categoría, tipo de hora, notas)
  - Resumen mensual con estadísticas (horas totales, ganancias, turnos por categoría)
  - Navegación mensual (prev/next)
  - Validaciones de formulario (hora fin > hora inicio)

### CalendarView.tsx

- **Responsabilidades**:
  - 5 modos de visualización: Mes, Semana, Día, Año, Rango personalizado
  - Grid de calendario con turnos visualizados
  - CRUD de turnos (editar, eliminar con modal de confirmación)
  - Descargar datos en TXT o PDF
  - Impresión del calendario

### SettingsView.tsx

- **Responsabilidades**:
  - Gestión de categorías (CRUD: agregar, editar in-place, eliminar)
  - Gestión de tipos de hora (CRUD con nombre y precio)
  - Selector de formato de descarga (txt/pdf)
  - Backup/Restore (exportar/importar JSON)

### UI.tsx

- **Responsabilidades**:
  - Componentes UI genéricos y reutilizables
  - TODOS consumen clases de `APP_STYLES.MODOS`
  - Componentes: Button, Card, Input, Select, ConfirmDialog, Toast

### Icons.tsx

- **Responsabilidades**:
  - Exportar componentes de iconos SVG individuales
  - Usar un wrapper `IconWrapper` para estilos consistentes
  - Iconos disponibles: `ClockIcon`, `CalendarIcon`, `CogIcon`, `SunIcon`, `MoonIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `TrashIcon`, `PencilIcon`, `CheckIcon`, `XMarkIcon`, `ArrowPathIcon`, `FlagIcon`
  - Todos aceptan prop `className` opcional

---

## 🔧 Funciones Helper

### Patrón de Colocación

- **NO crear** archivos separados en `utils/` a menos que la función se use en 3+ componentes diferentes
- **Definir helpers al inicio del archivo del componente** que los usa, en una sección claramente marcada:

```typescript
// --- HELPER FUNCTIONS ---

const toLocalISOString = (date: Date): string => {
  // Implementación
};

// --- CONSTANTS ---

const monthNamesES = ["Enero", "Febrero", ...];

// --- COMPONENT ---

export const MyComponent: React.FC<Props> = () => {
  // Implementación
};
```

### Utilidades de Tiempo Disponibles

**Ubicación**: `src/utils/time.ts`

Este archivo contiene utilidades compartidas para manejo de fechas y tiempos:

- `toLocalISOString(date: Date): string` - Convierte Date a 'YYYY-MM-DD' en zona local
- `calculateDuration(start: string, end: string): number` - Calcula duración en horas (maneja turnos nocturnos y de 24h)
- `parseDateString(dateStr: string)` - Parsea fecha YYYY-MM-DD sin problemas de zona horaria (retorna `{year, month, day}`)
- `parseTimeToMinutes(timeStr: string): number` - Convierte 'HH:mm' a minutos desde medianoche
- `formatDuration(hours: number): string` - Formatea horas decimales a "8h 30m"

**Usar estas funciones en lugar de reimplementarlas** cuando sea necesario.

---

## 📅 Manejo de Fechas

### ⚠️ IMPORTANTE: Evitar Bug de Zona Horaria

**NO usar** `new Date("YYYY-MM-DD")` para parsear fechas almacenadas en strings:

```typescript
// ❌ INCORRECTO - Interpreta como UTC medianoche, puede restar un día según zona horaria
const monthShifts = shifts.filter((s) => {
  const d = new Date(s.date); // BUG: puede dar mes incorrecto
  return d.getMonth() === currentMonth;
});

// ✅ CORRECTO - Parsing manual sin zona horaria
import { parseDateString } from "../utils/time";

const monthShifts = shifts.filter((s) => {
  const { year, month } = parseDateString(s.date);
  return month === currentMonth && year === currentYear;
});
```

### Formato Estándar

- **Fechas**: String en formato ISO local `'YYYY-MM-DD'` (ej. `'2025-12-18'`)
- **Horas**: String en formato `'HH:mm'` (ej. `'09:30'`, `'14:45'`)
- **Nombres de meses**: Usar array `monthNamesES` en español
- **Nombres de días**: Usar array `dayNamesES` en español (abreviados)

### Inputs de Fecha/Hora

```typescript
// Input de fecha con clickToEdit para mejor UX móvil
<Input
  type="date"
  value={date} // 'YYYY-MM-DD'
  onChange={(e) => setDate(e.target.value)}
  clickToEdit // Abre picker automáticamente al hacer click
/>

// Input de hora
<Input
  type="time"
  value={time} // 'HH:mm'
  onChange={(e) => setTime(e.target.value)}
  clickToEdit
/>
```

---

## 🔄 Flujo de Datos y Props

### Pattern de Lifting State Up

- **Estado global**: `shifts`, `settings` viven en `App.tsx`
- **Pasar solo lo necesario**: Cada vista recibe solo las props que necesita

```typescript
// En App.tsx
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

## 🎨 Sistema de Aggressive Theming

### Arquitectura de 3 Capas

El sistema de estilos usa un enfoque de **Aggressive Theming** donde los temas pueden cambiar completamente la identidad visual (no solo colores de acento):

1. **CSS Variables** (`index.css`) - Definen valores por tema
2. **Tailwind Semantic Classes** (via `@theme` en `index.css`) - Mapean variables a utilidades
3. **APP_STYLES** (`styles.ts`) - Consumen únicamente clases semánticas

### CSS Variables de Tema

```css
/* index.css - Variables definidas por tema */
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

### Clases Semánticas Disponibles

Estas utilidades se generan en el bloque `@theme` de `index.css`:

| CSS Variable               | Clase Tailwind               | Uso                |
| -------------------------- | ---------------------------- | ------------------ |
| `--theme-surface-base`     | `bg-surface-base`            | Fondos principales |
| `--theme-surface-elevated` | `bg-surface-elevated`        | Cards, modales     |
| `--theme-text-primary`     | `text-text-primary`          | Texto principal    |
| `--theme-text-secondary`   | `text-text-secondary`        | Texto secundario   |
| `--theme-accent-primary`   | `bg-accent`, `text-accent`   | Acento principal   |
| `--theme-border-default`   | `border-border`              | Bordes estándar    |
| `--theme-success`          | `text-success`, `bg-success` | Estados de éxito   |
| `--theme-error`            | `text-error`, `bg-error`     | Estados de error   |

### Uso en Estilos (OBLIGATORIO)

```typescript
// CORRECTO ✅ - Usar clases semánticas
container: "bg-surface-base text-text-primary border-border";
button: "bg-accent text-accent-on hover:bg-accent-hover";

// INCORRECTO ❌ - Clases hardcoded
container: "bg-white dark:bg-black text-gray-900 dark:text-white";
button: "bg-yellow-500 text-black hover:bg-yellow-600";
```

### Agregar Nuevo Tema

1. Agregar config en `types.ts`:

```typescript
export const COLOR_THEMES: ColorThemeConfig[] = [
  { id: "nuevo-tema", name: "Nuevo Tema", preview: "#hexcolor" },
];
```

2. Definir variables en `index.css` (light y dark):

```css
:root[data-theme="nuevo-tema"] {
  /* light mode variables */
}
:root.dark[data-theme="nuevo-tema"] {
  /* dark mode overrides */
}
```

---

## 🚀 Build y Deploy

### Scripts Disponibles

```json
{
  "dev": "vite", // Servidor de desarrollo
  "build": "tsc && vite build", // Build de producción (con validación TS)
  "preview": "vite preview" // Preview del build de producción
}
```

### Pre-commit Checklist

Antes de hacer commit, verificar:

- ✅ **NO hay `console.log` en el código**
- ✅ **TypeScript compila sin errores** (`npm run build` exitoso)
- ✅ **Todas las clases Tailwind están en `APP_STYLES`** (no hard-coded en JSX)
- ✅ **Todos los componentes son funcionales** (no class components)
- ✅ **Props están tipadas** con interfaces `XxxProps`
- ✅ **Dark mode funciona correctamente** en todos los componentes nuevos

---

## 🔐 Reglas de Refactorización

1. **Lógica de negocio es sagrada**:

   - NO modificar cálculos de horas, duración, ganancias
   - NO cambiar el formato de datos en localStorage
   - Solo mover código si mejora la organización SIN cambiar comportamiento

2. **Mantener estructura de componentes**:

   - NO fusionar componentes grandes sin razón
   - NO crear componentes nuevos para UI trivial (1-2 líneas)
   - Reusar componentes de `UI.tsx` cuando aplique

3. **Limpieza de JSX**:
   - Extraer strings largas de clases a `APP_STYLES`
   - NO abusar de componentes wrapper innecesarios
   - Preferir legibilidad sobre abstracción excesiva

---

## 📖 Documentación de Código

### JSDoc (Opcional pero Recomendado)

Para componentes complejos o helpers no obvios:

```typescript
/**
 * Calcula la duración en horas entre dos tiempos en formato HH:mm.
 * @param start - Hora de inicio (formato 'HH:mm')
 * @param end - Hora de fin (formato 'HH:mm')
 * @returns Duración en horas (número decimal)
 */
const calculateDuration = (start: string, end: string): number => {
  // ...
};
```

### Comentarios en Español

- **Comentarios de secciones**: En mayúsculas, con guiones

  ```typescript
  // --- HELPER FUNCTIONS ---
  // --- COMPONENT ---
  // --- HANDLERS ---
  ```

- **Comentarios inline**: Explicar el "por qué", no el "qué"
  ```typescript
  // Evitar múltiples ocurrencias al editar categorías con el mismo nombre
  if (settings.categories.filter((c) => c === newCategoryName).length > 1) {
    // ...
  }
  ```

---

## 🧪 Testing

### Infraestructura de Tests

- **Unit Tests**: Vitest 4.x + Testing Library
- **E2E Tests**: Playwright
- **Accesibilidad**: @axe-core/playwright

### Scripts Disponibles

```bash
npm run test        # Ejecutar tests una vez
npm run test:watch  # Tests en modo watch
```

### Estructura de Tests

```
src/__tests__/              # Tests unitarios de lógica
├── CalendarView.test.tsx
├── ClockView.test.tsx
└── useAppStore.test.ts

src/components/UI.test.tsx  # Tests de componentes UI

tests/                      # Tests E2E con Playwright
└── *.spec.ts
```

### Prioridades de Testing

1. **Crítico**: Lógica de negocio (`utils/time.ts`, store actions)
2. **Alto**: Componentes de formulario y validación
3. **Medio**: Flujos de usuario (E2E)

---

## 🌐 PWA (Progressive Web App)

- **Plugin**: `vite-plugin-pwa` configurado en `vite.config.ts`
- **Iconos**: Definidos en `src/icons.json` y ubicados en `public/icons/`
- **Manifest**: Auto-generado por el plugin PWA
- **Service Worker**: Generado automáticamente en build

---

## 📌 Convenciones de Nombres

### Archivos

- **Componentes**: PascalCase con extensión `.tsx` (ej. `ClockView.tsx`, `Header.tsx`)
- **Hooks**: camelCase con extensión `.ts`, prefijo `use` (ej. `useLocalStorage.ts`)
- **Tipos**: camelCase `.ts` (ej. `types.ts`)
- **Estilos**: camelCase `.ts` o `.css` (ej. `styles.ts`, `index.css`)

### Variables y Funciones

- **Componentes**: PascalCase (ej. `const ClockView: React.FC = ...`)
- **Hooks**: camelCase, prefijo `use` (ej. `const useLocalStorage = ...`)
- **Funciones helper**: camelCase (ej. `calculateDuration`, `toLocalISOString`)
- **Constantes**: camelCase o UPPER_SNAKE_CASE según contexto
  - Arrays de datos: camelCase (ej. `monthNamesES`, `dayNamesES`)
  - Configuración: UPPER_SNAKE_CASE (ej. `APP_STYLES`)

### Props y State

- **Props**: camelCase (ej. `currentView`, `setShifts`, `hourTypes`)
- **State**: camelCase (ej. `const [isOpen, setIsOpen] = useState(false)`)
- **Handlers**: prefijo `handle` (ej. `handleSave`, `handleDelete`, `handlePrevMonth`)

---

## ⚠️ Errores Comunes a Evitar

1. ❌ **Clases Tailwind en JSX** → ✅ Usar `APP_STYLES`
2. ❌ **`console.log` en código** → ✅ Eliminar antes de commit
3. ❌ **Class components** → ✅ Componentes funcionales con hooks
4. ❌ **Props sin tipar** → ✅ Interfaces explícitas con `xxxProps`
5. ❌ **Helpers en archivos separados innecesarios** → ✅ Definir en el componente que los usa
6. ❌ **Modificar lógica de negocio sin razón** → ✅ Respetar cálculos y formatos existentes
7. ❌ **Olvidar dark mode en nuevos estilos** → ✅ Siempre incluir variante `dark:`

---

## 🎯 Resumen de Reglas CRÍTICAS

1. ✅ **TODO el CSS va en `APP_STYLES`** (`src/theme/styles.ts`)
2. ✅ **NO dejar `console.log`** en el código de producción
3. ✅ **Componentes funcionales SIEMPRE** (no class components)
4. ✅ **TypeScript estricto** (props tipadas, estado tipado)
5. ✅ **Dark mode** en todos los estilos (`dark:` variant)
6. ✅ **Reutilizar componentes UI** de `UI.tsx`
7. ✅ **Respetar estructura de 5 secciones** en `APP_STYLES`
8. ✅ **LocalStorage para persistencia** (con custom hook)
9. ✅ **Notificaciones con Toast** (patrón `notify()`)
10. ✅ **Validación TypeScript antes de commit** (`npm run build`)

---

## 📞 Contacto y Contribuciones

Este archivo debe actualizarse cuando:

- Se agreguen nuevas secciones a `APP_STYLES`
- Se creen nuevos custom hooks
- Se modifiquen tipos globales en `types.ts`
- Se establezcan nuevos patrones de diseño
- Se agreguen nuevas dependencias al proyecto

**Autor**: AngieVik
**Proyecto**: ApunTiti - Time Tracker PWA
**Última actualización**: 2025-12-22
