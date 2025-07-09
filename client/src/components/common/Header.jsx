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
    <header className="bg-surface border-b border-border shadow-card sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors"
        >
          BlogSite
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-text-secondary hover:text-accent transition-colors"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to={`/users/${user.id}`}
                className="text-text-secondary hover:text-accent transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-text-secondary hover:text-accent transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-text-secondary hover:text-accent transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-text-secondary hover:text-accent transition-colors"
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
