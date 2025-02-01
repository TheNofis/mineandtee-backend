import jwt from "jsonwebtoken";
import ResponseModule from "../utils/module/Response.Module";

export const AuthorizationMiddleware = (role) => {
  return (req, res, next) => {
    const Response = new ResponseModule();
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      Response.start();

      if (!token)
        return res.status(403).json(Response.error("Токен не указан"));

      const decodeData = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodeData.roles.includes(role))
        return res.status(403).json(Response.error("Недостаточно прав"));

      req.user = decodeData;
      next();
    } catch (error) {
      return res
        .status(403)
        .json({ error: { message: "JWT token просрочен" } });
    }
  };
};
