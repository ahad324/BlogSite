import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../utils/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 card">
      <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">
        Register
      </h2>
      {error && <p className="text-error mb-4 text-center">{error}</p>}
      <div className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-text-secondary font-medium"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-text-secondary font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-text-secondary font-medium"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>
        <button onClick={handleSubmit} className="btn-primary w-full">
          Register
        </button>
      </div>
      <p className="mt-6 text-center text-text-secondary">
        Already have an account?{' '}
        <a
          href="/login"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          Login
        </a>
      </p>
    </div>
  );
}

export default Register;
