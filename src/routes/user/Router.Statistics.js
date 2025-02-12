import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Statistics.js";

router.get("/server", controller.server);

export default router;
