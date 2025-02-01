import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Search.js";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";

import { query } from "express-validator";

router.get(
  "/search",
  [query("text").notEmpty().isString()],
  validateonMiddleware,
  controller.search,
);

export default router;
