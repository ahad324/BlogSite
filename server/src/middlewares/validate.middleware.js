export function validate(schema) {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next({ status: 400, message: error.message });
    }
  };
}
