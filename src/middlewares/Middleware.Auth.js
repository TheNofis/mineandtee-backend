import jwt from "jsonwebtoken";
import ResponseModule from "../utils/module/Response.Module.js";
import User from "../db/models/User.js";
import STATUS from "../controllers/STATUS.js";

export const AuthorizationMiddleware = (roles) => {
  return async (req, res, next) => {
    const Response = new ResponseModule();
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      Response.start();

      if (!token)
        return res
          .status(403)
          .json(Response.error("Token not found", STATUS.TOKEN_EXPIRED));

      const decodeData = jwt.verify(token, process.env.JWT_SECRET);
      if (decodeData.role === "unverified")
        decodeData.role = (
          await User.findOne({ id: decodeData.id }, { _id: 0, role: 1 })
        )?.role;

      if (!decodeData?.emailVerified)
        return res
          .status(403)
          .json(
            Response.error("Email not verified", STATUS.EMAIL_NOT_CONFIRMED),
          );

      if (!roles.includes(decodeData.role))
        return res
          .status(403)
          .json(Response.error("Not enough rights", STATUS.NOT_ENOUGH_RIGHTS));

      req.user = decodeData;
      next();
    } catch (error) {
      return res
        .status(403)
        .json(Response.error("JWT token is invalid", STATUS.TOKEN_EXPIRED));
    }
  };
};
