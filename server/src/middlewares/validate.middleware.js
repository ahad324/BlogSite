import Joi from 'joi';

export function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      // Format Joi error details into a clear message
      if (error instanceof Joi.ValidationError) {
        const errorMessage = error.details.map((detail) => detail.message).join('; ');
        return next({ status: 400, message: errorMessage });
      }
      next({ status: 400, message: 'Invalid request data' });
    }
  };
}