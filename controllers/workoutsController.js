import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { Workout } from "../models/Workout.js";

const getAllWorkouts = async (req, res) => {
  const { _id } = req.user;
  const workouts = await Workout.find({ owner: _id.toString() });

  res.status(200).json({ workouts });
}

const addWorkout = async (req, res) => {
  const { _id } = req.user;

  const createdWorkout = await Workout.create({ owner: _id.toString(), ...req.body });
  res.status(201).json({
		message: "success",
	});
}

const deleteWorkout = async (req, res) => {
  const { _id } = req.user;

  const { id: workoutId } = req.body;

  await Workout.findByIdAndDelete(workoutId);
  res.status(200).json({
    message: "success"
  });
}

export const ctrl = {
	getAllWorkouts: ctrlWrapper(getAllWorkouts),
	addWorkout: ctrlWrapper(addWorkout),
	deleteWorkout: ctrlWrapper(deleteWorkout),
};