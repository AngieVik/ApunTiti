import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import Inspector from "vite-plugin-react-inspector";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Inspector(),
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
            src: "icons/pwa-64x64.png", // <--- Ruta actualizada a carpeta icons
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "icons/pwa-192x192.png", // <--- Ruta actualizada a carpeta icons
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png", // <--- Ruta actualizada a carpeta icons
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "icons/maskable-icon-512x512.png", // <--- Ruta actualizada a carpeta icons
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
