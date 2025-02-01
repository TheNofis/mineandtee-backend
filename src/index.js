import express from "express";
import http from "http";

import * as dotenv from "dotenv";

import cors from "cors";

import RouterUptime from "./routes/uptime/Router.Uptime.js";

import RouterShopApi from "./routes/user/Router.ShopApi.js";
import RouterSearch from "./routes/user/Router.Search.js";

import "./db/connect/mongodb.js";

const app = express();
const httpServer = http.createServer(app);

dotenv.config();

const backendPort = process.env.BACKENDPORT;

export default class Web {
  constructor({ port }) {
    this.port = port;
  }
  start() {
    // подключаем модуль
    app.use(cors());

    app.use(express.json({ type: "application/json" }));
    app.use(express.raw({ type: "text/json", limit: "50mb" }));

    app.use(express.urlencoded({ extended: true }));

    // подключаем роутеры
    app.use("/api/user", RouterShopApi);
    app.use("/api/user", RouterSearch);

    app.use("/api", RouterUptime);

    httpServer.listen(this.port, () => {
      console.log("Web good connect");
    });
  }
}
const WebServer = new Web({ port: backendPort });
WebServer.start();
