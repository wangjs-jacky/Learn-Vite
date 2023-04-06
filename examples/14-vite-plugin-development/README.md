## 前言

本项目为 `vite` 插件开发示例



## 示例

主要提供两个插件示例：

1. `plugins/svgr.ts` ：将 `svg` 图片转化为 `react` 组件
2. `plugins/virtual-module.ts` ：将编译时信息打入运行时。



**使用方法：**

1. 配置 vite 插件

```javascript
// vite.config.ts
import virtual from "./plugins/virtual-module";
import viteSvgrPlugin from "./plugins/svgr";
import inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtual(), viteSvgrPlugin(), inspect()],
});
```

2. 如果要调试的话，可在插件中打 `debug`
3. 打开 `javascript terminal debugger` ，运行 `npm run dev` 进行调试。

最终结果：

 ![](https://wjs-tik.oss-cn-shanghai.aliyuncs.com/202304052229086.png)



## `hook`生命周期

插件如下：

```javascript
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
```

调试结果：

```
config
configResolved
options {}
configureServer
3s 后自动关闭
buildStart
Port 5173 is in use, trying another one...

  VITE v4.2.1  ready in 252 ms

  ➜  Local:   http://127.0.0.1:5174/
  ➜  Network: use --host to expose
  ➜  press h to show help
buildEnd
closeBundle
```

