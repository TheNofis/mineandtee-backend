import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";

import Rcon from "../../rcon/connect.js";

class controller {
  async users(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const users = await User.find(
        { emailVerified: true },
        {
          _id: false,
          id: true,
          role: true,
          profile: true,
        },
      )
        .sort({ role: -1 })
        .lean();

      if (users.length === 0 || !users)
        return res.json(Response.error("Users not found", 1));

      return res.json(Response.success(users));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async actions(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req.params;
      const { action } = req.body;
      const user = await User.findOne({ id });
      if (user === null) return res.json(Response.error("User not found", 1));
      if (action === "approve") {
        await Rcon.Lobby.send(`whitelist add ${user?.profile?.username}`).catch(
          (err) => {
            return res.status(400).json(Response.error(err, 9));
          },
        ),
          (user.role = "user");
      }
      if (action === "ban") {
        await Rcon.Lobby.send(
          `whitelist remove ${user?.profile?.username}`,
        ).catch((err) => {
          console.log(err);
        }),
          (user.role = "ban");
      }

      await user.save();
      return res.json(
        Response.success(
          await User.find(
            { emailVerified: true },
            {
              _id: false,
              id: true,
              role: true,
              profile: true,
            },
          )
            .sort({ role: -1 })
            .lean(),
          8,
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
