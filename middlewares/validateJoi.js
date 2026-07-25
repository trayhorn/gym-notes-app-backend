import { HttpError } from '../helpers/HttpError.js'

export const validateJoi = (schema) => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      if ((error.details[0].message = '"email" must be a valid email')) {
        const customError = HttpError(400, 'Invalid email format')
        next(customError)
      } else {
        const customError = HttpError(400)
        next(customError)
      }
    }
    next()
  }
}
