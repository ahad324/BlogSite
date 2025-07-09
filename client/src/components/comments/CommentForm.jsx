import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { createComment } from '../../utils/api';

function CommentForm({ postId, onCommentAdded }) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment({ content, post: postId });
      setContent('');
      onCommentAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create comment');
    }
  };

  if (!user) return null;

  return (
    <div className="mb-8 card">
      <h3 className="text-xl font-semibold text-text-primary mb-4">
        Add a Comment
      </h3>
      {error && <p className="text-error mb-4 text-center">{error}</p>}
      <div className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-field min-h-[100px]"
          placeholder="Write your comment..."
          required
        />
        <button onClick={handleSubmit} className="btn-primary">
          Submit Comment
        </button>
      </div>
    </div>
  );
}

export default CommentForm;
