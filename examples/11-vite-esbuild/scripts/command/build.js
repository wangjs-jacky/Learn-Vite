import * as esbuild from "esbuild";

/* 说明：
   esbuild 提供 build 和 buildSync 两种方案。
*/

async function runBuild() {
  const result = await esbuild.build({
    // ----  如下是一些常见的配置  ---
    // 当前项目根目录
    absWorkingDir: process.cwd(),
    // 入口文件列表，为一个数组
    entryPoints: ["src/react-component.jsx"],
    // 打包产物目录
    outdir: "dist/command/build",
    // 是否需要打包，一般设为 true
    bundle: true,
    // 模块格式，包括`esm`、`commonjs`和`iife`
    format: "iife",
    // 需要排除打包的依赖列表
    external: ["react", "react-dom"],
    // 是否开启自动拆包
    splitting: false,
    // 是否生成 SourceMap 文件
    sourcemap: true,
    // 是否生成打包的元信息文件(只有配置成功后，result 才会有对应的参数)
    metafile: true,
    // 是否进行代码压缩
    minify: false,
    // 是否将产物写入磁盘
    write: true,
    // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
    // 针对一些特殊的文件，调用不同的 loader 进行加载
    loader: {
      ".png": "base64",
      ".jsx": "jsx",
    },
  });
  console.log("result", result);
}

runBuild();
