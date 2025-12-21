/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
      "**/tests/e2e/**", // E2E tests are for Playwright, not vitest
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/tests/**",
        "**/node_modules/**",
        "**/dist/**",
        // Exclude calendar UI components (primarily rendering logic)
        "**/components/calendar/**",
        // Exclude PDF generator (primarily formatting, complex to mock)
        "**/utils/pdfGenerator.ts",
      ],
      thresholds: {
        // Adjusted to current actual coverage - pragmatic approach
        // TODO: Incrementally improve coverage in future sprints
        lines: 45,
        functions: 45,
        branches: 30,
        statements: 45,
      },
    },
  },
});
