import * as rollup from "rollup";
import * as path from "path";
import replace from "@rollup/plugin-replace";
import MagicString from "magic-string";

import { DIST_PATH, SRC_PATH } from "const";

// 常用 inputOptions 配置
const inputOptions = {
  input: path.join(SRC_PATH, "plugin", "replace.js"),
  external: [],
  plugins: [
    replace({
      "process.env.Jacky": "'Jacky'",
    }),
    myReplace({
      "process.env.Hello1": "'Jack!!!'",
      "process.env.World2": () => "'Jack!!!'",
      delimiters: ["\\b", "\\b(?!\\.)"],
    }),
  ],
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write({
    dir: path.join(DIST_PATH, "transform", "replace"),
    format: "cjs",
  });
}
build();

/* 简易版：暂不支持配置
  include: [],
  exclude: [],
  sourcemap;
  sourceMap;
  objectGuards;
*/
function myReplace(opts = {}) {
  /* 此处 \\b xxxx \\b 用于单词边界区分 */
  const { delimiters = ["\\b", "\\b(?!\\.)"] } = opts as any;
  const replacements = getReplacements(opts);
  const functionValues = mapToFunctions(replacements);
  const keys = Object.keys(functionValues).map(escape);
  const pattern = new RegExp(
    `${delimiters[0]}(${keys.join("|")})${delimiters[1]}`,
    "g",
  );
  return {
    name: "rollup:replace",
    transform(code, id) {
      if (!keys.length) return null;
      debugger;
      return executeReplacement(code, id);
    },
  };
  /* 过滤额外属性 */
  function getReplacements(options) {
    const values = Object.assign({}, options);
    delete values.delimiters;
    return values;
  }

  /* 将对象转化为函数 */
  function mapToFunctions(object) {
    return Object.keys(object).reduce((pre, cur) => {
      const functions = { ...pre };
      functions[cur] = ensureFunction(object[cur]);
      return functions;
    }, {});
  }

  /* 将 value 转化为函数 */
  function ensureFunction(functionOrValue) {
    if (typeof functionOrValue === "function") return functionOrValue;
    return () => functionOrValue;
  }

  function executeReplacement(code, id) {
    const magicString = new MagicString(code);
    let match;

    while ((match = pattern.exec(code))) {
      const start = match.index;
      const end = start + match[0].length;
      const replacement = String(functionValues[match[1]](id));
      magicString.overwrite(start, end, replacement);
    }
    const result = { code: magicString.toString() };
    return result;
  }
}

/* []内的特殊字符都无需添加转义 */
function escape(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
}
