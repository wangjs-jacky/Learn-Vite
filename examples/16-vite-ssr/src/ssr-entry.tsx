// entry-server.ts
// 导出 SSR 组件入口
import App from "./App";
import "./index.css";

function ServerEntry(props: any) {
  return <App />;
}

export { ServerEntry };
