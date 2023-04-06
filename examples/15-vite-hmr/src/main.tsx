import { renderClient } from "./render";
import { initState } from "./state";

/* main 包含两个模块：render 模块以及 state 模块 */
renderClient();

/* 难点：函数刷新会丢失数据，需缓存 */
initState();

/* 主页面监听 module 变化 */
if (import.meta.hot) {
  import.meta.hot.accept(["./render.ts", "./state.ts"], (modules) => {
    const [renderModule, stateModule] = modules;
    if (renderModule) {
      // 触发 render 模块刷新
      renderModule.renderClient();
    }
    if (stateModule) {
      // 触发 state 模块刷新
      stateModule.initState();
    }
    console.log(modules);
  });
}
