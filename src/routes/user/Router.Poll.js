import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Poll.js";

import { body, header } from "express-validator";

import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

router.get(
  "/",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["user", "admin"]),
  controller.getpolls,
);

router.patch(
  "/vote/:id",
  [header("Authorization").notEmpty(), body("answer_id").isUUID()],
  validateonMiddleware,
  AuthorizationMiddleware(["user", "admin"]),
  controller.vote,
);

router.patch(
  "/unvote/:id",
  [header("Authorization").notEmpty(), body("answer_id").isUUID()],
  validateonMiddleware,
  AuthorizationMiddleware(["user", "admin"]),
  controller.unvote,
);

export default router;
