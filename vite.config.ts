import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // Archivos estáticos en la raíz de 'public' que queremos cachear
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "ApunTiti - Registro de Horas",
        short_name: "ApunTiti",
        description:
          "Herramienta offline para el registro de turnos de trabajo y cálculo de ganancias.",
        theme_color: "#eab308",
        background_color: "#111111",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "icons/pwa-48-48.png",
            sizes: "48x48",
            type: "image/png"
          },
          {
            src: "icons/pwa-72-72.png",
            sizes: "72x72",
            type: "image/png"
          },
          {
            src: "icons/pwa-96-96.png",
            sizes: "96x96",
            type: "image/png"
          },
          {
            src: "icons/pwa-144-144.png",
            sizes: "144x144",
            type: "image/png"
          },
          {
            src: "icons/pwa-192-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "icons/pwa-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any" // "any" sirve para iconos generales
          },
          {
            src: "icons/pwa-maskable-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable" // Reusamos el mismo para maskable si tiene fondo sólido
          }
        ],
        screenshots: [
  {
    src: "screenshots/mobile.png", // Tienes que crear esta imagen
    sizes: "390x844", // El tamaño real de tu imagen
    type: "image/png",
    form_factor: "narrow"
  },
  {
    src: "screenshots/desktop.png", // Tienes que crear esta imagen
    sizes: "1920x1080", // El tamaño real de tu imagen
    type: "image/png",
    form_factor: "wide"
  }
],
categories: ["productivity", "utilities", "finance"],
      },
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
