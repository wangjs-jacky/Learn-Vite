/* const alias = require("@rollup/plugin-alias"); */
const rollup = require("rollup");
const util = require("util");
const path = require("path");

const srcPath = path.join(__dirname, "../src");

const rollupConfig = {
  input: path.join(srcPath, "virtual-module.js"),
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    otherPlugin(),
    alias({
      /* 将 util-a 这个虚假模块替换为 ./util.js 相对 */
      entries: [{ find: "util-a", replacement: "./util.js" }],
    }),
  ],
};

async function build() {
  const bundle = await rollup.rollup(rollupConfig);
  const result = await bundle.generate({});
}
build();

/* 简易版-官方插件，经支持 find(不支持正则) 和 replacement 两个参数 */
function alias(options) {
  // 获取 entries 配置
  const { entries } = options;
  return {
    // 传入三个参数，当前模块路径、引用当前模块的模块路径、其余参数
    resolveId(importee, importer, resolveOptions) {
      log(importee, importer, "alias-plugin");
      // 根据 find 过滤出模块
      const matchedEntry = entries.find(
        (entry) =>
          /* matches(entry.find, importee), */
          entry.find === importee,
      );
      /* 判断是否为入口模块 */
      const isEntry = !importer;

      // 如果不能匹配替换规则，或者当前模块是入口模块，则不会继续后面的别名替换流程
      if (!matchedEntry || isEntry) {
        return null;
      }

      // 执行替换操作
      const updatedId = importee.replace(
        matchedEntry.find,
        matchedEntry.replacement,
      );

      /* ===== END ===== */
      /* 理论上替换完成后，直接 return string 或对象 即可，但是仍需考虑一个问题，
      转译后的模块(本例中为 "./util.js")需不需要被其他模块所处理。*/
      /* 因此：需通过  this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子，重新发起一轮构建去处理 "./util.js" 依赖。 */
      /* 新一轮依赖处理，当前插件无需处理，则可以通过传入第三个参数 {skipSelf: true} 跳过 */
      console.log("\n触发第二轮依赖解析......\n");
      return this.resolve(
        updatedId,
        importer,
        Object.assign({ skipSelf: true }, resolveOptions),
      ).then((resolved) => {
        // 替换后的路径即 updateId 会经过别的插件进行处理
        /* 如果是个真实的地址，最终会被 rollup 替换为绝对路径，若为虚拟模块的话 */

        let finalResult = resolved;
        if (!finalResult) {
          // 如果其它插件没有处理这个路径，则直接返回 updateId
          finalResult = { id: updatedId };
        }
        return finalResult;
      });
    },
  };
}

function otherPlugin() {
  return {
    resolveId(importee, importer, resolveOptions) {
      log(importee, importer, "otherPlugin");
      if (importee === "./util.js") {
        console.log("otherPlugin 可以捕获到经 alias 插件 replace 后的模块");
      }
      /* 当返回为 null 时，该依赖的解析会自动调用下一个流程的调用 */
      return null;
    },
  };
}

function log(importee, importer, pluginName) {
  const isEntry = !importer;
  if (isEntry) {
    console.log(`${pluginName}解析: 入口文件`);
  } else {
    console.log(`${pluginName}解析: ${importee}`);
  }
}
