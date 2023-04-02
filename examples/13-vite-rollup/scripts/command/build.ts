import * as rollup from "rollup";
import typescript from "rollup-plugin-typescript2";
import * as path from "path";
import { SRC_PATH, DIST_PATH } from "const";

// 常用 inputOptions 配置
const inputOptions = {
  input: [
    path.join(SRC_PATH, "./basic/index.ts"),
    path.join(SRC_PATH, "./basic/util.ts"),
  ],
  external: [],
  plugins: [typescript()],
};

const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: path.join(DIST_PATH, "basic-node", "es"),
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: "chunk-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    format: "esm",
    sourcemap: true,
  },
  {
    dir: path.join(DIST_PATH, "basic-node", "cjs"),
    entryFileNames: `[name].[hash].js`,
    chunkFileNames: "chunk-[hash].js",
    assetFileNames: "assets/[name]-[hash][extname]",
    format: "cjs",
    sourcemap: true,
  },
];

async function build() {
  let bundle;
  let buildFailed = false;
  debugger;
  try {
    /* 1. 调用 rollup.rollup 生成 bundle 对象 */
    bundle = await rollup.rollup(inputOptions);
    for (const outputOptions of outputOptionsList) {
      /* 2. bundle 暴露两个函数：generate 和 write */
      /* 此两个函数使用上没有差别，只是前者不会输出到磁盘，后者会输出到磁盘 */
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
