import ResponseModule from "../../utils/module/Response.Module.js";
import User from "../../db/model/User.js";
import Poll from "../../db/model/Poll.js";

import "dotenv/config";

import STATUS from "../STATUS.js";

class controller {
  async getpolls(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      let polls = await Poll.find({}, { _id: false })
        .sort({ created_ts: -1 })
        .lean();

      polls = polls.map((poll) => {
        return {
          ...poll,
          is_voted: poll.answers.some((ans) =>
            ans.users.includes(req?.user?.username),
          ),
          voted_answer: poll.answers.find((ans) =>
            ans.users.includes(req?.user?.username),
          ),
        };
      });
      return res.json(Response.success(polls));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
  async vote(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { answer_id } = req.body;

      const user = await User.findOne(
        { id: req?.user?.id },
        {
          "profile.username": true,
          _id: false,
          id: true,
        },
      );

      if (!user)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      const poll = await Poll.findOne({ id: req?.params?.id });
      if (!poll || poll.answers.length <= answer_id)
        return res.json(
          Response.error("Poll not found", STATUS.POLL_NOT_FOUND),
        );

      const answer = poll.answers.find((ans) => ans.id === answer_id);
      if (!answer)
        return res.json(
          Response.error("Answer not found", STATUS.ANSWER_NOT_FOUND),
        );

      if (poll?.close_ts < Date.now())
        return res.json(Response.error("Poll is closed", STATUS.POLL_CLOSED));

      if (!answer.users.includes(user?.profile?.username)) {
        answer.users.push(user?.profile?.username);
        answer.votes_count += 1;
        poll.votes_count += 1;
        poll.is_voted = true;
        poll.voted_answer = answer.id;
        await poll.save();
      } else
        return res.json(
          Response.error("You already voted", STATUS.USER_ALREADY_VOTED),
        );

      return res.json(Response.success(poll, STATUS.SUCCESS_VOTE));
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
          "profile.username": true,
          _id: false,
          id: true,
        },
      );

      if (!user)
        return res.json(
          Response.error("User not found", STATUS.USER_NOT_FOUND),
        );

      const poll = await Poll.findOne({ id: req?.params?.id });
      if (!poll || poll.answers.length <= answer_id)
        return res.json(
          Response.error("Poll not found", STATUS.POLL_NOT_FOUND),
        );

      if (poll?.close_ts < Date.now())
        return res.json(Response.error("Poll is closed", STATUS.POLL_CLOSED));

      const answer = poll.answers.find((ans) => ans.id === answer_id);
      if (!answer)
        return res.json(
          Response.error("Answer not found", STATUS.ANSWER_NOT_FOUND),
        );
      if (answer.users.includes(user?.profile?.username)) {
        answer.users = answer.users.filter(
          (username) => username !== user?.profile?.username,
        );
        answer.votes_count -= 1;
        poll.votes_count -= 1;
        poll.is_voted = false;
        await poll.save();
      } else
        return res.json(
          Response.error("You already voted", STATUS.USER_ALREADY_VOTED),
        );

      return res.json(Response.success(poll, STATUS.SUCCESS_UNVOTE));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
