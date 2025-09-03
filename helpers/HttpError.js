const messageList = {
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	409: "Conflict",
};

export const HttpError = (code, message = messageList[code]) => {
	const error = new Error(message);
	error.status = code;

	return error;
};
