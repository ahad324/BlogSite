import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { getPost, updatePost, deletePost } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import PostForm from './PostForm.jsx';
import CommentForm from '../comments/CommentForm.jsx';
import CommentCard from '../comments/CommentCard.jsx';
import { useComments } from '../../hooks/useComments';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import Pagination from '../common/Pagination.jsx';

function PostDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const {
    comments,
    loading: commentsLoading,
    pagination,
    fetchComments,
  } = useComments(id);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(id);
        setPost(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch post');
      }
    };
    fetchPost();
    fetchComments();
  }, [id,fetchComments]);

  const handleUpdate = async (data) => {
    try {
      await updatePost(id, data);
      setPost({ ...post, ...data });
      setEditing(false);
      setError(null);
      setSuccess('Post updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      setSuccess('Post deleted successfully');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (!post && !error) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-red-500 text-center" role="alert">
        {error}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-12">
      {success && (
        <p className="text-green-500 text-center mb-4" role="alert">
          {success}
        </p>
      )}
      {editing ? (
        <PostForm onSubmit={handleUpdate} initialData={post} />
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-6">
            {post.title}
          </h1>
          <div className="flex justify-between text-sm text-gray-400 mb-6">
            <span>By {post.author.username}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <p className="text-gray-300 leading-relaxed mb-8 text-lg">
            {post.content}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-emerald-600 transition-colors duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {user && user.id === post.author._id && (
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                aria-label="Edit post"
              >
                Edit Post
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
                aria-label="Delete post"
              >
                Delete Post
              </button>
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Comments</h2>
          <CommentForm postId={id} onCommentAdded={fetchComments} />
          {commentsLoading ? (
            <LoadingSpinner />
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-center">No comments yet.</p>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentCard
                  key={comment._id}
                  comment={comment}
                  onCommentUpdated={fetchComments}
                  onCommentDeleted={fetchComments}
                />
              ))}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => fetchComments({ page })}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PostDetail;
