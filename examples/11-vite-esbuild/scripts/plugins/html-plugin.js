import fs from "fs-extra";
import * as path from "path";
import * as esbuild from "esbuild";
import { cdnImportPlugin } from "./cdn-import-plugin.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createScript = (src) => `<script type="module" src=${src}></script>`;

const createLink = (src) => `<link rel="stylesheet" href="${src}"></link>`;

const generateHTML = (scripts, links) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Esbuild App</title>
  ${links.join("\n")}
</head>

<body>
  <div id="root"></div>
  ${scripts.join("\n")}
</body>

</html>
`;

const esbuildHTML = {
  name: "esbuild:html",
  setup(build) {
    /* 此钩子主要放在 onEnd */
    build.onEnd(async (buildResult) => {
      if (buildResult.errors.length) {
        return;
      }

      /* 通过 esbuild 获取此结果 */
      const { metafile } = buildResult;

      /* 1. 拼接 html */
      const scripts = [];
      const cssLinks = [];
      if (metafile) {
        const { outputs } = metafile;
        const assets = Object.keys(outputs);

        assets.forEach((asset) => {
          if (asset.endsWith(".js")) {
            scripts.push(createScript(asset));
          } else if (asset.endsWith(asset)) {
            cssLinks.push(createLink(asset));
          }
        });

        const templateContent = generateHTML(scripts, cssLinks);

        /* 写入磁盘 */
        console.log(__dirname);
        const templatePath = path.join(
          __dirname,
          "../../dist/plugins",
          "index.html",
        );

        await fs.writeFile(templatePath, templateContent);
      }
    });
  },
};

async function runBuild() {
  await esbuild.build({
    absWorkingDir: process.cwd(),
    entryPoints: ["./src/cdn-module.jsx"],
    outdir: "dist/plugins",
    bundle: true,
    format: "esm",
    splitting: true,
    /* 注意：设置 metafile 设置为 true */
    metafile: true,
    plugins: [cdnImportPlugin, esbuildHTML],
  });
}

runBuild()
  .then(() => {
    console.log("🚀 Build Finished!");
  })
  .catch((e) => {
    console.log("esbuild failed");
  });
