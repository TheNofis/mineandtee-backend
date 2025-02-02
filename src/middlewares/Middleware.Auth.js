import jwt from "jsonwebtoken";
import ResponseModule from "../utils/module/Response.Module.js";

export const AuthorizationMiddleware = (roles) => {
  return (req, res, next) => {
    const Response = new ResponseModule();
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      Response.start();

      if (!token)
        return res
          .status(403)
          .json(Response.error("Token not found", "Токен не указан"));

      const decodeData = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodeData?.emailVerify)
        return res
          .status(403)
          .json(Response.error("Email not verified", "Почта не подтверждена"));

      if (!roles.includes(decodeData.role))
        return res
          .status(403)
          .json(Response.error("Not enough rights", "Недостаточно прав"));

      req.user = decodeData;
      next();
    } catch (error) {
      return res
        .status(403)
        .json(
          Response.error("JWT token is invalid", "JWT токен недействителен"),
        );
    }
  };
};
