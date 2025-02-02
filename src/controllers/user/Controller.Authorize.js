import jwt from "jsonwebtoken";
import ResponseModule from "../../utils/module/Response.Module.js";
import { v4 } from "uuid";

import User from "../../db/model/User.js";

import bcrypt from "bcrypt";

class controller {
  async getToken(req, res) {
    const Response = new ResponseModule();
    try {
      const {} = req.query;
      Response.start();
      return res.json(Response.success(jwt.verify(token, process.env.JWT_KEY)));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async notVerified(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const users = await User.find({ "auth.verified": false });
      return res.json(Response.success(users));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async register(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { email, password, username, ingamename } = req.body;

      const user = await User.findOne({ email });
      if (user) return res.json(Response.error("User already exists"));

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(email, username, ingamename);

      await new User({
        id: v4(),
        email,
        password: hashedPassword,
        profile: {
          username,
          ingamename,
        },
        auth: {},
      }).save();
      return res.json(Response.success());
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async verify(req, res) {
    const Response = new ResponseModule();
    try {
      const {} = req.body;
      Response.start();
      return res.json(Response.success());
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async emailverify(req, res) {
    const Response = new ResponseModule();
    try {
      const {} = req.body;
      Response.start();
      return res.json(Response.success());
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}
export default new controller();
