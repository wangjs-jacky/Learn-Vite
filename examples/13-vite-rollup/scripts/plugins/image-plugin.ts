import * as rollup from "rollup";
import * as path from "path";
import * as fs from "fs";
import { DIST_PATH, SRC_PATH } from "const";

const defaultOption = {
  dom: false,
  exclude: null,
  include: null,
};

// 常用 inputOptions 配置
const inputOptions = {
  input: path.join(SRC_PATH, "plugin", "image.js"),
  plugins: [
    myImage({
      dom: true,
    }),
  ],
};

/* 支持的图标格式 */
const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function myImage(opts = {}) {
  const options = { ...defaultOption, ...opts };
  return {
    name: "rollup:image",
    load(id) {
      /* 1. 获取文件后缀名 */
      const fileExtname = path.extname(id);
      const mime = mimeTypes[fileExtname];

      if (!mime) {
        /* 非图标格式文件 */
        return null;
      }

      const isSvg = fileExtname === ".svg";
      const format = isSvg ? "utf-8" : "base64";
      const source = fs.readFileSync(id, format).replace(/[\r\n]+/gm, "");
      const dataUri = `data:${mime};${format},${source}`;
      const code = options.dom
        ? domTemplate({ dataUri })
        : constTemplate({ dataUri });
      return code.trim();
    },
  };
}

function domTemplate({ dataUri }) {
  return `
  var img = new Image();
  img.src = "${dataUri}";
  export default img;
  `;
}

function constTemplate({ dataUri }) {
  return `
  var img = "${dataUri}";
  export default img;
  `;
}

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write({
    dir: path.join(DIST_PATH, "plugin", "image"),
    format: "cjs",
  });
}

build()
  .then(() => {
    console.log("🚀 Build Finished!");
  })
  .catch((error) => {
    console.log("rollup failed", error);
  });
