import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [true, "Username is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			match: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/
		},
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: false }
);

userSchema.post("save", handleMongooseError);

export const authSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required().pattern(new RegExp("(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}")),
});

export const User = model("user", userSchema);
