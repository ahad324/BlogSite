import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import { asyncHandler } from '../utils/helpers.js';

export const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const post = new Post({ title, content, tags, author: req.user.id });
  await post.save();
  res.status(201).json({ message: 'Post created successfully', post });
});

export const getPosts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    tag,
  } = req.query;
  const query = tag ? { tags: tag } : {};
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { [sort]: order === 'desc' ? -1 : 1 },
    populate: { path: 'author', select: '-password' },
  };
  const posts = await Post.paginate(query, options);
  res.json(posts);
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username email')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'username email' },
    });
  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }
  res.json(post);
});

export const updatePost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }
  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags || post.tags;
  post.updatedAt = Date.now();
  await post.save();
  res.json({ message: 'Post updated successfully', post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' });
  }
  await Post.deleteOne({ _id: req.params.id });
  await Comment.deleteMany({ post: req.params.id });
  res.json({ message: 'Post deleted successfully' });
});
