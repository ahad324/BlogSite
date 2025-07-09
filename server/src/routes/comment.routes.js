import express from 'express';
import {
  createComment,
  getComments,
  updateComment,
  deleteComment,
} from '../controllers/comment.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createCommentSchema, updateCommentSchema } from '../utils/helpers.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, validate(createCommentSchema), createComment);
router.get('/post/:postId', getComments);
router.put(
  '/:id',
  authMiddleware,
  validate(updateCommentSchema),
  updateComment
);
router.delete('/:id', authMiddleware, deleteComment);

export default router;
