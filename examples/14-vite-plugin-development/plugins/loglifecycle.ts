import { Plugin } from "vite";
export default function viteLogLifeCycle(options = {}): Plugin {
  return {
    name: "vite-plugin-log-lifecycle",
    // Vite 独有钩子
    config(config) {
      console.log("config");
    },
    // Vite 独有钩子
    configResolved(resolvedCofnig) {
      console.log("configResolved");
    },
    // 通用钩子
    options(opts) {
      console.log("options", opts);
      return opts;
    },
    // Vite 独有钩子
    configureServer(server) {
      console.log("configureServer");
      console.log("3s 后自动关闭");
      setTimeout(() => {
        // 手动退出进程
        process.kill(process.pid, "SIGTERM");
      }, 3000);
    },
    // 通用钩子
    buildStart() {
      console.log("buildStart");
    },
    // 通用钩子
    buildEnd() {
      console.log("buildEnd");
    },
    // 通用钩子
    closeBundle() {
      console.log("closeBundle");
    },
  };
}
