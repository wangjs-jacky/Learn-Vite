import * as rollup from "rollup";
import * as path from "path";
import typescript from "rollup-plugin-typescript2";

const srcPath = path.join(__dirname, "..", "src");

const watcher = rollup.watch({
  // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
  input: [
    path.join(srcPath, "/basic/index.ts"),
    path.join(srcPath, "basic/util.ts"),
  ],
  output: [
    {
      dir: "dist/watch/es",
      format: "esm",
    },
    {
      dir: "dist/watch/cjs",
      format: "cjs",
    },
  ],
  watch: {
    exclude: ["node_modules/**"],
    include: ["src/**"],
  },
  plugins: [typescript()],
});

// 监听 watch 各种事件
watcher.on("restart", () => {
  console.log("重新构建...");
});

watcher.on("change", (id) => {
  console.log("发生变动的模块id: ", id);
});

watcher.on("event", (e) => {
  if (e.code === "BUNDLE_END") {
    console.log("打包信息:", e);
  }
  if (e.code === "ERROR") {
    console.log("ERROR:", e.error);
  }
});
