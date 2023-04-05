import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* 打印生命周期钩子，3s 后自动退出 */
import viteLogLifeCycle from "./plugins/loglifecycle";
import virtual from "./plugins/virtual-module";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtual(), viteLogLifeCycle({ test: "123" })],
});
