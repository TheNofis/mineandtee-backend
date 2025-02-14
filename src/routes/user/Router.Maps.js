import { Router } from "express";
const router = new Router();

import controller from "../../controllers/user/Controller.Maps.js";

router.get("/avatar/:username", controller.avatar);

export default router;
