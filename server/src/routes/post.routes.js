import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createPostSchema, updatePostSchema } from '../utils/helpers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createPostSchema), createPost);
router.get('/', getPosts);
router.get('/:id', getPost);
router.put('/:id', authMiddleware, validate(updatePostSchema), updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
