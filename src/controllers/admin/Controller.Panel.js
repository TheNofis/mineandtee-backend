import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";
import Pool from "../../db/model/Pool.js";

import Rcon from "../../rcon/connect.js";
import STATUS from "../STATUS.js";

import { v4 } from "uuid";

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
  async createPool(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { title, description, answers, create_ts, close_ts } = req.body;

      if (answers.length < 1)
        return res.json(
          Response.error("Answers not found", STATUS.POOL_NOT_FOUND),
        );

      const pool = new Pool({
        id: v4(),
        title,
        description,
        answers: answers,
        create_ts,
        close_ts,
      });
      await pool.save();

      return res.json(Response.success(pool, STATUS.SUCCESS_POOL_CREATED));
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
