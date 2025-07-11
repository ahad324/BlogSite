import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import { asyncHandler } from '../utils/helpers.js';

export const createComment = asyncHandler(async (req, res) => {
  const { content, post } = req.body;
  const comment = new Comment({ content, author: req.user.id, post });
  await comment.save();
  await Post.findByIdAndUpdate(post, { $push: { comments: comment._id } });
  res.status(201).json({ message: 'Comment created successfully', comment });
});

export const getComments = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
  } = req.query;
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sort]: order === 'desc' ? -1 : 1 },
    populate: { path: 'author', select: 'username email profilePicture' },
  };
  const comments = await Comment.paginate({ post: req.params.postId }, options);
  res.json(comments);
});

export const updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findOne({
    _id: req.params.id,
    author: req.user.id,
  });
  if (!comment) {
    return res
      .status(404)
      .json({ message: 'Comment not found or unauthorized' });
  }
  comment.content = content || comment.content;
  comment.updatedAt = Date.now();
  await comment.save();
  res.json({ message: 'Comment updated successfully', comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({
    _id: req.params.id,
    author: req.user.id,
  });
  if (!comment) {
    return res
      .status(404)
      .json({ message: 'Comment not found or unauthorized' });
  }
  await Comment.deleteOne({ _id: req.params.id });
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id },
  });
  res.json({ message: 'Comment deleted successfully' });
});