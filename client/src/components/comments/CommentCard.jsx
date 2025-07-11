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
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-4">
      <div className="flex items-center mb-3">
        <img
          src={
            comment.author.profilePicture || 'https://via.placeholder.com/40'
          }
          alt={`${comment.author.username}'s profile`}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <span className="text-gray-400">{comment.author.username}</span>
      </div>
      {editing ? (
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 min-h-[120px]"
            aria-label="Edit comment"
          />
          {error && (
            <p className="text-red-500 text-center" role="alert">
              {error}
            </p>
          )}
          <div className="flex space-x-4">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              aria-label="Save comment"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-700 text-gray-200 font-semibold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-300 leading-relaxed mb-3 text-lg">
            {comment.content}
          </p>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          {user && user.id === comment.author._id && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setEditing(true)}
                className="bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                aria-label="Edit comment"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                aria-label="Delete comment"
              >
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
