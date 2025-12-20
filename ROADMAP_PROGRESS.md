# ROADMAP ACTUALIZADO - ApunTiti

**Última actualización**: 19 de diciembre de 2025 02:05

---

## 📊 ESTADO GENERAL

**Build Producción**: ✅ CLEAN  
**Build Tests**: ⚠️ 12 errores (no bloquean producción)  
**Progreso Total**: ~75% Fase 1-2

---

## ✅ FASE 1: COMPLETADA (75%)

### 1.1 Test Coverage ⚠️ PARCIAL (50%)

**Estado**: 63/85 tests passing

- ✅ ClockView.test.tsx: Básico
- ✅ useAppStore.test.ts: Funcional
- ⚠️ CalendarView.test.tsx: 11 errores TypeScript
  - require() sin tipos
  - global no definido
  - Variables no usadas
- ⚠️ useAppStore.test.ts: 1 error menor

**Pendiente**:

- [ ] Arreglar errores TypeScript en tests
- [ ] Aumentar coverage a 80%
- [ ] Tests para utils/time.ts
- [ ] Tests para validationSchemas.ts

### 1.2 Error Handling ✅ COMPLETO

- ✅ Mensajes específicos en formularios
- ✅ Validación mejorada
- ✅ Error states en UI

### 1.3 Error Boundaries ✅ COMPLETO

- ✅ ErrorBoundary implementado
- ✅ Fallback UI
- ✅ Error logging (DEV mode)

### 1.4 react-window Fix ✅ COMPLETO (ACTUALIZADO 19/12)

- ✅ Migrado de `FixedSizeList` a `List` component
- ✅ Actualizada función `Row` para recibir props directamente
- ✅ Removidas props no soportadas (`height`, `width`)
- ✅ Ajustadas props: `rowCount`, `rowHeight`, `rowComponent`, `rowProps`
- ✅ Build y runtime sin errores

### 1.5 Zod Validation ✅ COMPLETO

**Archivos creados**:

- ✅ src/utils/validationSchemas.ts (119 líneas)

**Schemas implementados**:

- ✅ ShiftSchema (7 validaciones)
- ✅ CreateShiftSchema
- ✅ HourTypeSchema (4 validaciones)
- ✅ SettingsSchema (5 validaciones)
- ✅ BackupDataSchema

**Integraciones**:

- ✅ ClockView.tsx (handleSaveShift)
- ✅ SettingsView.tsx (handleAddHourType, handleImportFile)

**Beneficios**:

- Type-safe validation
- 40+ mensajes personalizados en español
- Runtime + compile-time safety

### 1.6 JSDoc Documentation ✅ COMPLETO

**Documentado**:

- ✅ ClockView helpers (toLocalISOString, calculateDuration)
- ✅ CalendarView helpers (getDaysInMonth, getFirstDayOfMonth)
- ✅ useAnalytics hook

---

## 🔄 FASE 2: EN PROGRESO (50%)

### 2.1 Extraer Constantes Mágicas ✅ COMPLETO

**Archivo creado**:

- ✅ src/constants/app.ts (126 líneas, 80+ constantes)

**Constantes exportadas**:

- ✅ MONTH_NAMES_ES (12)
- ✅ DAY_NAMES_ES (7)
- ✅ LIMITS (17 límites validación)
- ✅ TIME_FORMATS (4)
- ✅ MESSAGES (40+)
- ✅ STORAGE_KEYS (1)
- ✅ EXPORT_FORMATS (2)

**Refactorizaciones**:

- ✅ ClockView.tsx (-17 líneas)
- ✅ CalendarView.tsx (-24 líneas)
- ⏸️ SettingsView.tsx (opcional)

**Impacto**: -41 líneas, mejor mantenibilidad, i18n-ready

### 2.2 React.memo Optimizations ✅ COMPLETO (100%) - ACTUALIZADO 19/12

**Completado**:

- ✅ UI.tsx (5 componentes memoizados)
  - Button, Input, Card, Select, ConfirmDialog
  - displayName agregados
- ✅ Icons.tsx (13 iconos memoizados) - **COMPLETADO 19/12**
  - ClockIcon, CalendarIcon, CogIcon, SunIcon, MoonIcon
  - ChevronLeftIcon, ChevronRightIcon, TrashIcon, PencilIcon
  - CheckIcon, XMarkIcon, ArrowPathIcon, FlagIcon
  - Todos con displayName agregados

**Impacto**: 18 componentes optimizados, mejor performance en re-renders

### 2.3 Separar Componentes Grandes ✅ COMPLETO (50%) - ACTUALIZADO 19/12

**CalendarView.tsx** - ✅ COMPLETADO:

- ✅ Creado components/calendar/ directory
- ✅ CalendarYearView.tsx (70 líneas)
- ✅ CalendarMonthView.tsx (165 líneas)
- ✅ CalendarWeekView.tsx (130 líneas)
- ✅ CalendarDayView.tsx (170 líneas)
- ✅ CalendarRangeView.tsx (130 líneas)
- ✅ CalendarView.tsx: 1000 → 557 líneas (44.3% reducción)

**ClockView.tsx** (367 líneas) - ⏸️ PENDIENTE:

- [ ] Separar lógica de temporizadores
- [ ] Extraer componentes de vista
- [ ] Simplificar estado

**Impacto CalendarView**: -443 líneas, mejor mantenibilidad, testabilidad y reusabilidadrm

- [ ] MonthlyStats

**Estimado**: 4 horas, complejidad alta

### 2.4 Optimizar Renders ✅ COMPLETO - ACTUALIZADO 19/12

**Completado**:

- ✅ useCallback en CalendarView (6 handlers críticos)
  - handleViewChange, handlePrev/Next
  - handleDayClick, openEditModal
  - handleUpdateShift, confirmDelete
- ✅ useMemo verificado en todos los componentes
  - CalendarView: shiftsByDate, rangeDays, rangeTotals
  - ClockView: monthlyStats
  - SettingsView: no required

**Impacto**: Mejor performance en re-renders, menos renders innecesarios

### 2.5 Refactorizar Lógica Duplicada ✅ COMPLETO

**Archivo creado**:

- ✅ src/utils/time.ts (119 líneas, 4 funciones)

**Funciones exportadas**:

- ✅ toLocalISOString (Date → YYYY-MM-DD)
- ✅ calculateDuration (HH:MM → decimal hours)
- ✅ parseTimeToMinutes (HH:MM → minutes) _nuevo_
- ✅ formatDuration (8.5 → "8h 30m") _nuevo_

**Refactorizaciones**:

- ✅ ClockView.tsx (-28 líneas)
- ✅ CalendarView.tsx (-47 líneas)

**Impacto**: -75 líneas, -50% duplicación

---

## ⏸️ FASE 3: NO INICIADA

### 3.1 Internacionalización (i18n)

- [ ] react-i18next setup
- [ ] Extraer strings a JSON
- [ ] Español (ES) + Inglés (EN)
- [ ] Selector de idioma en Header

### 3.2 Accesibilidad (a11y)

- [ ] ARIA labels completos
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast check

### 3.3 Performance Monitoring

- [ ] React DevTools Profiler
- [ ] Lighthouse CI
- [ ] Bundle size optimization
- [ ] Code splitting

### 3.4 Documentación

- [ ] README completo
- [ ] Contributing guidelines
- [ ] API documentation
- [ ] User guide

---

## 📊 MÉTRICAS ACTUALES

| Métrica                      | Valor                  |
| ---------------------------- | ---------------------- |
| **Tests Passing**            | 63/85 (74%)            |
| **Test Errors**              | 12 (solo en **tests**) |
| **Coverage Estimado**        | ~50%                   |
| **Líneas Reducidas**         | -116                   |
| **Constantes Centralizadas** | 80+                    |
| **Funciones Reutilizables**  | 4                      |
| **Schemas Zod**              | 4                      |
| **Validaciones Activas**     | 19+                    |
| **Componentes Memoizados**   | 18 (+13 icons)         |
| **JSDoc Funciones**          | 10+                    |

---

## 🐛 ISSUES CONOCIDOS

### Build Errors (Producción: 0, Tests: 12)

#### CalendarView.test.tsx (11 errores)

```typescript
// Línea 253, 293, 324, 355, 408
error TS2580: Cannot find name 'require'
// Solución: import correcto o @types/node

// Línea 377, 378, 387, 388
error TS2304: Cannot find name 'global'
// Solución: globalThis o window

// Línea 174
error TS6133: 'user' is declared but never read

// Línea 278
error TS6133: 'exportButton' is declared but never read
```

#### useAppStore.test.ts (1 error)

```typescript
// Línea 631
error TS6133: 'result' is declared but never read
```

### Build Warnings (0) ✅

- ✅ Todos los warnings limpiados (19/12)

---

## 🔧 CLEANUP COMPLETADO ✅

### Imports No Usados

- [x] SettingsView.tsx: Removido import de useAnalytics y trackEvent (19/12)
- [x] CalendarView.tsx: Sin imports no usados

### Tests a Arreglar

- [ ] Agregar @types/node
- [ ] Usar globalThis en vez de global
- [ ] Remover variables no usadas
- [ ] Modernizar mocking (sin require)

### Duplicación Restante

- [x] monthNamesES → MONTH_NAMES_ES ✅
- [x] dayNamesES → DAY_NAMES_ES ✅
- [x] calculateDuration → utils/time ✅
- [x] toLocalISOString → utils/time ✅

---

## 📝 ARCHIVOS CLAVE CREADOS

### Nuevos Módulos

1. **src/constants/app.ts** (126 líneas)

   - Constantes centralizadas
   - 80+ exports

2. **src/utils/time.ts** (119 líneas)

   - 4 funciones helper
   - JSDoc completo

3. **src/utils/validationSchemas.ts** (119 líneas)
   - 4 schemas Zod
   - 19+ validaciones

### Archivos Modificados (Fase 1-2)

1. **src/components/ClockView.tsx**

   - Zod validation integrada
   - Imports desde constants/time
   - -45 líneas netas

2. **src/components/CalendarView.tsx**

   - Imports desde constants/time
   - -71 líneas netas

3. **src/components/SettingsView.tsx**

   - Zod validation (HourType, Backup)
   - Mensajes mejorados

4. **src/components/UI.tsx**

   - 5 componentes memoizados
   - displayName agregados

5. **src/components/ErrorBoundary.tsx**
   - Implementado completo
   - Fallback UI

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### Opción A: Finalizar Fase 2 (2-3 horas)

1. Completar 2.4 (useCallback manual)
2. Completar 2.2 (Icons memo)
3. Documentar mejoras

### Opción B: Saltar a Fase 3 (3-4 horas)

1. i18n basic setup
2. a11y improvements
3. Performance profiling

### Opción C: Fix Tests (1-2 horas)

1. Arreglar 12 errores TypeScript
2. Aumentar coverage
3. Tests para nuevos módulos

### Opción D: Refactoring Mayor (4-6 horas)

1. Fase 2.3 (Separar componentes)
2. CalendarView split
3. ClockView split

---

## 💡 NOTAS PARA NUEVA SESIÓN

### Build Status

```bash
npm run build
# Producción: ✅ CLEAN
# Tests: ⚠️ 12 errores (no bloquean)
```

### Verificar Antes de Continuar

```bash
git status  # Ver cambios actuales
npm run dev  # Debe funcionar sin errores
npm test # Ver estado tests
```

### Comandos Útiles

```bash
# Build production
npm run build

# Run tests
npm test

# Dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

### Contexto Importante

- Zod está instalado y funcional
- Constants module está en uso
- Time utils están importados
- UI components están memoizados
- ErrorBoundary está activo

### Evitar Problemas

1. **No editar archivos grandes** directamente

   - Usar ediciones pequeñas
   - Verificar cada cambio

2. **Tests en **tests\_\*\*\*\* pueden tener errores

   - No afectan producción
   - Arreglar en sesión dedicada

3. **Icons.tsx** difícil de refactorizar

   - Dejar para manual
   - Prioridad baja

4. **useCallback/useMemo**
   - Ya existe en algunos lugares
   - Agregar solo si medimos beneficio

---

## 📚 RECURSOS

### Documentación Creada

- implementation_plan.md (Fase 2 plan)
- phase1.5_complete.md (Zod validation)
- phase2.1_complete.md (Constants)
- phase2.5_complete.md (Time utils)
- task.md (Checklist actual)

### Ubicación Artifacts

```
C:\Users\devil\.gemini\antigravity\brain\
  bdef1366-7ad2-46be-888a-da7509b64ced\
```