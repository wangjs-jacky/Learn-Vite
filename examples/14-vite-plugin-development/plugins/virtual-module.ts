import { Plugin, ResolvedConfig } from "vite";

/* 虚拟模块名称 */
const virtualModuleId = "virtual:env";

const virtualConfigId = "virtual:config";

export default function virtualModulePlugin(): Plugin {
  let config: ResolvedConfig | null = null;
  return {
    /* 对于 vite 插件推荐使用 vite-plugin 的方式命名 */
    name: "vite-plugin-virtual-module",
    resolveId(id) {
      if (id === virtualModuleId) {
        // Vite 中约定对于虚拟模块，解析后的路径需要加上`\0`前缀
        return "\0" + virtualModuleId;
      }
      if (id === virtualConfigId) {
        return "\0" + virtualConfigId;
      }
    },
    configResolved(c: ResolvedConfig) {
      config = c;
    },
    load(id) {
      /* 加载虚拟模块 */
      if (id === "\0" + virtualModuleId) {
        return `export default ${JSON.stringify(process.env)}`;
      }
      if (id === "\0" + virtualConfigId) {
        return `export default ${JSON.stringify(config.env)}`;
      }
    },
  };
}
