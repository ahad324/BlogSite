import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { formatDate } from '../../utils/helpers';
import { updateComment, deleteComment } from '../../utils/api';

function CommentCard({ comment, onCommentUpdated, onCommentDeleted }) {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    try {
      await updateComment(comment._id, { content });
      setEditing(false);
      onCommentUpdated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteComment(comment._id);
      onCommentDeleted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="card mb-4">
      {editing ? (
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field min-h-[100px]"
          />
          {error && <p className="text-error text-center">{error}</p>}
          <div className="flex space-x-4">
            <button onClick={handleUpdate} className="btn-primary">
              Save
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-text-secondary leading-relaxed mb-3">
            {comment.content}
          </p>
          <div className="flex justify-between text-sm text-text-muted">
            <span>By {comment.author.username}</span>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          {user && user.id === comment.author._id && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="btn-secondary"
              >
                Edit
              </button>
              <button onClick={handleDelete} className="btn-secondary">
                Delete
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommentCard;
