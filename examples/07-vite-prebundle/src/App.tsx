import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

/* 预构建问题：可不可以排除掉 loadable 这个 ESM 包？ */
import loadable from "@loadable/component";
/* 预构建问题：如何解决那些第三方包天然 vite 报错的问题 */
import { ArrowKeyStepper } from "react-virtualized";

console.log("loadable", loadable);
console.log("reactVirtualized", ArrowKeyStepper);

/* 预构建优化：动态导入 zh_CN.ts 模块，无法对其内部的模块进行分析 */
const importModule = (m: string) => import(`./locales/${m}.ts`);

function App() {
  const [count, setCount] = useState(0);
  // main.tsx

  setTimeout(() => {
    importModule("zh_CN");
  }, 2000);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
