// Express app setup
import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

export default app;
