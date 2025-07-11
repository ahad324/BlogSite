import Joi from 'joi';
import mongoose from 'mongoose';

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const registerUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
});

export const createPostSchema = Joi.object({
  title: Joi.string().min(5).required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(5).optional(),
  content: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
});

export const createCommentSchema = Joi.object({
  content: Joi.string().min(2).required(),
  post: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.isValidObjectId(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    })
    .required(),
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().min(2).optional(),
});