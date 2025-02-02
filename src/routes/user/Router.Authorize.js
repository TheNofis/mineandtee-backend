import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Authorize.js";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";

import { body, cookie } from "express-validator";

// router.get(
//   "/login",
//   [cookie("Authorization").notEmpty().length({ min: 10 })],
//   validateonMiddleware,
//   controller.getToken,
// );

router.get("/notVerified", controller.notVerified);
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isStrongPassword(),
    body("username").isLength({ min: 3 }),
    body("ingamename").isLength({ min: 3 }),
  ],
  validateonMiddleware,
  controller.register,
);
router.patch("/verify", controller.verify);
router.patch("/emailverify", controller.emailverify);

export default router;
