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
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      await updatePost(id, data);
      setPost({ ...post, ...data });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!post && !error) return <LoadingSpinner />;
  if (error) return <p className="text-error text-center">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-12">
      {editing ? (
        <PostForm onSubmit={handleUpdate} initialData={post} />
      ) : (
        <div className="card">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {post.title}
          </h1>
          <div className="flex justify-between text-sm text-text-muted mb-6">
            <span>By {post.author.username}</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <p className="text-text-secondary leading-relaxed mb-8">
            {post.content}
          </p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {user && user.id === post.author._id && (
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary"
              >
                Edit Post
              </button>
              <button onClick={handleDelete} className="btn-secondary">
                Delete Post
              </button>
            </div>
          )}
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Comments
          </h2>
          <CommentForm postId={id} onCommentAdded={fetchComments} />
          {commentsLoading ? (
            <LoadingSpinner />
          ) : comments.length === 0 ? (
            <p className="text-text-muted">No comments yet.</p>
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
