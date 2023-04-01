const typescript = require("rollup-plugin-typescript2");
const path = require("path");
const srcPath = path.join(__dirname, "..", "src");

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: [
    path.join(srcPath, "/basic/index.ts"),
    path.join(srcPath, "basic/util.ts"),
  ],
  output: [
    {
      /* 产物输出文件 */
      dir: "dist/basic/es",
      /* 产物格式 */
      format: "esm",
    },
    {
      /* 产物输出文件 */
      dir: "dist/basic/cjs",
      /* 产物格式 */
      format: "cjs",
    },
  ],
  plugins: [typescript()],
};

module.exports = buildOptions;
