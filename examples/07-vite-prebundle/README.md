## 前言

本项目为 `Vite` 预构建基础案例及优化解决方案。



## 希望解决的问题

在 `npm run dev` 启动项目后，尝试思考如下问题：

1. 如何避免 `object-assign` 所导致的二次预构建？
2. 如何想要将 `@loadable/component` 排除为预构建外（虽然没必要），可不可以实现？
3. 如何打包本身会出错的第三方包，如 `react-virtualized` ？

4. 尝试使用 `npx vite optimize` 单独触发预构建操作。



答案参考：`vite.config.ts` 

```javascript
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
```





