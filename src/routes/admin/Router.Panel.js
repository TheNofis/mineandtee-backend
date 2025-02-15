import { Router } from "express";
const router = new Router();

import controller from "../../controllers/admin/Controller.Panel.js";

import { header, body } from "express-validator";

import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

router.get(
  "/users",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.users,
);

router.patch(
  "/user/approve/:id",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.approve,
);

router.patch(
  "/user/ban/:id",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.ban,
);

router.delete(
  "/user/delete/:id",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.delete,
);

router.post(
  "/poll/create",
  [
    header("Authorization").notEmpty(),
    body("info").isObject(),
    body("answers").isArray(),
    body("close_ts").isInt(),
  ],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.createPoll,
);

export default router;
