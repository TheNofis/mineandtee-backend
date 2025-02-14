import express from "express";
import http from "http";

import * as dotenv from "dotenv";

import cors from "cors";

import RouterUptime from "./routes/uptime/Router.Uptime.js";

import RouterStatisticsServer from "./routes/statistics/Router.Server.js";
import RouterAuthorize from "./routes/user/Router.Authorize.js";
import RouterUser from "./routes/user/Router.Profile.js";
import RouterPool from "./routes/user/Router.Pool.js";
import RouterMaps from "./routes/user/Router.Maps.js";

import RouterPanel from "./routes/admin/Router.Panel.js";

import "./db/connect/mongodb.js";

const app = express();
const httpServer = http.createServer(app);

dotenv.config();

const backendPort = process.env.BACKENDPORT || 3005;

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

    // Подключаем роутеры
    app.use("/api/statistics", RouterStatisticsServer);
    app.use("/api/user", RouterAuthorize);
    app.use("/api/maps", RouterMaps);
    app.use("/api/pool", RouterPool);
    app.use("/api/user", RouterUser);

    app.use("/api/admin", RouterPanel);

    app.use("/api", RouterUptime);

    httpServer.listen(this.port, () => {
      console.log("Web connected");
    });
  }
}
const WebServer = new Web({ port: backendPort });
WebServer.start();
