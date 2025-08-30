import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const register = async (req, res) => {
	const { username, password } = req.body;
	try {
		const existingUser = await User.findOne({ username });
		if (existingUser)
			return res.status(400).json({ message: "User already exists" });
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword });
		await user.save();
		res.status(201).json({ message: "User registered successfully" });
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await User.findOne({ username });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(400).json({ message: "Invalid credentials" });
		const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
		res.json({ token });
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};

export const logout = (req, res) => {
	// For JWT, logout is handled client-side by deleting the token
	res.json({ message: "Logged out successfully" });
};

export const current = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(404).json({ message: "User not found" });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: "Server error" });
	}
};
