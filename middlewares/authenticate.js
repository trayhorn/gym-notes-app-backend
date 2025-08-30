import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/User.js";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
	const { authorization = "" } = req.headers;
	const [bearer, token] = authorization.split(" ");

	if (!bearer || !token) throw HttpError(401);

	try {
		const { id } = jwt.verify(token, SECRET_KEY);
		const user = await User.findOne({ _id: id });
		if (!user || !user.token || token !== user.token) throw HttpError(401);
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};
