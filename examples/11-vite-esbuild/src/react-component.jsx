// src/index.jsx
import Server from "react-dom/server";

let Greet = () => <h1>Hello, Jacky!</h1>;
console.log(Server.renderToString(<Greet />));