import * as rollup from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
const path = require("path");
const srcPath = path.join(__dirname, "..", "src");

// 常用 inputOptions 配置
const inputOptions = {
  input: [
    path.join(srcPath, "/basic/index.ts"),
    path.join(srcPath, "basic/util.ts"),
  ],
  external: [],
  plugins: [typescript()],
};

const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: "dist/basic-node/es",
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: "chunk-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    format: "esm",
    sourcemap: true,
  },
  {
    dir: "dist/basic-node/cjs",
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: "chunk-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    format: "cjs",
    sourcemap: true,
  },
  // 省略其它的输出配置
];

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    /* 1. 调用 rollup.rollup 生成 bundle 对象 */
    bundle = await rollup.rollup(inputOptions);
    for (const outputOptions of outputOptionsList) {
      /* 2. 获取 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物 */
      const { output } = await bundle.generate(outputOptions);
      await bundle.write(outputOptions);
    }
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    /* 调用 close 方法结束打包工作 */
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

build();
