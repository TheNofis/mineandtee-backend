import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";

import { getCachedData } from "../../db/connect/redis.js";
import fetch from "node-fetch";

import "dotenv/config";

import Rcon from "../../rcon/connect.js";

class controller {
  async profile(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req?.user;
      const user = await User.findOne(
        { id },
        {
          _id: false,
          profile: true,
          role: true,
        },
      ).lean();
      if (!user) return res.json(Response.error("User not found", 1));

      const username = req?.user?.username;
      const stats = await getCachedData(`stats:${username}`, async () => {
        const response = await fetch(
          `${process.env.STATISTICS_URL}/player/?player=${username}`,
        );
        const data = await response.json();

        const newData = {
          uuid: data?.info?.uuid,
          // avatar: `https://crafatar.com/avatars/${data?.info?.uuid}`,
          online: data?.info?.online,
          player_kill: {
            total: data?.kill_data?.player_kills_total,
            monthly: data?.kill_data?.player_kills_30d,
            weekly: data?.kill_data?.player_kills_7d,
          },
          player_death: {
            total: data?.kill_data?.deaths_total,
            monthly: data?.kill_data?.deaths_30d,
            weekly: data?.kill_data?.deaths_7d,
          },
          mob_kill: {
            total: data?.kill_data?.mob_kills_total,
            monthly: data?.kill_data?.mob_kills_30d,
            weekly: data?.kill_data?.mob_kills_7d,
          },
          online_activity: {
            total: data?.info?.playtime,
            monthly: data?.online_activity?.playtime_30d,
            weekly: data?.online_activity?.playtime_7d,
          },
          session_count: {
            total: data?.info?.session_count,
            monthly: data?.online_activity?.session_count_30d,
            weekly: data?.online_activity?.session_count_7d,
          },
          ping: {
            best: data?.info?.best_ping,
            worst: data?.info?.worst_ping,
            average: data?.info?.average_ping,
          },
        };
        return newData;
      });

      if (stats) user.stats = stats;

      return res.json(Response.success(user));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async changeskin(req, res) {
    const Response = new ResponseModule();

    try {
      Response.start();
      const { id } = req?.user;
      const { skin } = req.body;

      console.log(`skin set ${skin} ${req?.user?.username}`);

      // Rcon.send(`skin set ${skin} ${req?.user?.username}`)
      //   .catch((err) => {
      //     return res.status(400).json(Response.error(err, 9));
      //   })
      //   .then((e) => {
      //     console.log(e);
      //   });
      // await Promise.all([
      //   User.findOneAndUpdate({ id }, { $set: { "profile.skin": skin } }).catch(
      //     (err) => {
      //       return res.status(400).json(Response.error(err, 0));
      //     },
      //   ),
      // ]);

      return res.json(Response.success());
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
