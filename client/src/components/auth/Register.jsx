import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/api';
import { Link } from 'react-router-dom';
import Joi from 'joi';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Joi schema matching backend validation
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .required()
      .messages({
        'string.min': 'Username must be at least 3 characters long',
        'string.empty': 'Username is required',
        'any.required': 'Username is required',
      }),
    email: Joi.string()
      .email({ tlds: false }) // Disable TLD validation to avoid topo error
      .required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setErrors({ general: err.response?.data?.message || 'Registration failed' });
    }
  };

  const isFormValid = !validateField('username', formData.username) && !validateField('email', formData.email) && !validateField('password', formData.password);

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
        Sign Up
      </h2>
      {errors.general && (
        <p className="text-red-500 mb-6 text-center" role="alert">
          {errors.general}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-gray-300 font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-4 bg-gray-700 border ${errors.username ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            required
            aria-describedby="username-error"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1" id="username-error">
              {errors.username}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-gray-300 font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-4 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            required
            aria-describedby="email-error"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1" id="email-error">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-gray-300 font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-4 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            required
            aria-describedby="password-error"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1" id="password-error">
              {errors.password}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 ${
            !isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none'
          }`}
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default Register;