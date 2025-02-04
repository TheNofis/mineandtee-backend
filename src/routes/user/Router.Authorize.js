import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Authorize.js";

import { body, query, header } from "express-validator";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";
import { AuthorizationMiddleware } from "../../middlewares/Middleware.Auth.js";

import rateLimit from "express-rate-limit";

const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 15, // Ограничение на 10 попыток
  handler: (_, res) => {
    res.status(429).json({
      status: "Error",
      error: "Too many requests, please try again later",
      message: "Слишком много запросов, попробуйте позже",
    });
  },
});

const requestLimiterLogin = rateLimit({
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

router.post(
  "/register",
  requestLimiter,
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }),
    body("username")
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z0-9_]*$/),
  ],
  validateonMiddleware,
  controller.register,
);

router.get(
  "/login",
  requestLimiterLogin,
  [
    query("password").isLength({ min: 8 }),
    query("indifier").isLength({ min: 8 }),
  ],
  controller.login,
);

router.get(
  "/verify",
  [header("Authorization").notEmpty()],
  validateonMiddleware,
  AuthorizationMiddleware(["ban", "unverified", "user", "admin"]),
  controller.verify,
);

router.patch(
  "/email-verify",
  requestLimiter,
  [body("emailCode").isUUID(4)],
  validateonMiddleware,
  controller.emailVerify,
);

router.post(
  "/send-email",
  requestLimiter,
  [body("email").isEmail()],
  controller.sendEmail,
);
export default router;
