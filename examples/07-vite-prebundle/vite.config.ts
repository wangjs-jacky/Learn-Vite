import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      /* 注释后，终端会显示：ew dependencies optimized: object-assign */
      "object-assign",
      /* 不推荐使用 exclude 时，若使用要学会如何解决此问题 */
      "@loadable/component > hoist-non-react-statics",
      "@loadable/component > hoist-non-react-statics > react-is",
    ],
    exclude: ["@loadable/component"],
  },
});
