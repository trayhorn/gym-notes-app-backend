import express from "express";
import morgan from "morgan";
import "dotenv/config";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import workoutsRouter from "./routes/workoutsRouter.js";
import paramsRouter from "./routes/paramsRouter.js";

export const app = express();

app.use(morgan("tiny"));
app.use(
	cors({
		origin: "*",
	})
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/workouts", workoutsRouter);
app.use("/params", paramsRouter);

app.use((_, res) => {
	res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
	const { status = 500, message = "Server error" } = err;
	res.status(status).json({ message });
});
