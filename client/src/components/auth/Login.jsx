import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(formData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 card">
      <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">
        Login
      </h2>
      {error && <p className="text-error mb-4 text-center">{error}</p>}
      <div className="space-y-6">
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
          Login
        </button>
      </div>
      <p className="mt-6 text-center text-text-secondary">
        Don't have an account?{' '}
        <a
          href="/register"
          className="text-primary hover:text-primary-dark transition-colors"
        >
          Register
        </a>
      </p>
    </div>
  );
}

export default Login;
