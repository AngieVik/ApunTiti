📝 ApunTiti
ApunTiti es una Progressive Web App (PWA) moderna y eficiente diseñada para la gestión personal de turnos laborales. Permite registrar entradas y salidas, calcular ganancias automáticamente según tipos de hora configurables y visualizar la actividad laboral mediante un calendario interactivo y reportes detallados.

La aplicación destaca por su arquitectura robusta, un sistema de diseño escalable (Design System) y un enfoque Mobile-First.

✨ Características Principales
📅 Gestión de Turnos Completa: Registro rápido de fecha, hora de entrada/salida, categoría (guardia, extra, normal) y notas.

💰 Cálculo Automático de Ganancias: Configuración de precios por "Tipo de Hora" para estimar ingresos en tiempo real.

📊 Visualización Versátil:

Vista Calendario: Navegación por Mes, Año, Semana y Día.

Vista Rango: Selección personalizada de fechas para reportes específicos.

Estadísticas: Totales de horas y ganancias por periodo.

🎨 Tematización Avanzada:

Soporte nativo para Modo Claro y Modo Oscuro.

Sistema de Temas de Color (Ej: Básico Ámbar, Rosa Pastel) intercambiables en tiempo real.

📱 Experiencia Nativa (PWA): Instalable en dispositivos móviles y de escritorio, con funcionamiento offline y persistencia de datos.

📄 Exportación: Generación de reportes en PDF y TXT.

💾 Seguridad de Datos: Todos los datos se almacenan localmente en el dispositivo (LocalStorage) con opciones de Copia de Seguridad (Backup/Restore) en archivo JSON.

🛠️ Stack Tecnológico
El proyecto utiliza las últimas tecnologías del ecosistema React (2025 Standard):

Core: React 19

Lenguaje: TypeScript 5.5+

Build Tool: Vite 6

Estilos: Tailwind CSS v4 (Configuración nativa sin postcss complejo)

Estado Global: Zustand 5 (con persistencia automática)

Validación: Zod

Testing: Vitest (Unitario) + Playwright (E2E)

🏗️ Arquitectura del Proyecto
ApunTiti sigue reglas arquitectónicas estrictas para garantizar escalabilidad y mantenibilidad (ver rules.md):

1. Sistema de Diseño (Design Tokens)
   La UI no utiliza valores "hardcoded". Se basa en una arquitectura de tokens de 3 niveles ubicada en src/theme/tokens/:

Primitives: Paleta de colores cruda y escalas.

Semantic: Roles funcionales (ej: surface.base, accent.primary).

Components: Definiciones de variantes para botones, cards, inputs.

El archivo src/theme/styles.ts actúa como la única fuente de verdad para las clases de estilo (APP_STYLES).

2. Manejo Seguro de Fechas
   Para evitar errores de zona horaria, está prohibido el uso directo de new Date("YYYY-MM-DD"). Se utilizan utilidades dedicadas en src/utils/time.ts:

parseDateString()

toLocalISOString()

calculateDuration()

3. Estado (Store)
   Todo el estado de la aplicación (turnos, configuración, tema) reside en un único store de Zustand (useAppStore.ts), simplificando el flujo de datos y la persistencia.

🚀 Instalación y Desarrollo
Sigue estos pasos para ejecutar el proyecto en local:

Clonar el repositorio:

Bash

git clone https://github.com/AngieVik/apuntiti.git
cd apuntiti
Instalar dependencias:

Bash

npm install
Iniciar servidor de desarrollo:

Bash

npm run dev
La app estará disponible en http://localhost:5173.

🧪 Testing
ApunTiti cuenta con una suite de tests robusta para asegurar la calidad del código.

Tests Unitarios (Lógica y Componentes):

Bash

npm run test
O para modo vigilancia: npm run test:watch

Tests End-to-End (Simulación de usuario):

Bash

npx playwright test
📂 Estructura de Directorios
Plaintext

src/
├── components/ # Componentes React
│ ├── calendar/ # Subcomponentes complejos del calendario
│ ├── UI.tsx # Kit UI Base (Button, Input, Card)
│ └── ...vistas # Vistas principales (ClockView, CalendarView, Settings)
├── hooks/ # Custom hooks (useAnalytics, etc.)
├── store/ # Estado global (Zustand)
├── theme/ # Sistema de Diseño
│ ├── tokens/ # Primitivas, semántica y componentes
│ └── styles.ts # Objeto de estilos centralizado
├── utils/ # Utilidades puras (time.ts, pdfGenerator.ts)
└── types.ts # Definiciones de tipos TypeScript globales
🤝 Contribución
Si deseas contribuir, por favor asegúrate de leer rules.md antes de enviar un Pull Request. Es fundamental respetar las reglas de manejo de fechas y el uso del sistema de estilos centralizado.

Desarrollado con ❤️ para organizar tu vida laboral.
