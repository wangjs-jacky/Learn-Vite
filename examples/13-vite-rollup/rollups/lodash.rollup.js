const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

/**
 * @type { import('rollup').RollupOptions }
 */
module.exports = {
  input: ["src/lodash/index.mjs"],
  output: [
    {
      dir: "dist/lodash/es",
      format: "esm",
    },
    {
      dir: "dist/lodash/cjs",
      format: "cjs",
    },
  ],
  // 通过 plugins 参数添加插件
  plugins: [resolve(), commonjs()],
};
