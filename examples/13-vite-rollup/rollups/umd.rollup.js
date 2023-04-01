const typescript = require("rollup-plugin-typescript2");
const path = require("path");
const srcPath = path.join(__dirname, "..", "src");

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  input: [path.join(srcPath, "/basic/index.ts")],
  output: [
    {
      /* 产物输出文件 */
      file: "dist/basic/umd/index.js",
      /* 产物格式 */
      format: "umd",
    },
  ],
  plugins: [typescript()],
};

module.exports = buildOptions;
