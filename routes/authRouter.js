import express from "express";
import { ctrl } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.post("/logout", authenticate, ctrl.logout);

router.get("/current", authenticate, ctrl.current);

export default router;
