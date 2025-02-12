import ResponseModule from "../../utils/module/Response.Module.js";

import { getCachedData } from "../../db/connect/redis.js";
import fetch from "node-fetch";

import "dotenv/config";

class controller {
  async server(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const data = await getCachedData(
        `server_info`,
        async () => {
          const response = await fetch(
            `${process.env.STATISTICS_URL}/serverOverview?server=MineAndTee`,
          );
          const data = await response.json();
          return data?.numbers;
        },
        60,
      );
      return res.json(Response.success(data));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
