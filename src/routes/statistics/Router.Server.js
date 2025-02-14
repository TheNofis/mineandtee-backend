import { Router } from "express";
const router = new Router();
import controller from "../../controllers/statistics/Controller.Server.js";
router.get("/server", controller.server);
export default router;
