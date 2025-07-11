import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import Joi from 'joi';

function PostForm({ onSubmit, initialData = {} }) {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    content: initialData.content || '',
    tags: initialData.tags || [],
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Joi schema matching backend validation
  const schema = Joi.object({
    title: Joi.string()
      .min(5)
      .required()
      .messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
      }),
    content: Joi.string()
      .required()
      .messages({
        'string.empty': 'Content is required',
        'any.required': 'Content is required',
      }),
    tags: Joi.array()
      .items(Joi.string().pattern(/^[a-zA-Z0-9-]+$/, 'alphanumeric with hyphens').min(1))
      .optional()
      .messages({
        'string.pattern.base': 'Tags can only contain letters, numbers, or hyphens',
        'string.min': 'Tags cannot be empty',
      }),
  });

  const validateField = (name, value) => {
    const fieldSchema = Joi.object({ [name]: schema.extract(name) });
    const { error } = fieldSchema.validate({ [name]: value });
    return error ? error.details[0].message : null;
  };

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return true;
    const newErrors = {};
    error.details.forEach((err) => {
      newErrors[err.path[0]] = err.message;
    });
    setErrors(newErrors);
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    if (value.endsWith(' ') && value.trim()) {
      const newTag = value.trim();
      const tagError = validateField('tags', [...formData.tags, newTag]);
      if (!tagError) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
        setTagInput('');
        setErrors((prev) => ({ ...prev, tags: null }));
      } else {
        setErrors((prev) => ({ ...prev, tags: tagError }));
      }
    } else {
      setTagInput(value);
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = formData.tags.filter((tag) => tag !== tagToRemove);
    setFormData({ ...formData, tags: updatedTags });
    const tagError = validateField('tags', updatedTags);
    setErrors((prev) => ({ ...prev, tags: tagError }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', content: '', tags: [] });
      setTagInput('');
      setErrors({});
    } catch (err) {
      setErrors({ general: err.response?.data?.error || 'Failed to create/update post' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const isFormValid = !validateField('title', formData.title) && !validateField('content', formData.content) && !validateField('tags', formData.tags);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-8">
        {initialData._id ? 'Edit Post' : 'Create Post'}
      </h2>
      {errors.general && (
        <p className="text-red-500 mb-6 text-center" role="alert">
          {errors.general}
        </p>
      )}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block mb-2 text-gray-300 font-medium"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-4 bg-gray-700 border ${errors.title ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            required
            aria-describedby="title-error"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1" id="title-error">
              {errors.title}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="content"
            className="block mb-2 text-gray-300 font-medium"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={`w-full p-4 bg-gray-700 border ${errors.content ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 min-h-[200px]`}
            required
            aria-describedby="content-error"
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1" id="content-error">
              {errors.content}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block mb-2 text-gray-300 font-medium"
          >
            Tags (press space to add)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <input
            type="text"
            id="tags"
            value={tagInput}
            onChange={handleTagInput}
            className={`w-full p-4 bg-gray-700 border ${errors.tags ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            placeholder="Type a tag and press space..."
            aria-describedby="tags-error"
          />
          {errors.tags && (
            <p className="text-red-500 text-sm mt-1" id="tags-error">
              {errors.tags}
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={`w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 ${
            !isFormValid || isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none'
          }`}
        >
          {isSubmitting
            ? 'Submitting...'
            : initialData._id
            ? 'Update Post'
            : 'Create Post'}
        </button>
      </div>
    </div>
  );
}

export default PostForm;