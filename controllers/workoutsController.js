import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { Workout } from "../models/Workout.js";

const getAllWorkouts = async (req, res) => {
  const { _id } = req.user;
  const workouts = await Workout.find({ owner: _id.toString() });

  res.status(200).json({ workouts });
}

const addWorkout = async (req, res) => {
  const { _id } = req.user;

  const createdWorkout = await Workout.create({ ...req.body, owner: _id.toString() });
  res.status(201).json({createdWorkout});
}

export const ctrl = {
	getAllWorkouts: ctrlWrapper(getAllWorkouts),
	addWorkout: ctrlWrapper(addWorkout),
};