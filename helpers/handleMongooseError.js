export const handleMongooseError = (error, _, next) => {
	const { name, code } = error;
	if (name === "MongoServerError" && code === 11000) {
		error.status = 409;
		error.message = "Email or password is in use";
	} else {
		error.status = 400;
	}
	next();
};