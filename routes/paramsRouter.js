import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { ctrl } from "../controllers/paramsController.js";

const router = express.Router();

router.get("/", authenticate, ctrl.getAllParams);

router.patch("/add", authenticate, ctrl.addParam);

router.patch("/delete", authenticate, ctrl.deleteParam);

export default router;