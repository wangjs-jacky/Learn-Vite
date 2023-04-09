import express, { Express, RequestHandler } from "express";
import { ViteDevServer } from "vite";
import * as path from "path";
import {
  cwd,
  isProd,
  loadSsrEntryModule,
  matchPageUrl,
  resolveTemplatePath,
} from "./util";
import serve from "serve-static";
import { renderToString } from "react-dom/server";
import * as fs from "fs";
import React from "react";

async function createServer() {
  const app = express();
  // 加入 Vite SSR 中间件
  app.use(await createSsrMiddleware(app));

  if (isProd) {
    app.use(serve(path.join(cwd, "dist/client")));
  }

  app.listen(3000, () => {
    console.log("Express 服务器启动~，端口号:3000");
  });
}

createServer();

/* 中间件 */
async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null;
  /* 通过 vite 启动了一个 vite-dev-server (通过 appType 指定) */
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root: cwd,
      server: {
        middlewareMode: true,
      },
      appType: "custom",
    });

    /* 将 vite 内部的中间件继承到 express 中间件 */
    app.use(vite.middlewares);
  }
  return async (req, res, next) => {
    const url = req.originalUrl;
    if (!matchPageUrl(url)) {
      return await next();
    }

    /* 传入 vite , 在生产阶段为 null */
    /* 1. 加载服务端入口组件模块 */
    const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);

    /* 2. 首屏数据获取 */
    const data = await fetchData();
    /* 3. 拼接 html  */
    const appHtml = renderToString(React.createElement(ServerEntry, { data }));

    /* 获取 html */
    const templatePath = resolveTemplatePath();
    let template = fs.readFileSync(templatePath, "utf-8");
    /* 若为开发阶段 */
    if (!isProd && vite) {
      /* html 代码由 vite.transformIndexHtml 获取 */
      template = await vite.transformIndexHtml(url, template);
    }

    /* 手动模板引擎 */
    const html = template
      .replace("<!-- SSR_APP -->", appHtml)
      .replace(
        "<!-- SSR_DATA -->",
        `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`,
      );
    /* 通过中间件给客户端返回 html 字符 */
    res.status(200).setHeader("Content-Type", "text/html").end(html);
  };
}
