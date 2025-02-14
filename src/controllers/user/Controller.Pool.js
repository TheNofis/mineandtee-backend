import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";
import Pool from "../../db/model/Pool.js";

import "dotenv/config";

import STATUS from "../STATUS.js";

class controller {
  async vote(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { answer_id } = req.body;

      const user = await User.findOne(
        { id: req?.user?.id },
        {
          _id: false,
          profile: true,
          role: true,
        },
      ).lean();

      if (!user)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      const pool = await Pool.findOne({ id: req?.params?.id });
      if (!pool || pool.answers.length <= answer_id)
        return res.json(
          Response.error("Pool not found", STATUS.POOL_NOT_FOUND),
        );

      if (pool.votes.includes(user.id))
        return res.json(
          Response.error("You already voted", STATUS.USER_ALREADY_VOTED),
        );

      const updatePool = await Pool.updateOne(
        { id: req?.params?.id },
        { $push: { [`answers.${answer_id}.users`]: user.id } },
        { new: true },
      ).catch((err) => res.json(Response.error(err)));

      return res.json(Response.success(updatePool, STATUS.SUCCESS_VOTE));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async unvote(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();

      const { answer_id } = req.body;

      const user = await User.findOne(
        { id: req?.user?.id },
        {
          _id: false,
          profile: true,
          role: true,
        },
      ).lean();

      if (!user)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      const pool = await Pool.findOne({ id: req?.params?.id });
      if (!pool || pool.answers.length <= answer_id)
        return res.json(
          Response.error("Pool not found", STATUS.POOL_NOT_FOUND),
        );

      if (!pool.votes.includes(user.id))
        return res.json(
          Response.error("You haven't voted", STATUS.USER_NOT_VOTED),
        );

      const updatePool = await Pool.updateOne(
        { id: req?.params?.id },
        { $pull: { [`answers.${answer_id}.users`]: user.id } },
        { new: true },
      ).catch((err) => res.json(Response.error(err)));

      return res.json(Response.success(updatePool, STATUS.SUCCESS_UNVOTE));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
