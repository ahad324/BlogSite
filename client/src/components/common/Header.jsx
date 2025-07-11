import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

function Header() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300"
        >
          BlogSite
        </Link>
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to={`/users/${user.id}`}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              >
                Profile
              </Link>
              <Link
                to="/profile/update"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              >
                Update Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
