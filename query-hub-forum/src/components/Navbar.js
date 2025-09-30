import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold">
            Query Hub
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
              Home
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/ask-question" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Ask Question
                </Link>
                <Link to="/my-questions" className="hover:bg-blue-700 px-3 py-2 rounded">
                  My Questions
                </Link>
                <Link to="/leaderboard" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Leaderboard
                </Link>
                <Link to="/profile" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Profile
                </Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;