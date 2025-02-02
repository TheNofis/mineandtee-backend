import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.User.js";

import { header } from "express-validator";

import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

router.get(
  "/profile",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["unverified", "user", "admin"]),
  controller.profile,
);

export default router;
