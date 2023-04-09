// entry-server.ts
// 导出 SSR 组件入口
import App from "./App";
import "./index.css";

export function ServerEntry(props: any) {
  return <App />;
}

export async function fetchData() {
  return {
    user: "xxx",
  };
}
