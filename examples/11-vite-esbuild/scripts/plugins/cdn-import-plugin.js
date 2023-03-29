import * as esbuild from "esbuild";

async function runBuild() {
  await esbuild.build({
    absWorkingDir: process.cwd(),
    entryPoints: ["./src/cdn-module.jsx"],
    outdir: "dist/plugins",
    bundle: true,
    format: "esm",
    splitting: true,
    metafile: true,
    plugins: [
      {
        name: "esbuild:http",
        async setup(build) {
          let https = await import("https");
          let http = await import("http");

          /* 1. 拦截 CDN 请求直接依赖(找到并标识 namespace) */
          build.onResolve({ filter: /^https?:\/\// }, (args) => ({
            path: args.path,
            namespace: "http-url",
          }));

          // 拦截间接依赖的路径，并重写路径
          // tip: 间接依赖同样会被自动带上 `http-url`的 namespace
          build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => {
            /* debugger; */
            return {
              // 重写路径 https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL
              path: new URL(args.path, args.importer).toString(),
              namespace: "http-url",
            };
          });

          /* 2. 通过 fetch 请求加载 CDN 资源 */
          build.onLoad(
            { filter: /.*/, namespace: "http-url" },
            async (args) => {
              let contents = await new Promise((resolve, reject) => {
                /* 构造请求方法 */
                function fetch(url) {
                  console.log(`Downloading: ${url}`);
                  const method = url.startsWith("https") ? https : http;
                  const req = method
                    .get(url, (res) => {
                      if ([301, 302, 307].includes(res.statusCode)) {
                        /* 新发请求 */
                        fetch(new URL(res.headers.location, url).toString());
                        /* 取消请求 */
                        req.abort();
                      } else if (res.statusCode === 200) {
                        /* 响应成功 */
                        let chunks = [];
                        res.on("data", (chunk) => chunks.push(chunk));
                        res.on("end", () => {
                          resolve(Buffer.concat(chunks));
                        });
                      } else {
                        reject(
                          new Error(
                            `GET ${url} failed: status ${res.statusCode}`,
                          ),
                        );
                      }
                    })
                    .on("error", reject);
                }
                fetch(args.path);
              });

              /* 返回的 contents 后续仍参与解析
                 但解析（即执行）到以下语句时提示报错。
                 export * from '/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=imports/optimized/react.js' 
              */
              return { contents };
            },
          );
        },
      },
    ],
  });
}

runBuild()
  .then(() => {
    console.log("🚀 Build Finished!");
  })
  .catch((error) => {
    console.log("esbuild failed");
  });
