import ResponseModule from "../../utils/module/Response.Module.js";

import { getCachedData } from "../../db/connect/redis.js";
import fetch from "node-fetch";

import "dotenv/config";
import User from "../../db/model/User.js";

class controller {
  async avatar(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { username } = req?.params;

      const avatar = await getCachedData(
        `maps_avatar:${username}`,
        async () => {
          const user = await User.findOne({
            "profile.username": username,
          }).lean();

          const response = await fetch(
            `https://minotar.net/skin/${user?.profile?.avatar || username}.png`,
          );
          if (!response.ok) return res.status(500).json(Response.error());

          return (await response.buffer()).toString("base64");
        },
        60 * 60 * 24,
      );
      Response.success();

      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(avatar, "base64"));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
