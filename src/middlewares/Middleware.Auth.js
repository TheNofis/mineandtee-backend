import jwt from "jsonwebtoken";
import ResponseModule from "../utils/module/Response.Module.js";

// 1 - usernotfound
// 2 - userexists
// 3 - usercreated
// 4 - invalidpassword
// 5 - emailnotverified
// 6 - wrongemailcode
// 7 - emailsendcode
// 8 - userupdate
// 9 - rconerror
// 10 - successauth
// 11 - tokenexpired
// 12 - notenoughrights

export const AuthorizationMiddleware = (roles) => {
  return (req, res, next) => {
    const Response = new ResponseModule();
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      Response.start();

      if (!token)
        return res.status(403).json(Response.error("Token not found", 11));

      const decodeData = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodeData?.emailVerified)
        return res.status(403).json(Response.error("Email not verified", 5));

      if (!roles.includes(decodeData.role))
        return res.status(403).json(Response.error("Not enough rights", 12));

      req.user = decodeData;
      next();
    } catch (error) {
      return res.status(403).json(Response.error("JWT token is invalid", 11));
    }
  };
};
