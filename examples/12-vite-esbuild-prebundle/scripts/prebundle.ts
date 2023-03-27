import path from "path";
import fs from "fs-extra";
import { build } from "esbuild";
import resolve from "resolve";
import { normalizePath } from "vite";

const PRE_BUNDLE_DIR = "vendors";

async function preBundle(deps: string[]) {
  const flattenDepMap = {} as Record<string, string>;
  deps.map((item) => {
    const flattedName = item.replace(/\//g, "_");
    flattenDepMap[flattedName] = item;
  });
  const outputAbsolutePath = path.join(process.cwd(), PRE_BUNDLE_DIR);

  if (await fs.pathExists(outputAbsolutePath)) {
    await fs.remove(outputAbsolutePath);
  }

  // 调用 Esbuild 进行打包
  await build({
    entryPoints: flattenDepMap,
    outdir: outputAbsolutePath,
    bundle: true,
    minify: true,
    splitting: true,
    format: "esm",
    plugins: [
      {
        name: "pre-bundle",
        setup(build) {
          // bare import
          build.onResolve({ filter: /^[\w@][^:]/ }, async (args) => {
            if (!deps.includes(args.path)) {
              return;
            }
            const isEntry = !args.importer;
            const resolved = resolve.sync(args.path, {
              basedir: args.importer || process.cwd(),
            });
            return isEntry
              ? { path: resolved, namespace: "dep" }
              : { path: resolved };
          });
          build.onLoad({ filter: /.*/, namespace: "dep" }, (args) => {
            const entryPath = normalizePath(args.path);

            /* 1. 当 package.json 为 commonjs 包时 */
            const res = require(entryPath);

            // 拿出所有的具名导出
            const specifiers = Object.keys(res);

            /*  2. 当 package.json 中 type="module" 时 */
            /* const res = await import(entryPath); */
            /* 
               写法1： const specifiers = Object.keys(res).filter(
              (item) => item !== "default")
               写法2： const specifiers = Object.keys(res.default)
            ); */

            // 将 React 的 CommonJS 格式以 ESM 的格式导出。
            return {
              contents: `export { ${specifiers.join(
                ",",
              )} } from "${entryPath}"; export default require("${entryPath}")`,
              loader: "js",
              resolveDir: process.cwd(),
            };
          });
        },
      },
    ],
  });
}

export const EXTERNALS = [
  "react",
  "react-dom",
  "react-dom/client",
  "react/jsx-runtime",
];

preBundle(EXTERNALS);
