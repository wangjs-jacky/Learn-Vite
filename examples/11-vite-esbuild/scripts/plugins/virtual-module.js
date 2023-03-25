import * as esbuild from "esbuild";

let envPlugin = {
  name: "env",
  setup(build) {
    /* 解析 `import "env"` 依赖，并将其标识为 namespace "env-ns" */
    build.onResolve({ filter: /^env$/ }, (args) => ({
      path: args.path,
      namespace: "env-ns",
    }));

    /* 通过 namespace 捕获模块，并导出对象 {contents: "", loader:"json"} */
    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => ({
      contents: JSON.stringify(process.env),
      loader: "json",
    }));
  },
};

await esbuild.build({
  entryPoints: ["src/virtual-module.jsx"],
  outfile: "dist/plugins/virtual-module.js",
  bundle: true,
  plugins: [envPlugin],
});
