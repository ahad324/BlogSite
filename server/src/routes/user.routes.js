import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  getCurrentUser,
} from '../controllers/user.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerUserSchema, loginUserSchema } from '../utils/helpers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerUserSchema), registerUser);
router.post('/login', validate(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/:id', getUser);

export default router;
