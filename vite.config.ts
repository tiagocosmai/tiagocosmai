/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Site na raiz: https://tiagocosmai.github.io (repositório tiagocosmai.github.io)
export default defineConfig({
  plugins: [react()],
  base: "/",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
});
