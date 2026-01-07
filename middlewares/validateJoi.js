import { HttpError } from "../helpers/HttpError.js";

export const validateJoi = schema => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const customError = HttpError(400);
      next(customError);
    }
    next();
  };
};