import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { createComment } from '../../utils/api';

function CommentForm({ postId, onCommentAdded }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    try {
      await createComment({ content, post: postId });
      setContent('');
      setSuccess('Comment added successfully');
      setTimeout(() => setSuccess(null), 3000);
      setError(null);
      onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create comment');
    }
  };

  if (!user) return null;

  return (
    <div className="mb-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">
        Add a Comment
      </h3>
      {error && (
        <p className="text-red-500 mb-4 text-center" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-500 mb-4 text-center" role="alert">
          {success}
        </p>
      )}
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 min-h-[120px]"
          placeholder="Write your comment..."
          required
          aria-label="Comment content"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        >
          Submit Comment
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
