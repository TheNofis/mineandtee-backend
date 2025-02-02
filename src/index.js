import express from "express";
import http from "http";

import * as dotenv from "dotenv";

import cors from "cors";

import RouterUptime from "./routes/uptime/Router.Uptime.js";

import RouterAuthorize from "./routes/user/Router.Authorize.js";

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
    app.use("/api/user", RouterAuthorize);

    app.use("/api", RouterUptime);

    httpServer.listen(this.port, () => {
      console.log("Web good connect");
    });
  }
}
const WebServer = new Web({ port: backendPort });
WebServer.start();
