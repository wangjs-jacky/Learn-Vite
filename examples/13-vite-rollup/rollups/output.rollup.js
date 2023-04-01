import typescript from "rollup-plugin-typescript2";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: ["src/index.ts", "src/util.ts"],
  output: {
    // 产物输出目录
    dir: path.resolve(__dirname, "../", "dist/output"),
    // 以下三个配置项都可以使用这些占位符:
    // 1. [name]: 去除文件后缀后的文件名
    // 2. [hash]: 根据文件名和文件内容生成的 hash 值
    // 3. [format]: 产物模块格式，如 es、cjs
    // 4. [extname]: 产物后缀名(带`.`)
    // 入口模块的输出文件名
    entryFileNames: `[name].js`,
    // 非入口模块(如动态 import)的输出文件名
    chunkFileNames: "chunk-[hash].js",
    // 静态资源文件输出文件名
    assetFileNames: "assets/[name]-[hash][extname]",
    // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
    format: "cjs",
    // 是否生成 sourcemap 文件
    sourcemap: true,
    // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
    name: "MyBundle",
    // 全局变量声明
    globals: {
      // 项目中可以直接用`$`代替`jquery`
      jquery: "$",
    },
  },
  plugins: [typescript()],
};

export default buildOptions;
