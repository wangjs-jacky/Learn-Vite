// build.js
import * as esbuild from "esbuild";

async function staticServer() {
  let ctx = await esbuild.context({
    absWorkingDir: process.cwd(),
    /* 入口文件：react 组件 */
    entryPoints: ["./src/react-component.jsx"],
    outdir: "dist/command/serve",
    bundle: true,
    format: "esm",
    splitting: true,
    sourcemap: true,
    ignoreAnnotations: true,
    metafile: true,
  });

  let { host, port } = await ctx.serve({
    port: 8000,
    // 静态资源目录
    servedir: "./dist",
  });

  console.log(`HTTP Server starts at http://${host}:${port}`);
}

staticServer();
