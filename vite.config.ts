/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// GitHub Pages em subpath: GH_PAGES=true npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.GH_PAGES === "true" ? "/react-portfolio-template/" : "/",
  server: {
    proxy: {
      "/api/contact": {
        target: "http://127.0.0.1:8787",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
