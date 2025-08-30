import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ctrlWrapper } from "../helpers/ctrlWrapper.js";
import { HttpError } from "../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
	const { username, password } = req.body;
	const existingUser = await User.findOne({ username });

	if (existingUser) {
		throw HttpError(400, "User already registered");
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({ username, password: hashedPassword });

	const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "23h" });
	await User.findByIdAndUpdate(user._id, { token });

	res.status(201).json({
		token,
		user: { username },
	});
};

const login = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) throw HttpError(401, "Email or password is wrong");

	const pwdCheck = await bcrypt.compare(password, user.password);
	if (!pwdCheck) throw HttpError(401, "Email or password is wrong");

	const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "23h" });

	await User.findByIdAndUpdate(user._id, { token });

	res.status(200).json({
		token,
		user: {
			username,
		},
	});
};

const logout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.status(204).end();
};

const current = async (req, res) => {
	const { _id } = req.user;
	const { name } = await User.findById(_id);
	res.status(200).json({ name });
};

export const ctrl = {
	register: ctrlWrapper(register),
	login: ctrlWrapper(login),
	logout: ctrlWrapper(logout),
	current: ctrlWrapper(current),
};
