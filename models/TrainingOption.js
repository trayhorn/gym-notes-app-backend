import {Schema, model} from "mongoose";

const trainingOptionsSchema = new Schema({
	owner: String,
	exercises: [{ type: String, required: true }],
	reps: [{ type: String, required: true }],
	weights: [{ type: String, required: true }],
});

export const TrainingOption = model(
	"trainingoption",
	trainingOptionsSchema
);