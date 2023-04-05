import processInfo from "virtual:env";
import configInfo from "virtual:config";
import ReactLogo from "./assets/react.svg";

function App() {
  console.log("processInfo", processInfo);
  console.log(ReactLogo);

  return (
    <div className="App">
      <ReactLogo />
      <h1>Hello world!</h1>
      <h2>编译时内容成功被注册到运行时环境：</h2>
      <h2>打印 vite 中被 resolved 的 config 内容</h2>
      <p style={{ border: "1px solid #000" }}>{JSON.stringify(configInfo)}</p>
      <h2>打印 process.env 的编译时内容</h2>
      <p style={{ border: "1px solid #000" }}>{JSON.stringify(processInfo)}</p>
      <br />
    </div>
  );
}

export default App;
