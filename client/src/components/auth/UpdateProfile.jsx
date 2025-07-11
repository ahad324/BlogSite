import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { updateUser } from '../../utils/api';

function UpdateProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUser(user.id, formData);
      setUser(response.data);
      navigate(`/users/${user.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center">
        Update Profile
      </h2>
      {error && (
        <p className="text-red-500 mb-6 text-center" role="alert">
          {error}
        </p>
      )}
      <div className="space-y-6">
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
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-colors duration-300"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;