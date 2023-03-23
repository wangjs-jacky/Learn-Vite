import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "object-assign",
      "@loadable/component > hoist-non-react-statics",
      "@loadable/component > hoist-non-react-statics > react-is",
    ],
    exclude: ["@loadable/component"],
  },
});
