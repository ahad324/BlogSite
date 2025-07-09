import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

function PostForm({ onSubmit, initialData = {} }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags ? initialData.tags.join(', ') : '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim())
          : [],
      };
      await onSubmit(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 card">
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        {initialData._id ? 'Edit Post' : 'Create Post'}
      </h2>
      {error && <p className="text-error mb-4 text-center">{error}</p>}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-text-secondary font-medium"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block mb-2 text-text-secondary font-medium"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="input-field min-h-[200px]"
            required
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block mb-2 text-text-secondary font-medium"
          >
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g., tech, coding, blog"
          />
        </div>
        <button onClick={handleSubmit} className="btn-primary w-full">
          {initialData._id ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </div>
  );
}

export default PostForm;
