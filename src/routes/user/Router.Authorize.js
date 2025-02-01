import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Authorize.js";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";

import { cookie } from "express-validator";

router.get(
  "/",
  [cookie("Authorization").notEmpty().length({ min: 10 })],
  validateonMiddleware,
  controller.search,
);

export default router;
