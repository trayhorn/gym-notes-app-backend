import mongoose, {Schema} from "mongoose";

const exerciseSchema = new Schema(
	{
		name: { type: String, required: true },
		reps: { type: String, required: true },
		weight: { type: String, required: true },
		supersetGroup: { type: Number, required: false },
	},
	{ _id: false }
);

const workoutSchema = new Schema({
	owner: String,
	date: { type: Date, required: true },
	exercises: { type: [exerciseSchema], required: true },
});

export const Workout = mongoose.model("Workout", workoutSchema);