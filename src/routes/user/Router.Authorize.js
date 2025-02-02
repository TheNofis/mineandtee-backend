import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Authorize.js";

import { body, header, query } from "express-validator";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

import rateLimit from "express-rate-limit";

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Ограничение на 10 попыток
  handler: (_, res) => {
    res.status(429).json({
      status: "Error",
      error: "Too many requests, please try again later",
      message: "Слишком много запросов, попробуйте позже",
    });
  },
});

router.get(
  "/profile",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["unverified", "user", "admin"]),
  controller.profile,
);

router.post(
  "/register",
  requestLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("username").isLength({ min: 3 }),
    body("ingamename").isLength({ min: 3 }),
  ],
  validateonMiddleware,
  controller.register,
);

router.get(
  "/login",
  requestLimiter,
  [
    query("password").isLength({ min: 8 }),
    query().custom((_, { req }) => {
      if (!req.query?.username || !req.query?.email)
        throw new Error("Either username or email is required");
      return true;
    }),
  ],
  controller.login,
);

router.get(
  "/email-verify",
  requestLimiter,
  [query("emailCode").isUUID(4)],
  validateonMiddleware,
  controller.emailVerify,
);

export default router;
