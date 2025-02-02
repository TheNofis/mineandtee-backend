import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Authorize.js";

import { body, query } from "express-validator";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";

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
    query("indifier").isLength({ min: 8 }),
  ],
  controller.login,
);

router.patch(
  "/email-verify",
  requestLimiter,
  [body("emailCode").isUUID(4)],
  validateonMiddleware,
  controller.emailVerify,
);

export default router;
