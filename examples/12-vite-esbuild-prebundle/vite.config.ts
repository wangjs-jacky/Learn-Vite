import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export const EXTERNALS = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  build: {
    rollupOptions: {
      external: EXTERNALS,
    },
  },
});
