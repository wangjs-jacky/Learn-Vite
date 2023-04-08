import express from "express";

async function createServer() {
  const app = express();

  app.listen(3000, () => {
    console.log("Express 服务器启动~，端口号:3000");
  });
}

createServer();
