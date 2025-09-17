import {Schema, model} from "mongoose";

const trainingOptionsSchema = new Schema({
	owner: String,
	exercises: [{ type: String, required: true }],
	reps: [{ type: String, required: true }],
	weights: [{ type: String, required: true }],
});

trainingOptionsSchema.post("find", function (docs) {
	docs.forEach((doc) => {
		if (doc.weights && doc.weights.length > 0) {
			doc.weights.sort((a, b) => {
				const numA = parseFloat(a.replace(/[^0-9.,]/g, "").replace(",", "."));
				const numB = parseFloat(b.replace(/[^0-9.,]/g, "").replace(",", "."));
				return numA - numB;
			});
		}

		if (doc.reps && doc.reps.length > 0) {
			doc.reps = doc.reps
				.map((r) => r.replace("х", "x"))
				.sort((a, b) => {
					const [setsA, repsA] = a.split("x").map(Number);
					const [setsB, repsB] = b.split("x").map(Number);

					if (setsA !== setsB) return setsA - setsB;
					return repsA - repsB;
				});
		}
	});
});

export const TrainingOption = model(
	"trainingoption",
	trainingOptionsSchema
);