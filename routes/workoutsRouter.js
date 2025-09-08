import express from "express";
import { ctrl } from "../controllers/workoutsController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.get("/", authenticate, ctrl.getAllWorkouts);

router.post("/add", authenticate, ctrl.addWorkout);

export default router;