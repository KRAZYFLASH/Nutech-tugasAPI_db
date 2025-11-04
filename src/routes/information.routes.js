import express from "express";

import { informationController } from "../controller/information.controller.js";
import { authUser } from "../middlewares/auth.js";

const informationRouter = express.Router();

informationRouter.get('/banner', informationController.getBanners);
informationRouter.get('/services', authUser, informationController.getServices);

export { informationRouter };