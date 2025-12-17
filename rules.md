# Reglas del Proyecto ApunTiti

## Tech Stack

- Framework: React 19 (Latest)
- Build Tool: Vite (Latest)
- Styling: Tailwind CSS v4 (Oxide engine)
- Language: TypeScript

## Arquitectura de Estilos (CRÍTICO)

- NO escribir clases de Tailwind directamente en los componentes (JSX/TSX).
- TODAS las clases de estilo deben estar centralizadas en el archivo `src/theme/styles.ts`.
- El archivo `styles.ts` debe exportar un objeto constante tipado organizado en estas 5 secciones exactas:
    1. HEADER
    2. REGISTRO (inputs, botones de acción, resumen)
    3. CALENDARIO (grid, celdas, controles)
    4. CONFIGURACIÓN (paneles, toggles, selects)
    5. MODOS (Dark/Light themes o variantes)
- Carpeta raíz del código fuente: ./src

## Reglas de Refactorización

- La lógica de negocio (cálculos de horas, localStorage, fechas) NO debe modificarse, solo moverse si es necesario para la limpieza.
- Mantener la estructura de componentes funcional pero limpiando su JSX de cadenas de texto largas de clases.
- Usar variables CSS nativas para los colores principales en el CSS global si es necesario para Tailwind v4.
