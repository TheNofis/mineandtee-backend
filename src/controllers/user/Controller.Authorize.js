import jwt from "jsonwebtoken";
import ResponseModule from "../../utils/module/Response.Module.js";
import { v4 } from "uuid";

import User from "../../db/model/User.js";
import Rcon from "../../rcon/connect.js";

import bcrypt from "bcrypt";
import emailVerify from "../../utils/email/Email.EmailVerify.js";

const createToken = (id, role, username, emailVerified = false) => {
  return jwt.sign(
    { id, role, username, emailVerified },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 60 * 24,
    },
  );
};

class controller {
  async register(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { email, password, username, ingamename } = req.body;

      const user = await User.findOne({
        $or: [{ "profile.username": username }, { "profile.email": email }],
      });
      if (user !== null)
        return res.json(Response.error("User already exist", 2));

      const hashedPassword = await bcrypt.hash(password, 10);
      const id = v4();
      const emailCode = v4();

      await new User({
        id,
        password: hashedPassword,
        profile: {
          username,
          email,
          ingamename: ingamename === "" ? "none" : ingamename,
          register_ts: Date.now(),
        },
        emailCode,
      }).save();

      await emailVerify(
        email,
        username,
        `${process.env.FRONTEND_URL}/emailverify?emailCode=${emailCode}`,
      ).catch((err) => {
        return res.json(Response.error(err));
      });

      await Rcon.send(`authme register ${username} ${password}`).catch(
        (err) => {
          console.log(err);
        },
      );

      return res.json(Response.success("User registered", 3));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async login(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { identifier, password } = req?.query;

      const user = await User.findOne({
        $or: [
          { "profile.username": identifier },
          { "profile.email": identifier },
        ],
      });
      if (!user) return res.json(Response.error("Invalid password", 4));

      if (!user.emailVerified)
        return res.json(Response.error("Email not verified", 5));

      const validPassword = await bcrypt.compare(password, user?.password);

      if (!validPassword)
        return res.json(Response.error("Invalid password", 4));

      return res.json(
        Response.success(
          {
            token: createToken(
              user.id,
              user.role,
              user.profile.username,
              user.emailVerified,
            ),
          },
          10,
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async verify(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      return res.json(Response.success({ status: "verified" }));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async emailVerify(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { emailCode } = req?.body;

      const user = await User.findOne({ emailCode });
      if (!user) return res.json(Response.error("Invalid code", 6));

      await User.updateOne(
        { id: user.id },
        { emailVerified: true, emailCode: "" },
      ).catch((err) => {
        return res.json(Response.error(err));
      });

      return res.json(
        Response.success(
          {
            token: createToken(user.id, user.role, user.profile.username, true),
          },
          10,
        ),
      );
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

  async sendEmail(req, res) {
    const Response = new ResponseModule();
    try {
      Response.start();
      const { email } = req?.body;

      const user = await User.findOne({ "profile.email": email });
      if (user === null) return res.json(Response.error("User not found", 2));

      await emailVerify(
        user?.profile?.email,
        user?.profile?.username,
        `${process.env.FRONTEND_URL}/emailverify?emailCode=${user?.emailCode}`,
      ).catch((err) => {
        return res.json(Response.error(err));
      });

      return res.json(Response.success("Email send", 7));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }

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
      );

      if (!user) return res.json(Response.error("User not found", 1));

      return res.json(Response.success(user));
    } catch (error) {
      res.status(400).json(Response.error(error));
    }
  }
}

export default new controller();
