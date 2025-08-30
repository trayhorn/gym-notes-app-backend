import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const userSchema = new Schema(
	{
		username: {
			type: String,
			// required: [true, "Name is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const authSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

export const User = model("user", userSchema);
