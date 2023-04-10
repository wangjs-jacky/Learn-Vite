import * as path from "path";
import { ViteDevServer } from "vite";

export const isProd = process.env.NODE_ENV === "production";
export const cwd = process.cwd();

/* ssr 也需要区分开发模式和生产模式 */
export async function loadSsrEntryModule(vite: ViteDevServer | null) {
  if (isProd) {
    /* 生产模式：直接从 dist 取出构建后的 js 文件 */
    const entryPath = path.join(cwd, "dist/server/ssr-entry.js");
    return import(entryPath);
  } else {
    /* 如果是开发模式，代码就在 client-entry下 */
    const entryPath = path.join(cwd, "src/ssr-entry.tsx");
    /* 使用 vite.ssrLoadModule 传入的模块无需打包，vite 帮会自动将依赖构建打包成 js 可运行的文件 */
    return vite!.ssrLoadModule(entryPath);
  }
}

/* html 文件不会发生改变，只是位置挪了下 */
export function resolveTemplatePath() {
  return isProd
    ? path.join(cwd, "dist/client/index.html")
    : path.join(cwd, "index.html");
}

/* 判断是否为首页，如果为首页，则返回 html 模板，否则跳过 */
export function matchPageUrl(url: string) {
  url = url.split("?")[0];
  if (url === "/") {
    return true;
  }
}
