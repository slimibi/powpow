import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, actualTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        actualTheme === 'dark' 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className={`text-xl font-bold ${
                actualTheme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                PowerBI Clone
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dashboards..."
                className={`pl-10 pr-4 py-2 w-80 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  actualTheme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>

            <button className={`p-2 relative transition-colors ${
              actualTheme === 'dark' 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-400 hover:text-gray-500'
            }`}>
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                3
              </span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                actualTheme === 'dark'
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
            >
              {theme === 'light' && <Sun className="h-5 w-5" />}
              {theme === 'dark' && <Moon className="h-5 w-5" />}
              {theme === 'system' && <Monitor className="h-5 w-5" />}
            </button>

            <div className="relative group">
              <button className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                actualTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}>
                <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  {user?.firstName} {user?.lastName}
                </span>
              </button>

              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                actualTheme === 'dark'
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="py-1">
                  <div className={`px-4 py-2 text-sm border-b ${
                    actualTheme === 'dark'
                      ? 'text-gray-400 border-gray-700'
                      : 'text-gray-500 border-gray-200'
                  }`}>
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      actualTheme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center px-4 py-2 text-sm transition-colors ${
                      actualTheme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                      actualTheme === 'dark'
                        ? 'text-red-400 hover:bg-red-900/20'
                        : 'text-red-700 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;