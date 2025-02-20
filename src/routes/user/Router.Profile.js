import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Profile.js";

import { body, header } from "express-validator";

import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

router.get(
  "/profile",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["ban", "unverified", "user", "admin"]),
  controller.profile,
);

router.get(
  "/profile/:username",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["ban", "unverified", "user", "admin"]),
  controller.getProfile,
);

router.patch(
  "/changeskin",
  [header("Authorization").notEmpty(), body("skin").matches(/^[a-zA-Z0-9_]*$/)],
  validateonMiddleware,
  AuthorizationMiddleware(["user", "admin"]),
  controller.changeskin,
);

export default router;
