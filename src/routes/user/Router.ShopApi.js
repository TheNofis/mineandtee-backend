import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.ShopApi.js";
import validateonMiddleware from "../../middlewares/Middleware.Validateon.js";

import { query } from "express-validator";

router.get(
  "/ShopBalance",
  [
    query("ShopID").notEmpty(),
    query("Category").optional().isBoolean(),
    query("Group").optional().isBoolean(),
    query("ProductID").optional().isBoolean(),
    query("Product").optional().isBoolean(),
    query("Balance").optional().isBoolean(),
    query("FullPrice").optional().isBoolean(),
    query("MeasUnit").optional().isBoolean(),
    query("Callback").optional().isBoolean(),
  ],
  validateonMiddleware,
  controller.shopbalance,
);
router.get(
  "/ProductList",
  [
    query("Category").optional().isBoolean(),
    query("Group").optional().isBoolean(),
    query("ProductID").optional().isBoolean(),
    query("Product").optional().isBoolean(),
    query("Description").optional().isBoolean(),
    query("Link").optional().isBoolean(),
    query("ImageLink").optional().isBoolean(),
    query("FullPrice").optional().isBoolean(),
    query("MeasUnit").optional().isBoolean(),
  ],
  validateonMiddleware,
  controller.productlist,
);
router.get(
  "/ShopList",
  [
    query("ShopID").optional().isBoolean(),
    query("Name").optional().isBoolean(),
    query("City").optional().isBoolean(),
    query("GPS").optional().isBoolean(),
  ],
  validateonMiddleware,
  controller.shoplist,
);

export default router;
