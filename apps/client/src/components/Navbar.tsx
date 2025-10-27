import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Code2, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic
    navigate('/login');
  };

  return (
    <nav className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <Code2 className="h-8 w-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Codura
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-dark-300 hover:text-dark-50 transition-colors font-medium"
            >
              Problems
            </Link>
            <Link
              to="/contests"
              className="text-dark-300 hover:text-dark-50 transition-colors font-medium"
            >
              Contests
            </Link>
            <Link
              to="/discuss"
              className="text-dark-300 hover:text-dark-50 transition-colors font-medium"
            >
              Discuss
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
            <div className="relative group">
              <button className="flex items-center space-x-2 text-dark-300 hover:text-dark-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <User size={18} className="text-white" />
                </div>
                <span className="hidden md:block font-medium">User</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-dark-900 border border-dark-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/submissions"
                    className="block px-4 py-2 text-dark-300 hover:bg-dark-800 hover:text-dark-50 transition-colors"
                  >
                    Submissions
                  </Link>
                  <hr className="my-2 border-dark-800" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-dark-800 transition-colors flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
