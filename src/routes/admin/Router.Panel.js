import { Router } from "express";
const router = new Router();

import controller from "../../controllers/admin/Controller.Panel.js";

import { body, header } from "express-validator";

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
  "/user/:id",
  [
    header("Authorization").notEmpty(),
    body("action").isIn(["approve", "reject", "ban"]),
  ],
  validateonMiddleware,
  AuthorizationMiddleware(["admin"]),
  controller.actions,
);

export default router;
