import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getCurrentUser,
  updateUser,
} from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerUserSchema, loginUserSchema, updateUserSchema } from '../utils/helpers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', getUser);
router.put('/profile', authMiddleware, validate(updateUserSchema), updateUser);

export default router;