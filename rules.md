# Reglas del Proyecto ApunTiti

## 🎯 Descripción General

ApunTiti es una aplicación de seguimiento de turnos de trabajo (time tracker) construida con React, TypeScript y Tailwind CSS. Su objetivo es registrar, visualizar y analizar turnos laborales con un sistema de categorías, tipos de horas y cálculo automático de ganancias.

---

## 📚 Tech Stack

- **Framework**: React 19 (última versión estable)
- **Lenguaje**: TypeScript (TypeScript 5.5+)
- **Build Tool**: Vite 6 (última versión)
- **Styling**: Tailwind CSS v4 (Oxide engine)
- **PWA**: Vite Plugin PWA 0.20.5+
- **Gestión de Estado**: React Hooks (useState, useEffect, useMemo, custom hooks)
- **Persistencia**: LocalStorage (con custom hook `useLocalStorage`)

---

## 🏗️ Arquitectura de Carpetas

```
src/
├── components/          # Componentes React (.tsx)
│   ├── CalendarView.tsx   # Vista de calendario con múltiples modos (mes, semana, día, año, rango)
│   ├── ClockView.tsx      # Vista de registro de turnos y resumen mensual
│   ├── Header.tsx         # Barra de navegación superior con fecha/hora en vivo
│   ├── Icons.tsx          # Componentes de iconos SVG exportados individualmente
│   ├── SettingsView.tsx   # Vista de configuración (categorías, tipos de hora, backup)
│   ├── UI.tsx             # Componentes UI reutilizables (Button, Card, Input, Select, Toast, ConfirmDialog)
│   └── Views.tsx          # Archivo de índice para exportar vistas principales
├── hooks/               # Custom React Hooks (.ts)
│   └── useLocalStorage.ts # Hook para sincronizar estado con localStorage
├── theme/               # Sistema de estilos centralizado
│   └── styles.ts          # ÚNICO archivo con TODAS las clases de Tailwind (exporta APP_STYLES)
├── types.ts             # Definiciones de tipos TypeScript globales
├── App.tsx              # Componente raíz de la aplicación
├── index.tsx            # Punto de entrada de React (ReactDOM.render)
├── index.css            # Estilos globales CSS (configuración Tailwind v4, dark mode)
├── icons.json           # Datos de iconos de PWA
└── metadata.json        # Metadatos de la aplicación
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

## 🎣 Hooks y Gestión de Estado

### Custom Hooks

**Custom hook principal**: `useLocalStorage<T>(key: string, initialValue: T)`

- Sincroniza automáticamente el estado de React con `localStorage`
- Escucha cambios del storage API para sincronización multi-tab
- Usado para persistir: theme, shifts, settings

### Hooks Nativos Permitidos

- `useState` - Estado local del componente
- `useEffect` - Efectos secundarios (timers, event listeners, sincronización)
- `useMemo` - Memoización de cálculos costosos
- **NO usar** `useContext`, `useReducer` o estado global complejo (Zustand, Redux) a menos que sea absolutamente necesario

### Pattern de Notificaciones

Usar el sistema de notificaciones Toast integrado:

```typescript
// En componentes principales (App.tsx)
const [notification, setNotification] = useState<Notification | null>(null);

const notify = (message: string, type: NotificationType = "success") => {
  setNotification({ message, type });
};

// Pasar como prop a componentes hijos
<ClockView notify={notify} />;

// Usar en componentes
notify("Turno guardado correctamente", "success");
notify("Error al eliminar turno", "error");
notify("Datos importados", "info");
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

## 🎨 Paleta de Colores y Filosofía Visual

### Colores Principales

- **Acento primario**: `yellow-500` (amarillo intenso para CTAs, botones primarios, highlights)
- **Fondo claro**: `gray-100`, `white`
- **Fondo oscuro**: `black`, `#111`, `#1a1a1a`, `#222`
- **Bordes claros**: `gray-100`, `gray-200`
- **Bordes oscuros**: `white/5`, `white/10`, `gray-800`
- **Texto claro**: `gray-900`, `gray-700`
- **Texto oscuro**: `white`, `gray-100`, `gray-300`
- **Success**: `green-500`, `green-600`
- **Error**: `red-500`, `red-600`
- **Info**: `blue-500`

### Espaciado

- **Container principal**: `p-2 sm:p-4 lg:p-6` (responsive)
- **Cards**: `p-3` (padding interno)
- **Gaps entre elementos**: `gap-2` (default), `gap-1` (compacto)
- **Tamaños de fuente**:
  - Muy pequeño: `text-[9px]`, `text-[10px]`
  - Pequeño: `text-xs` (12px)
  - Normal: `text-sm` (14px)
  - Grande: `text-lg` (18px)

### Tipografía

- **Font family**: System font stack (default de Tailwind)
- **Font weights**:
  - `font-medium` (500) - Texto normal
  - `font-bold` (700) - Etiquetas, badges
  - `font-black` (900) - Títulos destacados
- **Font mono**: Usar `font-mono` para horas, números de duración, precios

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

## 🧪 Testing (Futuro)

**Estado actual**: No hay tests implementados.

**Cuando se implementen**:

- Usar Vitest (integrado con Vite)
- Testing Library para componentes React
- Priorizar tests de lógica de negocio (helpers, cálculos)
- Tests de integración para flujos críticos (guardar turno, calcular ganancias)

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
**Última actualización**: 2025-12-18
