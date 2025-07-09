import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout, getCurrentUser } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const loginUser = async (credentials) => {
    try {
      const response = await login(credentials);
      setUser(response.data.user);
      navigate('/');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
