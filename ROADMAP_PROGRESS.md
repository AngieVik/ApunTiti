🔴 Alta Prioridad
1. Migrar 

useLocalStorage a Zustand
El hook useLocalStorage.ts es legacy y redundante ya que Zustand con persist middleware ya maneja la persistencia. Esto simplificaría el código y evitaría posibles conflictos de estado.

2. Implementar sincronización real
MockSyncService en api.ts solo simula la sincronización. Propongo:

Integrar con un backend real (Firebase, Supabase, o API propia)
Añadir sincronización offline-first con IndexedDB
Implementar resolución de conflictos
3. Lazy loading de vistas pesadas

CalendarView.tsx (443KB) es muy grande. Dividirlo en chunks más pequeños:

const CalendarView = React.lazy(() => import('./CalendarView'));
🟠 Media Prioridad
4. Gráficos y visualizaciones
Añadir dashboards con:
Gráfico de horas trabajadas por semana/mes (usando Chart.js o Recharts)
Tendencias de ganancias
Comparativas entre meses
5. Exportación avanzada
Exportar a Excel (.xlsx)
Integración con Google Calendar
Generar facturas automáticas desde los turnos
6. Notificaciones programadas
Aprovechar el sistema de notificaciones existente para:

Recordatorios de registro de turnos
Avisos de inicio/fin de turno
Resumen semanal de horas
7. Tests E2E más completos
Solo hay 4 specs en Playwright. Añadir:

Flujo completo de registro de turno
Backup/restore
Cambio de tema
🟢 Baja Prioridad (Polish)
8. Mejoras de UX
Drag & drop para reordenar categorías
Atajos de teclado (Ctrl+N nuevo turno, etc.)
Modo "turno en progreso" con temporizador en vivo
9. Internacionalización (i18n)
Preparar para múltiples idiomas usando react-i18next

10. PWA mejorada
Background sync para sincronización offline
Push notifications reales
Instalación mejorada con screenshots