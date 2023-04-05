/* 将 svg 导出为一个 React 组件 */

import { Plugin } from "vite";

import resolve from "resolve";
import * as path from "path";
import { readFile } from "fs/promises";

interface SvgrOptions {
  /* 导出为一个 url 还是一个 React 组件 */
  defaultExport?: "url" | "component";
}

export default function viteSvgrPlugin(options: SvgrOptions = {}): Plugin {
  const { defaultExport = "component" } = options;
  return {
    name: "vite-plugin-svgr",
    async transform(code, id) {
      /* 转换逻辑 svg => React 组件 */
      /* 1.根据 id 过滤出 svg 资源 */
      if (path.extname(id) !== ".svg") {
        return code;
      }

      /* 注: 需安装 6 版本  */
      const svgrTransform = await import("@svgr/core");

      /* 这里：使用 esbuild(起的 babel 作用) 处理 jsx 代码 */
      const esbuildPackagePath = resolve.sync("esbuild", {
        basedir: resolve.sync("vite"),
      });
      const esbuild = await import(esbuildPackagePath);

      // 2. 读取 svg 文件内容；
      const svg = await readFile(id, "utf8");

      /* 3. 利用 `@svgr/core` 将 svg 转化为 React 组件 */
      const svgrResult = await svgrTransform.transform(
        svg,
        { icon: true },
        { componentName: "ReactComponent" },
      );

      let componentCode = svgrResult;
      /* 当为 url 时，仍将组件格式导出，以 url 的形式默认导出 */
      if (defaultExport === "url") {
        componentCode += code;
        componentCode = componentCode.replace(
          "export default ReactComponent",
          "export { ReactComponent }",
        );
      }

      /* 5. 利用 esbuild 将组件中的 jsx 代码转译为浏览器可运行的代码 */
      /* 即使用 React.createElement 去处理 */
      const result = await esbuild.transform(componentCode, {
        loader: "jsx",
      });

      return {
        code: result.code,
        map: null, //
      };
    },
  };
}
