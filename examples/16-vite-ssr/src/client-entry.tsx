// 客户端入口文件
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { fetchData } from "./ssr-entry";

/* 由于核心数据已由服务端请求后挂载在全局上, 因此客户端代码直接取就ok*/
/* 由于存在服务端预取数据失败的场景，需降级到 CSR 获取模式,客户端也需 fetchData() 兜底*/
// @ts-ignore
const data = window.__SSR_DATA__ ?? (await fetchData());

/* 注此时，渲染方式不再是 ReactDOM.creatRoot 或 render */
ReactDOM.hydrate(
  <React.StrictMode>
    <App data={data} />
  </React.StrictMode>,
  document.getElementById("root"),
);
