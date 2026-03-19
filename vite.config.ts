/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// base "/" = site em https://tiagocosmai.github.io (repo tiagocosmai.github.io)
// base "/tiagocosmai/" = site em https://tiagocosmai.github.io/tiagocosmai/ (repo tiagocosmai)
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES === "true" ? "/tiagocosmai/" : "/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
