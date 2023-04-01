## 前言

本项目为 `ESBuild` 基础使用及插件开发案例。



### ESBuild 基础

安装 `esbuild` 依赖，版本依赖为 `0.17.13`

`ESbuild` 有两种使用方式：命令行 和 代码编程。

```json
  "scripts": {
    /* 命令行 */
    "command:npx": "npx esbuild src/index.jsx --bundle --outfile=dist/out.js",
    
    /* 代码编程 */
    "command:build": "node ./scripts/command/build.js",
    "command:serve": "node ./scripts/command/serve.js",
    "command:watch": "node ./scripts/command/watch.js",
  }
```

其中：

1. `command:npx` 使用脚手架命令打包项目。
2. `command:build/serve/watch` 给出了三种基础模式的案例。



推荐当使用 `npm run command:build` 时，可修改修改 [`build` 案例](https://github.com/wangjs-jacky/Learn-Vite/blob/main/examples/11-vite-esbuild/scripts/command/build.js) 中的不同的 `esbuild` 配置，观察输出产物内容。

可尝试如下配置：

1. `format: "iife"`  产物为立即执行函数。

2. `format: "esm"` 和 `splitting: true` 当为 `esm` 模块时，可开启分包策略，打包后会多出命名为 `CHUNK_` 的包。

3. `metafile` 开启后，可在 `const result = await esbuild.build` 的产物中获取构建元信息。

   当需要开发一个 `esbuild` 的 `html` 预览插件时可以收集 `bundle` 打包后的上下文信息。

4. `soucemap: true` 开启后，产物会生成一个 `xxx.map.js` 文件，方便开发调试。

5. `bundle: true` 会将第三方依赖打入产物中，结合入口案例，可发现如下两种构建产物是相同的，请思考原因。

   - `bundle: true` 
   - `bundle: fales` + `external: ["react","react-dom"]`





## ESBuild 插件开发

在 `package.json` 中给出了三个插件实践案例：

```json
"scripts": {
  "plugin:vm": "node ./scripts/plugins/virtual-module.js",
  "plugin:cdn": "node ./scripts/plugins/cdn-import-plugin.js",
  "plugin:html": "node ./scripts/plugins/html-plugin.js && serve ./dist/plugins"
},
```

其中：

- `plugin:vm` ：虚拟模块案例，可用于获取**构建时信息**。
- `plugin:cdn`：开发一个插件，用于解析 `http` 等 `cdn` 模块。
- `plugin:html`：开发一个简易的  `html` 插件，用于自动将构建资源插入到 `html` 模板中。