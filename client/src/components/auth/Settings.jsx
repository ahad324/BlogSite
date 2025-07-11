import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { updateUser, getCurrentUser } from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

function Settings() {
  const { user, setUser, logoutUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: null,
  });
  const [preview, setPreview] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        const userData = response.data;
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          password: '',
          profilePicture: null,
        });
        setPreview(userData.profilePicture || '');
        setUser(userData);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user data');
      }
    };
    fetchUser();
  }, [setUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      if (formData.password) data.append('password', formData.password);
      if (formData.profilePicture)
        data.append('profilePicture', formData.profilePicture);

      const response = await updateUser(user.id, data);
      setUser(response.data);
      navigate(`/users/${user.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to logout');
    }
  };

  if (!user && !error) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-red-500 mb-6 text-center" role="alert">
        {error}
      </p>
    );

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
        Settings
      </h2>
      {error && (
        <p className="text-red-500 mb-6 text-center" role="alert">
          {error}
        </p>
      )}
      {isSubmitting && <LoadingSpinner />}
      <div className="space-y-6">
        <div className="flex justify-center mb-6">
          <img
            src={preview || 'https://via.placeholder.com/150'}
            alt="Profile preview"
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-600"
          />
        </div>
        <div>
          <label
            htmlFor="profilePicture"
            className="block mb-2 text-gray-300 font-medium"
          >
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            aria-describedby="profilePicture-error"
          />
        </div>
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
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
            aria-describedby="username-error"
          />
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
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            required
            aria-describedby="email-error"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-gray-300 font-medium"
          >
            Password (leave blank to keep current)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            aria-describedby="password-error"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none'
          }`}
        >
          Update Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Settings;
