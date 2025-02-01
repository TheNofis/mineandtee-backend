import { Router } from "express";
const router = new Router();

import controller from "../../controllers/uptime/Controller.Uptime.js";

router.get("/ping", controller.ping);

export default router;
