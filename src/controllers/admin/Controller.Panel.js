import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";

import Rcon from "../../rcon/connect.js";
import STATUS from "../STATUS.js";

class controller {
  async users(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const users = await getUserList();

      if (users.length === 0 || !users)
        return res.json(
          Response.error("Users not found", STATUS.USER_NOT_FOUND),
        );

      return res.json(Response.success(users));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async approve(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req.params;

      const user = await User.findOne({ id });
      if (user === null)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      user.role = "user";
      await Rcon.Lobby.send(`whitelist add ${user?.profile?.username}`);
      await user.save();

      return res.json(
        Response.success(await getUserList(), STATUS.USER_ACCEPTED),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async ban(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req.params;

      const user = await User.findOne({ id });
      if (user === null)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      user.role = "ban";

      await Rcon.Lobby.send(`whitelist remove ${user?.profile?.username}`);

      await user.save();

      return res.json(
        Response.success(await getUserList(), STATUS.USER_BANNED),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async delete(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { id } = req.params;

      const user = await User.findOne({ id });
      if (user === null)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      await Rcon.Lobby.send(`whitelist remove ${user?.profile?.username}`);
      await User.deleteOne({ id });

      return res.json(
        Response.success(await getUserList(), STATUS.USER_DELETED),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

async function getUserList() {
  return await User.find(
    { emailVerified: true },
    {
      _id: false,
      id: true,
      role: true,
      profile: true,
    },
  )
    .sort({ role: 1 })
    .lean();
}

export default new controller();
