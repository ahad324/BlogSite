import { useContext, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Menu, Transition } from '@headlessui/react';

function Header() {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <Menu as="div" className="relative" ref={menuRef}>
              <Menu.Button
                className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-300 text-lg font-medium"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isOpen ? 'M19 15l-7-7-7 7' : 'M19 9l-7 7-7-7'}
                  />
                </svg>
              </Menu.Button>
              <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-lg z-50">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to={`/users/${user.id}`}
                        className={`block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-blue-400 transition-colors duration-300 ${active ? 'bg-gray-600' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`block px-4 py-2 text-gray-300 hover:bg-gray-600 hover:text-blue-400 transition-colors duration-300 ${active ? 'bg-gray-600' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
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
