import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      minlength: [2, 'Comment must be at least 2 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

// Add pagination plugin
commentSchema.plugin(mongoosePaginate);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
