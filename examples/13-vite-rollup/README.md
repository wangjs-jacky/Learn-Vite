## 前言

本项目为 `Rollup` 基础使用及插件开发案例。



### Rollup 基础

安装 `esbuild` 依赖，版本依赖为 `0.17.13`

`rollup` 有两种使用方式：命令行 和 代码编程。

```json
  "scripts": {
    /* 命令行 */
    "build:nobundle": "npx rollup -c ./rollups/basic.rollup.js",
    "build:umd": "npx rollup -c ./rollups/umd.rollup.js",
    "build:lodash": "npx rollup -c ./rollups/lodash.rollup.js",
    
    /* 代码编程 */
    "command:build": "npx tsx ./scripts/command/build.ts",
    "command:watch": "npx tsx ./scripts/command/watch.ts",
  }
```

**命令行指令：**

- `"build:nobundle"` ：以非 `bundle` 的形式去打包应用。

  其中 `no-bundle` 的打包方式，值的是以源文件的结构输出`output`，适用与组件库等 `monorepo` 的打包方式，类似的工具模式还有 `tsc` 。

  注意此时在配置`rollup.config.js` 时，`input` 的类型可为数组，但产物格式只能为 `esm/cjs`

- `"build.umd"`：以 `bundle` 的形式去打包应用，典型的打包工具代表为 `webpack`

  注意此时在配置 `rollup.config.js` 时，`input` 仅支持文件入口，产物格式为 `umd`，输出目录从原先的 `dir` 改为 `file`。

- `"build:lodash"`：当构建依赖存在第三方库时，且仅为 `cjs`时，需要安装额外的插件。

  ```js
  const resolve = require("@rollup/plugin-node-resolve");
  const commonjs = require("@rollup/plugin-commonjs");
  
  moudle.exports = {
    plugins: [resolve(), commonjs()]
  }
  ```

  其中：

  - `@rollup/plugin-node-resolve`是为了允许我们加载第三方依赖，否则像 `import React from 'react'` 的依赖导入语句将不会被 `Rollup` 识别。
  - `@rollup/plugin-commonjs` 的作用是将 `CommonJS` 格式的代码转换为 `ESM` 格式



**代码编程：**

- `"command:build"`：使用 `rollup.rollup({})` 函数进行构建。
- `command:watch`：使用 `rollup.watch({})` 开启 `rollup` 监听模式。



通过 **代码构建** 与 **命令行** 有几点显著不同。

- 对于 **命令行** 只要配置 `rollup.config.js` 文件的 `output` 数组，产物会自动输出不同格式的文件。而对于 **代码构建**，需要手动遍历 `outputOptionList` 数组。
- 命令行构建的使用模式如下：
  1. 使用 `rollup.rollup({})` 中传入原先 `rollup.config.js` 中的 `input` 属性，返回 `bundle` 对象。
  2. 对于 `bundle` 对象提供两个函数：`bundle.generate` 和 `bundle.write` 此时可以传入 `output` 属性，执行后可查看执行结果。





## ESBuild 插件开发

在 `package.json` 中给出了三个插件实践案例：

```json
"scripts": {
  "plugin:alias": "npx tsx ./scripts/plugins/alias-plugin.ts",
  "plugin:image": "npx tsx ./scripts/plugins/image-plugin.ts",
  "transform:replace": "npx tsx ./scripts/transform/replace-plugin.ts"
},
```

其中：

- `"plugin:alias"` ：同 `esbuild` 虚拟模块案例，主要为 `resolveId` 钩子函数实践。

  参考官方插件：[@rollup/plugin-alias](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Frollup%2Fplugins%2Ftree%2Fmaster%2Fpackages%2Falias)：别名配置。

  使用方式：

  ```javascript
  const rollupOptions = {
    plugins:[
      myAlias({
        /* 将虚假的模块 util-a 替换为真实的模块 `.util.js` */
        entries: [{ find: "util-a", replacement: "./util.js" }],
      }),
    ]
  }
  ```

- ` plugin:image`：开发一个插件，用于解析 `.png/.svg` 等图片格式。由于只需通过后缀 `extname` 判断，无需 `resovleId` 钩子，主要为 `load` 钩子函数实践。

  参考官方插件：[@rollup/plugin-image](https://github.com/rollup/plugins/blob/master/packages/image/src/index.js)

  ```javascript
  const rollupOptions = {
    plugins:[
      /* 支持 image 图标的加载
         dom 设置 true 时返回 img 对象，否则直接返回 fs.readFilySync 结果 */  
      myImage({
        dom: true,
      }),
    ]
  }
  ```

- `transform:replace`：开发一个插件，主要实现 `transform` 效果，全局替换文本。

  使用方式：

  ```javascript
  const rollupOptions = {
    plugins:[
      myReplace({
        /* 将 process.env.Hello 文本替换为 `Jacky!!` */  
        "process.env.Hello1":"'Jacky!!'"
      })
    ]
  }
  ```

  

  

  