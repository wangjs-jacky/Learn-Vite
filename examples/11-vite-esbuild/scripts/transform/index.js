import * as esbuild from "esbuild";

/* Esbuild 的 transform 功能
   提供两个 API ： transform or transformSync
*/

/* Vite 的底层样式采用这个 transform 这个异步 API 进行 TS 或者 jsx 的单文件转译的。 */

async function runTransfrom() {
  const content = await esbuild.transform(
    "const isNull = (str: string): boolean => str.length > 0;",
    {
      sourcemap: true,
      /* 这里调用 esubild 提供的单文件转译能力 */
      loader: "ts",
    },
  );
  console.log("content", content);
}

runTransfrom();
