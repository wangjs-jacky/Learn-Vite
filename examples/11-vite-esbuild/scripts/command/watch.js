import * as esbuild from "esbuild";

let ctx = await esbuild.context({
  entryPoints: ["src/react-component.jsx"],
  outdir: "dist/commadn/watch",
  bundle: true,
});

await ctx.watch();
console.log("watching...");

/* 10s 后自动关闭 */
await new Promise((r) => setTimeout(r, 10 * 1000));
await ctx.dispose();
console.log("stopped watching");
