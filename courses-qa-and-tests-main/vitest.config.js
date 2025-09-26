/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.{js,ts}"],
    // Dossiers à ignorer par le runner de tests
    exclude: ["node_modules", "dist", "coverage", "sql","src/modules/banking/transfer/transfer.test.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      all: true, 
      include: ["src/**/*.js"],
      exclude: ["node_modules/", "public/", "sql/", "coverage/", "dist/"],
    },
  },
});
